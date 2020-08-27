import React, { useEffect, useState } from "react";
import { getZones } from "../../api";
import "./index.scss";

const baseClass = "map-area-popup";

export const MapAreaPopup = ({ onCancel, onSave }) => {
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState(1);

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const data = await getZones();
                setZones(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchZones();
    }, []);

    const handleChange = (e) => {
        setSelectedZone(Number(e.target.value));
    };

    const handleClickSave = () => {
        onSave(selectedZone);
    };

    return (
        <div className={baseClass}>
            <span className={`${baseClass}__label`}>Please, select zone:</span>
            <select className={`${baseClass}__select`} value={selectedZone} onChange={handleChange}>
                {zones.map((zone) => {
                    return (
                        <option className={`${baseClass}__option`} key={zone.id} value={zone.id}>
                            {zone.title}
                        </option>
                    );
                })}
            </select>
            <div className={`${baseClass}__controls`}>
                <button type="button" className={`${baseClass}__button`} onClick={onCancel}>
                    Cancel
                </button>
                <button type="button" className={`${baseClass}__button`} onClick={handleClickSave}>
                    Save
                </button>
            </div>
        </div>
    );
};
