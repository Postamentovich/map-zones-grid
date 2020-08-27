import React from "react";
import { Map } from "../../components/map";
import "./index.scss";
import { useEffect } from "react";
import { areaService } from "../../services/area-service";

export const AreaMapPage = () => {
    useEffect(() => {
        areaService.init();
    }, []);

    return (
        <div className="area-page">
            <Map withGeoman />
        </div>
    );
};
