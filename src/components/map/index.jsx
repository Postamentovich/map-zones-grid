import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "./index.scss";
import { AreaMapControl } from "../../controls/area-map-control";

const mapId = "leaflet-map-id";

export const Map = ({ withGeoman = false }) => {
    useEffect(() => {
        const map = L.map(mapId).setView([47.57652571374621, 14.3316650390625], 8);
        const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
        const areaMapControl = new AreaMapControl();
        L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken,
        }).addTo(map);
        if (withGeoman) {
            map.pm.addControls({
                position: "topleft",
                drawMarker: false,
                drawCircleMarker: false,
                drawPolyline: false,
            });
            map.addControl(areaMapControl);
        }
    }, [withGeoman]);

    return <div id={mapId} />;
};
