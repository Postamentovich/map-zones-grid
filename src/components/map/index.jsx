import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { AreaMapControl } from "../../map-controls/area-control";
import { GridMapControl } from "../../map-controls/grid-control";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "./index.scss";

const mapId = "leaflet-map-id";

export const Map = ({ withAreaControll = false, withGridControll = false }) => {
    useEffect(() => {
        const map = L.map(mapId).setView([47.57652571374621, 14.3316650390625], 8);
        const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
        const areaMapControl = new AreaMapControl();
        const gridMapControl = new GridMapControl();
        L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken,
        }).addTo(map);
        if (withAreaControll) {
            map.pm.addControls({
                position: "topleft",
                drawMarker: false,
                drawCircleMarker: false,
                drawPolyline: false,
                cutPolygon: false,
            });
            map.addControl(areaMapControl);
        }
        if (withGridControll) {
            map.pm.addControls({
                position: "topleft",
                drawMarker: false,
                drawCircleMarker: false,
                drawPolyline: false,
                cutPolygon: false,
                drawPolygon: false,
                drawCircle: false,
                editMode: false,
                dragMode: false,
            });
            map.addControl(gridMapControl);
        }
    }, [withAreaControll, withGridControll]);

    return <div id={mapId} />;
};
