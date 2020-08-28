import React from "react";
import { Map } from "../../components/map";
import "./index.scss";

export const AreaMapPage = () => {
    return (
        <div className="page">
            <Map withAreaControll />
        </div>
    );
};
