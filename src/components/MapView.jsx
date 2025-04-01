import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSummaries } from "../api/advisoryService";
import { MapDragManager } from "./MapDragManager.jsx";
import { LabelTileLayer } from "./LabelTileLayer.jsx";
import PopupInfoBox from "./PopupInfoBox.jsx";
import CountrySearch from "./CountrySearch.jsx";
import {useTheme} from "./ThemeContent.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { VectorTileLayer } from "./VectorTileLayer.jsx";
import BrandingFooter from "./Footer.jsx";

function MapView()
{
    const [summaries, setSummaries] = useState([]);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const navigate = useNavigate();
    const isDraggingRef = useRef(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const { theme } = useTheme();

    // Get all summaries.
    useEffect(() => {
        getAllSummaries().then(setSummaries);
    }, []);

    // useEffect for deselecting countries.
    useEffect(() => {
        const mapContainer = document.querySelector(".leaflet-container");
        if (!mapContainer) return;

        const handleMapClick = (e) => {
            if(isDraggingRef.current) return; // Skip if the map was just dragged.
            if(!e.target.closest("path"))
            {
                // Deselect any selected country.
                setSelectedCountry(null);
                setHoveredCountry(null);
            }
        };

        mapContainer.addEventListener("click", handleMapClick);
        return () => mapContainer.removeEventListener("click", handleMapClick);
    }, [summaries]);

    return (
        <div className="relative h-screen w-full">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                minZoom={2}
                maxZoom={10}
                scrollWheelZoom={true}
                maxBounds={[[-85, -999], [85, 999]]}
                maxBoundsViscosity={1.0}
                className="h-full w-full"
                whenCreated={(map) => {
                    if(!map.getPane("labels"))
                    {
                        map.createPane("labels");
                        const labelsPane = map.getPane("labels");
                        labelsPane.style.zIndex = 650;
                        labelsPane.style.pointerEvents = "none";
                        labelsPane.style.backgroundColor = "transparent";
                    }
                }}
            >
                <TileLayer
                    url={
                        theme === "dark"
                        ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
                        : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                    }
                />

                <VectorTileLayer
                    summaries={summaries}
                    selectedCountry={selectedCountry}
                    setSelectedCountry={setSelectedCountry}
                    setHoveredCountry={setHoveredCountry}
                />

                <LabelTileLayer />
                <MapDragManager isDraggingRef={isDraggingRef} />
            </MapContainer>

            <BrandingFooter />

            <ThemeToggle />

            <CountrySearch summaries={summaries} />

            {hoveredCountry && (
                <PopupInfoBox
                    hoveredCountry={hoveredCountry}
                    selectedCountry={selectedCountry}
                    navigate={navigate}
                />
            )}

        </div>
    );
}

export default MapView;
