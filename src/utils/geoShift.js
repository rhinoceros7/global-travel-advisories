export function shiftGeoJSON(geojson, deltaLng)
{
    const shifted = JSON.parse(JSON.stringify(geojson));
    shifted.features.forEach((feature) => {
        shiftCoords(feature.geometry, deltaLng);
    });
    return shifted;
}

export function shiftCoords(geometry, deltaLng)
{
    const applyShift = (coords) =>
        coords.map((c) => (Array.isArray(c[0]) ? applyShift(c) : [c[0] + deltaLng, c[1]]));
    geometry.coordinates = applyShift(geometry.coordinates);
}