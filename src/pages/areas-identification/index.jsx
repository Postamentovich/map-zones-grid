import React from "react";
import "./index.scss";

const baseClass = "area-identification-page";
export const AreaIdentificationPage = () => {
    return (
        <div className={baseClass}>
            <h3>Please enter coordinates:</h3>
            <label htmlFor="lng">Longitude</label>
            <input type="number" id="lng" />
            <label htmlFor="lat">Latitude</label>
            <input type="number" id="lat" />
            <button>Find zones</button>
        </div>
    );
};
