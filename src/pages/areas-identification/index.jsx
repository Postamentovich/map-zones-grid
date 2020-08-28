import React from "react";
import "./index.scss";
import { useState } from "react";
import { searchArea, getZones } from "../../api";
import { useEffect } from "react";

const baseClass = "area-identification-page";
export const AreaIdentificationPage = () => {
    const [lat, setLat] = useState(47.720849190702324);
    const [lng, setLng] = useState(13.2440185546875);
    const [zones, setZones] = useState([]);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            try {
                const zones = await getZones();
                setZones(zones);
            } catch (error) {
                console.error(error);
            }
        };
        fetch();
    }, []);

    const onClick = async () => {
        try {
            const areas = await searchArea(lat, lng);
            setAreas(areas);
        } catch (error) {
            setAreas([]);
        }
    };

    return (
        <div className={baseClass}>
            <h3>Please enter coordinates:</h3>
            <label htmlFor="lng">Longitude</label>
            <input type="number" id="lng" value={lng} onChange={(e) => setLng(e.target.value)} />
            <label htmlFor="lat">Latitude</label>
            <input type="number" id="lat" value={lat} onChange={(e) => setLat(e.target.value)} />
            <button type="button" onClick={onClick}>
                Find zones
            </button>
            {areas.map((area) => {
                const zone = zones.find((el) => area.zoneId === el.id);
                return <div>{zone.title}</div>;
            })}
        </div>
    );
};
