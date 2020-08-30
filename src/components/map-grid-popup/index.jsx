import React, { useState } from "react";
import "./index.scss";

const baseClass = "map-grid-popup";

export const MapGridPopup = ({ onCancel, onSave }) => {
    const [columns, setColumns] = useState(10);
    const [rows, setRows] = useState(10);
    const [title, setTitle] = useState("");

    const handleClickSave = () => {
        onSave({ columns, rows, title });
    };

    return (
        <div className={baseClass}>
            <label className={`${baseClass}__label`} htmlFor="title">
                Title
            </label>
            <input
                className={`${baseClass}__input`}
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
            />
            <label className={`${baseClass}__label`} htmlFor="columns">
                Columns
            </label>
            <input
                className={`${baseClass}__input`}
                type="number"
                id="columns"
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
            />
            <label className={`${baseClass}__label`} htmlFor="rows">
                Rows
            </label>
            <input
                className={`${baseClass}__input`}
                type="number"
                id="rows"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
            />
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
