import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import { MapAreaPopup } from "../../components/map-area-popup";
import { getCenterZoneByGeometry } from "../../utils/map-utils";

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
        this.popup.remove();
        this.deleteActiveZone();
        this.activeModel = null;
    };

    onSave = () => {
        console.log("save");
    };

    deleteActiveZone = () => {
        this.activeModel.layer.remove();
    };

    showPopup = (center) => {
        const popupContainer = document.createElement("div");
        this.popup = L.popup({ minWidth: 200, closeOnClick: false, closeButton: false })
            .setLatLng(center)
            .setContent(popupContainer)
            .openOn(this.map);
        ReactDOM.render(<MapAreaPopup onCancel={this.onCancel} onSave={this.onSave} />, popupContainer);
    };

    onCreate = (e) => {
        console.log(e)
        const permissionShapes = ["Rectangle", "Polygon", "Circle"];
        if (!permissionShapes.includes(e.shape)) return;
        this.activeModel = { geometry: null, radius: null, layer: null, center: null, shape: null };
        if (e.shape === "Rectangle" || e.shape === "Polygon") {
            const geometry = e.layer._latlngs[0];
            this.activeModel.center = getCenterZoneByGeometry(geometry);
            this.activeModel.geometry = geometry;
        } else if (e.shape === "Circle") {
            const center = e.layer._latlng;
            this.activeModel.center = center;
            this.activeModel.radius = e.layer._mRadius;
        }
        this.activeModel.layer = e.layer;
        this.activeModel.shape = e.shape;
        this.showPopup(this.activeModel.center);
    };

    init() {
        this.map.on("pm:create", this.onCreate);
        L.circle([47.615421267605434, 13.083343505859377], { radius: 16886.22137850406 }).addTo(this.map);
    }
}
