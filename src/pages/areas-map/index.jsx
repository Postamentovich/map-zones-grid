import React from "react";
import { Map } from "../../components/map";
import "./index.scss";
import { useEffect } from "react";
import { getAreas } from "../../api";

export const AreaMapPage = () => {
    useEffect(() => {
        getAreas();
    }, []);
    return (
        <div className="area-page">
            <Map withGeoman />
        </div>
    );
};
