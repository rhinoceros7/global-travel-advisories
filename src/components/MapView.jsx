import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSummaries } from "../api/advisoryService";
import { MapDragManager } from "./MapDragManager.jsx";
import { LabelTileLayer } from "./LabelTileLayer.jsx";
import { DynamicWrappedGeoJSON } from "./DynamicWrappedGeoJSON.jsx";
import PopupInfoBox from "./PopupInfoBox.jsx";
import CountrySearch from "./CountrySearch.jsx";
import {useTheme} from "./ThemeContent.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const riskColors = {
    1: "#15803D",
    2: "#FACC15",
    3: "#F97316",
    4: "#DC2626",
    default: "#9e9e9e"
};

function MapView()
{
    const [geoJsonData, setGeoJsonData] = useState(null);
    const [summaries, setSummaries] = useState([]);
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const navigate = useNavigate();
    const isDraggingRef = useRef(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const countryLayersRef = useRef({});
    const { theme } = useTheme();

    // Get all summaries.
    useEffect(() => {
        getAllSummaries().then(setSummaries);

        fetch("/data/country_boundaries.geo.json")
            .then(res => res.json())
            .then(setGeoJsonData)
            .catch((err) => console.error("Failed to load GeoJSON", err));
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

    // Apply highlight for a selected country across the whole map,
    useEffect(() => {
        // Loop through all countries in the registry
        for(const country in countryLayersRef.current)
        {
            countryLayersRef.current[country].forEach(layer => {
                const riskLevel = getRiskLevel(layer.feature.properties.ADMIN);
                // If this country is selected, apply the highlight style.
                if(country === selectedCountry)
                {
                    layer.setStyle({
                        fillColor: riskColors[riskLevel] || riskColors.default,
                        fillOpacity: 0.9,
                        color: "#ffffff",
                        weight: 3,
                    });
                }
                else
                {
                    // Otherwise, reset the style.
                    layer.setStyle({
                        fillColor: riskColors[riskLevel] || riskColors.default,
                        fillOpacity: 0.7,
                        color: "#333",
                        weight: 1,
                    });
                }
            });
        }
    }, [selectedCountry, summaries]);

    const getRiskLevel = (countryName) => {
        const match = summaries.find(
            (c) => c.country.toLowerCase() === countryName.toLowerCase()
        );
        return match?.overall_risk_level || "default";
    };

    const onEachCountry = useCallback((feature, layer) => {
        const name = feature.properties.ADMIN;
        const countryNameLower = name.toLowerCase();
        const riskLevel = getRiskLevel(name);
        const color = riskColors[riskLevel] || riskColors.default;

        // Set initial style for the country.
        layer.setStyle({
            fillColor: color,
            fillOpacity: 0.7,
            color: "#333",
            weight: 1,
        });

        layer.options.interactive = true;

        // Register the layer in the global registry for its country.
        if(!countryLayersRef.current[countryNameLower])
        {
            countryLayersRef.current[countryNameLower] = [];
        }
        countryLayersRef.current[countryNameLower].push(layer);

        layer.on('remove', () => {
            const arr = countryLayersRef.current[countryNameLower];
            if (arr) {
                countryLayersRef.current[countryNameLower] = arr.filter(l => l !== layer);
            }
        });

        layer.on({
            click: () => {
                console.log("Clicked on:", name);
                // Set this country as the selected one.
                setSelectedCountry(countryNameLower);
                // Update the hovered country info as before.
                setHoveredCountry(
                    summaries.find(
                        (c) => c.country.toLowerCase() === countryNameLower
                    ) || { country: name, summary: "No data available." }
                );
            },
            mouseover: () => {
                layer._map.getContainer().style.cursor = "pointer";
            },
            mouseout: () => {
                layer._map.getContainer().style.cursor = "";
            },
        });
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

                {geoJsonData && (
                    <DynamicWrappedGeoJSON data={geoJsonData} onEachFeature={onEachCountry} />
                )}

                <LabelTileLayer />
                <MapDragManager isDraggingRef={isDraggingRef} />
            </MapContainer>

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
