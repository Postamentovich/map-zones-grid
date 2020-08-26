import React from "react";
import "./index.scss";

const baseClass = "map-area-popup";

export const MapAreaPopup = ({ onCancel, onSave }) => {
    return (
        <div className={baseClass}>
            <span className={`${baseClass}__label`}>Please, select zone:</span>
            <select className={`${baseClass}__select`}>
                <option className={`${baseClass}__option`}>Пункт 1</option>
                <option className={`${baseClass}__option`}>Пункт 2</option>
            </select>
            <div className={`${baseClass}__controls`}>
                <button type="button" className={`${baseClass}__button`} onClick={onCancel}>
                    Cancel
                </button>
                <button type="button" className={`${baseClass}__button`} onClick={onSave}>
                    Save
                </button>
            </div>
        </div>
    );
};
