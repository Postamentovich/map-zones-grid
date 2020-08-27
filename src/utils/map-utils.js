import * as turf from "@turf/turf";

export function getCenterZoneByGeometry(geometry) {
    const features = turf.featureCollection(
        geometry.map((el) => {
            return turf.point([el.lat, el.lng]);
        }),
    );
    const center = turf.center(features);
    return turf.getCoord(center);
}
