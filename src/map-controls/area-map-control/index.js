import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import { MapAreaPopup } from "../../components/map-area-popup";
import { getCenterZoneByGeometry } from "../../utils/map-utils";
import { getAreas, createArea, updateArea, deleteArea } from "../../api";

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
            await createArea(model);
            this.popup.remove();
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

    onEditArea = async (area, e) => {
        console.log(e);
        const newModel = {
            ...area,
            coordinates:
                area.shape === "Circle" ? [{ ...e.layer._latlng, radius: e.layer._mRadius }] : e.layer._latlngs[0],
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

    drawCircle(area) {
        const coor = area.coordinates[0];
        if (!coor) return;
        const center = [coor.lat, coor.lng];
        const radius = coor.radius;
        L.circle(center, { radius })
            .addTo(this.map)
            .on("pm:edit", (e) => this.onEditArea(area, e))
            .on("pm:cut", (e) => this.onEditArea(area, e))
            .on("pm:remove", (e) => this.onRemoveArea(area.id, e));
    }

    drawPolygon(area) {
        const latLngs = area.coordinates.map((el) => [el.lat, el.lng]);
        if (!latLngs.length) return;
        L.polygon(latLngs)
            .addTo(this.map)
            .on("pm:edit", (e) => this.onEditArea(area, e))
            .on("pm:cut", (e) => this.onEditArea(area, e))
            .on("pm:remove", (e) => this.onRemoveArea(area.id, e));
    }
}
