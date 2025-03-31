import {TileLayer, useMap} from "react-leaflet";
import {useEffect, useState} from "react";

export function LabelTileLayer()
{
    const map = useMap();
    const [paneCreated, setPaneCreated] = useState(false);

    useEffect(() => {
        if(!map.getPane("labels"))
        {
            map.createPane("labels");
            const pane = map.getPane("labels");
            pane.style.zIndex = 650;
            pane.style.pointerEvents = "none";
            pane.style.backgroundColor = "transparent";
        }
        setPaneCreated(true);
    }, [map]);

    if (!paneCreated) return null;

    return (
        <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c', 'd']}
            pane="labels"
        />
    );
}