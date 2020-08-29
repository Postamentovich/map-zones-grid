import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import * as turf from "@turf/turf";
import { getCenterZoneByGeometry } from "../utils/map-utils";
import { MapGridPopup } from "../components/map-grid-popup";
import { createGrid, getGrids, deleteGrid } from "../api";

export class GridMapControl extends L.Control {
    grids = new Map();

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

    onCancelGrid = () => {
        this.popup.remove();
        this.activeModel.layer.remove();
        this.activeModel = null;
    };

    showPopup = (center) => {
        const popupContainer = document.createElement("div");
        this.popup = L.popup({ minWidth: 200, closeOnClick: false, closeButton: false })
            .setLatLng(center)
            .setContent(popupContainer)
            .openOn(this.map);
        ReactDOM.render(<MapGridPopup onCancel={this.onCancelGrid} onSave={this.onSaveGrid} />, popupContainer);
    };
    async delay() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 300);
        });
    }
    drawGridColumnsRows = async ({ coordinates, columns, rows, id }) => {
        const latLngs = coordinates.map((el) => [el.lat, el.lng]);

        const heightCoor = [latLngs[1], latLngs[0]];
        const widthCoor = [latLngs[1], latLngs[2]];

        const widthLine = turf.lineString(widthCoor);
        const widthLength = turf.length(widthLine);
        const widthStep = widthLength / columns;
        const heightLine = turf.lineString(heightCoor);
        const heightLength = turf.length(heightLine);
        const heightStep = heightLength / rows;
        const layers = [];
        this.grids.set(id, layers);

        for (let i = 0; i < columns; i++) {
            const offset = i * widthStep;
            const heightOffset = turf.lineOffset(heightLine, offset);
            const coordsOffset = turf.getCoords(heightOffset);
            const layer = L.polyline(coordsOffset).addTo(this.map);
            layers.push(layer);
        }

        for (let j = 0; j < rows; j++) {
            const offset = j * heightStep;
            const line = turf.lineOffset(widthLine, -offset);
            const coords = turf.getCoords(line);
            const layer = L.polyline(coords).addTo(this.map);
            layers.push(layer);
        }
    };

    onSaveGrid = async ({ columns, rows, title }) => {
        const coordinates = this.activeModel.geometry;
        const model = {
            coordinates,
            columns,
            rows,
            title,
            status: "Active",
        };
        try {
            const grid = await createGrid(model);
            this.drawGridColumnsRows(grid);
            this.activeModel.layer.on("pm:remove", (e) => this.onRemoveArea(grid.id, e));
            this.activeModel.layer.bringToFront();
            this.popup.remove();
            this.activeModel = null;
        } catch (error) {
            console.error(error);
        }
    };

    onCreateGrid = (e) => {
        const permissionShapes = ["Rectangle"];
        if (!permissionShapes.includes(e.shape)) return;
        this.activeModel = { geometry: null, layer: null, columns: 10, rows: 10 };
        const geometry = e.layer._latlngs[0];
        this.activeModel.center = getCenterZoneByGeometry(geometry);
        this.activeModel.geometry = geometry;
        this.activeModel.layer = e.layer;
        this.showPopup(this.activeModel.center);
    };

    init() {
        this.map.on("pm:create", this.onCreateGrid);
        this.drawGrids();
    }

    getGrids = async () => {
        try {
            const grid = await getGrids();
            return grid;
        } catch (error) {
            console.error(error);
        }
    };

    async drawGrids() {
        const grids = await this.getGrids();
        if (!Array.isArray(grids)) return;
        grids.forEach((area) => {
            this.drawPolygon(area);
        });
    }

    onRemoveArea = async (id) => {
        try {
            const layers = this.grids.get(id);
            if (layers) {
                layers.forEach((layer) => layer.remove());
            }
            await deleteGrid(id);
        } catch (error) {
            console.error(error);
        }
    };

    async drawPolygon(grid) {
        const latLngs = grid.coordinates.map((el) => [el.lat, el.lng]);
        if (!latLngs.length) return;
        L.polygon(latLngs)
            .addTo(this.map)
            .on("pm:remove", (e) => this.onRemoveArea(grid.id, e));
        this.drawGridColumnsRows(grid);
    }
}
