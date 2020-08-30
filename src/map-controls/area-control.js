import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import { MapAreaPopup } from "../components/map-area-popup";
import { getAreas, createArea, updateArea, deleteArea, getZones } from "../api";

export class AreaMapControl extends L.Control {
    activeModel = null;
    zones = [];
    constructor() {
        super();
        this.getZones();
    }

    getZones = async () => {
        try {
            const zones = await getZones();
            this.zones = zones;
        } catch (error) {
            console.error(error);
        }
    };

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

    onCancelArea = () => {
        this.popup.remove();
        this.activeModel.layer.remove();
        this.activeModel = null;
    };

    onSaveArea = async (zoneId) => {
        const shape = this.activeModel.shape === "Rectangle" ? "Polygon" : this.activeModel.shape;
        const coordinates =
            this.activeModel.shape === "Circle"
                ? [{ ...this.activeModel.center, radius: this.activeModel.radius }]
                : this.activeModel.geometry;
        const model = {
            zoneId,
            shape,
            coordinates,
        };
        try {
            const area = await createArea(model);
            this.popup.remove();
            if (!this.zones.length) await this.getZones();
            const popupTitle = this.zones.find((el) => el.id === area.zoneId).title;
            this.activeModel.layer
                .on("pm:edit", (e) => this.onEditArea(area, e))
                .on("pm:remove", (e) => this.onRemoveArea(area.id, e))
                .bindPopup(popupTitle);
            this.activeModel = null;
        } catch (error) {
            console.error(error);
        }
    };

    showPopup = (center) => {
        const popupContainer = document.createElement("div");
        this.popup = L.popup({ minWidth: 200, closeOnClick: false, closeButton: false })
            .setLatLng(center)
            .setContent(popupContainer)
            .openOn(this.map);
        ReactDOM.render(<MapAreaPopup onCancel={this.onCancelArea} onSave={this.onSaveArea} />, popupContainer);
    };

    onCreateArea = (e) => {
        const permissionShapes = ["Rectangle", "Polygon", "Circle"];
        if (!permissionShapes.includes(e.shape)) return;
        this.activeModel = { geometry: null, radius: null, layer: null, center: null, shape: null };
        if (e.shape === "Rectangle" || e.shape === "Polygon") {
            this.activeModel.center = e.layer.getCenter();
            this.activeModel.geometry = e.layer.getLatLngs()[0];
        } else if (e.shape === "Circle") {
            const center = e.layer._latlng;
            this.activeModel.center = center;
            this.activeModel.radius = e.layer._mRadius;
        }
        this.activeModel.layer = e.layer;
        this.activeModel.shape = e.shape;
        this.showPopup(this.activeModel.center);
    };

    onEditArea = async (area, e) => {
        const newModel = {
            ...area,
            coordinates:
                area.shape === "Circle" ? [{ ...e.layer._latlng, radius: e.layer._mRadius }] : e.layer.getLatLngs()[0],
        };
        try {
            await updateArea(newModel);
        } catch (error) {
            console.error(error);
        }
    };

    onRemoveArea = async (id) => {
        try {
            await deleteArea(id);
        } catch (error) {
            console.error(error);
        }
    };

    init() {
        this.map.on("pm:create", this.onCreateArea);
        this.drawAreas();
    }

    getAreas = async () => {
        try {
            const areas = await getAreas();
            return areas;
        } catch (error) {
            console.error(error);
        }
    };

    async drawAreas() {
        const areas = await this.getAreas();
        if (!Array.isArray(areas)) return;
        areas.forEach((area) => {
            if (area.shape === "Polygon") {
                this.drawPolygon(area);
            }
            if (area.shape === "Circle") {
                this.drawCircle(area);
            }
        });
    }

    async drawCircle(area) {
        const coor = area.coordinates[0];
        if (!coor) return;
        const radius = coor.radius;
        if (!this.zones.length) await this.getZones();
        const popupTitle = this.zones.find((el) => el.id === area.zoneId).title;
        L.circle(coor, { radius })
            .addTo(this.map)
            .on("pm:edit", (e) => this.onEditArea(area, e))
            .on("pm:remove", (e) => this.onRemoveArea(area.id, e))
            .bindPopup(popupTitle);
    }

    async drawPolygon(area) {
        if (!this.zones.length) await this.getZones();
        const popupTitle = this.zones.find((el) => el.id === area.zoneId).title;
        L.polygon(area.coordinates)
            .addTo(this.map)
            .on("pm:edit", (e) => this.onEditArea(area, e))
            .on("pm:remove", (e) => this.onRemoveArea(area.id, e))
            .bindPopup(popupTitle);
    }
}
