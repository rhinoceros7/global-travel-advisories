import {useMap} from "react-leaflet";
import {useEffect, useRef} from "react";
import L from "leaflet";
import { shiftGeoJSON } from "../utils/geoShift.js";

export function DynamicWrappedGeoJSON({ data, onEachFeature })
{
    const map = useMap();
    const layersRef = useRef({});

    useEffect(() => {
        if (!data) return;

        const updateVisibleWraps = () => {
            const bounds = map.getBounds();
            const west = bounds.getWest();
            const east = bounds.getEast();

            // Figure out which wraps are currently visible (e.g., -720, -360, 0, 360, 720)
            const visibleWraps = new Set();
            for(let shift = -3; shift <= 3; shift++)
            {
                const offset = shift * 360;
                if(offset >= west - 360 && offset <= east + 360)
                {
                    visibleWraps.add(shift);
                }
            }

            // Add missing layers
            for(let shift of visibleWraps)
            {
                if(!layersRef.current[shift])
                {
                    const geojson = shift === 0 ? data : shiftGeoJSON(data, shift * 360);
                    const layer = L.geoJSON(geojson, {
                        onEachFeature,
                        //renderer: L.canvas(), // This causes clickability issues, leave out for now
                        interactive: true,
                    }).addTo(map);
                    layersRef.current[shift] = layer;
                }
            }

            // Remove layers that are no longer visible
            for(let shift in layersRef.current)
            {
                if(!visibleWraps.has(Number(shift)))
                {
                    layersRef.current[shift].remove();
                    delete layersRef.current[shift];
                }
            }
        };

        updateVisibleWraps();
        map.on("moveend", updateVisibleWraps);
        return () => {
            map.off("moveend", updateVisibleWraps);
            for(let shift in layersRef.current)
            {
                layersRef.current[shift].remove();
            }
        };
    }, [map, data, onEachFeature]);

    return null;
}