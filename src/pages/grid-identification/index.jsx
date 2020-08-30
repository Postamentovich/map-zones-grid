import React from "react";
import { useState } from "react";
import { searchGridCell } from "../../api";

const baseClass = "identification-page";
export const GridIdentificationPage = () => {
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [cell, setCell] = useState(null);
    const [isSearch, setIsSearch] = useState(false);

    const onClick = async () => {
        try {
            setCell(null);
            const cell = await searchGridCell(lat, lng);
            setCell(cell);
            setIsSearch(true);
        } catch (error) {
            setIsSearch(true);
            setCell(null);
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
                Find Cell
            </button>
            {isSearch &&
                (cell ? (
                    <div className={`${baseClass}__zone-title`}>
                        Found cell: {cell.column}
                        {cell.row}
                    </div>
                ) : (
                    <div className={`${baseClass}__zone-title`}>Cell not found</div>
                ))}
        </div>
    );
};
