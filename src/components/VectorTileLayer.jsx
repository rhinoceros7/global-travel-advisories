import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.vectorgrid";

export function VectorTileLayer({ summaries, setHoveredCountry, setSelectedCountry, selectedCountry })
{
    const map = useMap();
    const layerRef = useRef(null);
    const prevSelectedCountry = useRef(null);

    const riskColors = {
        1: "#15803D",
        2: "#FACC15",
        3: "#F97316",
        4: "#DC2626",
        default: "#9e9e9e"
    };

    // Fix the misnaming of Hong Kong.
    const normalizeAdminName = (name) => {
        if (name === "Hong Kong S.A.R.") return "Hong Kong";
        return name;
    };

    const getRiskLevel = (adminName) => {
        const normalizedName = normalizeAdminName(adminName);
        const match = summaries.find(
            (c) => c.country === normalizedName
        );
        return match?.overall_risk_level || "default";
    };

    // Define default style for non-selected features.
    const generateStyle = () => ({
        country_boundaries: (properties) => {
            const adminName = properties.ADMIN;
            const riskLevel = getRiskLevel(adminName);
            return {
                fill: true,
                fillColor: riskColors[riskLevel] || riskColors.default,
                fillOpacity: 0.7,
                color: "#333333",
                weight: 1,
                stroke: true
            };
        }
    });

    useEffect(() => {
        if (!map || layerRef.current) return;

        // Create the vector tile layer.
        const vectorTileLayer = L.vectorGrid.protobuf(
            "https://travel-advisory-tile-server.onrender.com/data/country_boundaries/{z}/{x}/{y}.pbf",
            {
                vectorTileLayerStyles: generateStyle(),
                interactive: true,
                getFeatureId: (f) => f.properties.ADMIN
            }
        );

        layerRef.current = vectorTileLayer;

        vectorTileLayer.on("click", (e) => {
            // Prevent the event from bubbling up.
            e.originalEvent.stopPropagation();
            const admin = e.layer.properties.ADMIN;
            const match = summaries.find(
                (c) => c.country === admin
            );
            setHoveredCountry(match || { country: admin, summary: "No data available." });
            setSelectedCountry(admin);
        });

        map.addLayer(vectorTileLayer);

        return () => {
            map.removeLayer(vectorTileLayer);
            layerRef.current = null;
        };
    }, [map, summaries, setHoveredCountry, setSelectedCountry]);

    // Update only the style for the selected feature when selectedCountry changes.
    useEffect(() => {
        if(layerRef.current)
        {
            // Reset style for the previously selected feature.
            if(prevSelectedCountry.current && prevSelectedCountry.current !== selectedCountry)
            {
                layerRef.current.resetFeatureStyle(prevSelectedCountry.current);
            }
            // Apply the new style for the currently selected feature.
            if(selectedCountry)
            {
                const riskLevel = getRiskLevel(selectedCountry);
                const fillColor = riskColors[riskLevel] || riskColors.default;
                layerRef.current.setFeatureStyle(selectedCountry, {
                    fill: true,
                    fillColor,
                    fillOpacity: 0.9,
                    color: "#ffffff",
                    weight: 3,
                    stroke: true
                });
            }
            prevSelectedCountry.current = selectedCountry;
        }
    }, [selectedCountry, summaries]);

    return null;
}
