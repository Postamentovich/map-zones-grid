import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./index.scss";

const mapId = "leaflet-map-id";

export const Map = () => {
    useEffect(() => {
        const mymap = L.map(mapId).setView([47.57652571374621, 14.3316650390625], 8);
        const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
        L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
            attribution:
                'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken,
        }).addTo(mymap);
    }, []);

    return <div id={mapId} />;
};