import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import { MapAreaPopup } from "../../components/map-area-popup";

export class AreaMapControl extends L.Control {
    activeModel = null;

    onAdd(map) {
        this.map = map;
        this.container = document.createElement("div");
        this.init();
        return this.container;
    }

    onRemove(map) {
        if (this.container) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    onCancel = () => {
        console.log("cancel");
    };

    onSave = () => {
        console.log("save");
    };

    createActiveModel = ({ id, geometry, radius }) => {};

    deleteActiveModel = () => {
        this.activeModel = null;
    };

    showPopup = (center) => {
        const popupContainer = document.createElement("div");
        this.popup = L.popup({ minWidth: 200, closeOnClick: false })
            .setLatLng(center)
            .setContent(popupContainer)
            .openOn(this.map);
        ReactDOM.render(<MapAreaPopup onCancel={this.onCancel} onSave={this.onSave} />, popupContainer);
    };

    onCreate = (e) => {
        console.log(e);
        if (e.shape === "Polygon") {
        } else if (e.shape === "Rectangle") {
        } else if (e.shape === "Circle") {
            const center = e.layer._latlng;
            this.showPopup(center);
        }
    };

    init() {
        this.map.on("pm:create", this.onCreate);
    }
}
