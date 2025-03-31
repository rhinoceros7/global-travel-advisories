import {useMap} from "react-leaflet";
import {useEffect} from "react";

export function MapDragManager({ isDraggingRef })
{
    const map = useMap();

    useEffect(() => {
        const handleMoveStart = () => {
            isDraggingRef.current = true;
        };

        const handleMoveEnd = () => {
            setTimeout(() => {
                isDraggingRef.current = false;
            }, 50); // Slight delay to separate click from drag.
        };

        map.on("movestart", handleMoveStart);
        map.on("moveend", handleMoveEnd);

        return () => {
            map.off("movestart", handleMoveStart);
            map.off("moveend", handleMoveEnd);
        };
    }, [map]);

    return null;
}