import React from "react";
import "./index.scss";
import { useState } from "react";
import { searchArea, getZones } from "../../api";
import { useEffect } from "react";

const baseClass = "identification-page";
export const AreaIdentificationPage = () => {
    const [lat, setLat] = useState(47.720849190702324);
    const [lng, setLng] = useState(13.2440185546875);
    const [zones, setZones] = useState([]);
    const [areas, setAreas] = useState([]);
    const [isSearch, setIsSearch] = useState(false);

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
            const includedAreas = [];
            const processAreas = areas.reduce((acc, val) => {
                if (!includedAreas.includes(val.zoneId)) {
                    acc.push(val);
                    includedAreas.push(val.zoneId);
                }
                return acc;
            }, []);
            console.log(processAreas);
            setIsSearch(true);
            setAreas(processAreas);
        } catch (error) {
            setAreas([]);
        }
    };

    return (
        <div className={baseClass}>
            <h3>Please enter coordinates:</h3>
            <label className={`${baseClass}__label`} htmlFor="lng">
                Longitude
            </label>
            <input
                className={`${baseClass}__input`}
                type="number"
                id="lng"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
            />
            <label className={`${baseClass}__label`} htmlFor="lat">
                Latitude
            </label>
            <input
                className={`${baseClass}__input`}
                type="number"
                id="lat"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
            />
            <button type="button" onClick={onClick} className={`${baseClass}__button`}>
                Find zones
            </button>
            {isSearch &&
                (areas.length ? (
                    <div className={`${baseClass}__zone-title`}>Found zones:</div>
                ) : (
                    <div className={`${baseClass}__zone-title`}>Zones not found</div>
                ))}
            {areas.map((area) => {
                const zone = zones.find((el) => area.zoneId === el.id);
                if (!zone) return null;
                return (
                    <div className={`${baseClass}__zone`} key={area.zoneId}>
                        {zone.title}
                    </div>
                );
            })}
        </div>
    );
};
