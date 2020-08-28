import React from "react";
import { Map } from "../../components/map";

export const GridMapPage = () => {
    return (
        <div className="page">
            <Map withGridControll />
        </div>
    );
};
