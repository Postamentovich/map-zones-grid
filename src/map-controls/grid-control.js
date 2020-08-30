import React from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import * as turf from "@turf/turf";
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
        const latLngs = coordinates.map((el) => [el.lng, el.lat]);
        const left = [latLngs[0], latLngs[1]];
        const top = [latLngs[1], latLngs[2]];
        const right = [latLngs[3], latLngs[2]];
        const bottom = [latLngs[0], latLngs[3]];
        const leftLine = turf.lineString(left);
        const rightLine = turf.lineString(right);
        const topLine = turf.lineString(top);
        const bottomLine = turf.lineString(bottom);
        const rowLength = turf.length(leftLine);
        const rowStep = rowLength / rows;
        const columnLength = turf.length(topLine);
        const columnStep = columnLength / columns;
        const layers = [];

        for (let i = 1; i < rows; i++) {
            const offset = rowStep * i;
            const a = turf.along(leftLine, offset);
            const b = turf.along(rightLine, offset);
            const aCoor = turf.getCoord(a);
            const bCoor = turf.getCoord(b);
            const newLine = turf.lineString([aCoor, bCoor]);
            const layer = L.geoJSON(newLine).addTo(this.map);
            layers.push(layer);
        }

        for (let i = 1; i < columns; i++) {
            const offset = columnStep * i;
            const a = turf.along(topLine, offset);
            const b = turf.along(bottomLine, offset);
            const aCoor = turf.getCoord(a);
            const bCoor = turf.getCoord(b);
            const newLine = turf.lineString([aCoor, bCoor]);
            const layer = L.geoJSON(newLine).addTo(this.map);
            layers.push(layer);
        }

        this.grids.set(id, layers);
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
            this.activeModel.layer
                .on("pm:remove", (e) => this.onRemoveArea(grid.id, e))
                .on("click", (e) => this.onClick(grid, e));
            this.activeModel.layer.bringToFront();
            this.popup.remove();
            this.activeModel = null;
        } catch (error) {
            console.error(error);
        }
    };

    onCreateGrid = (e) => {
        const { layer, shape } = e;
        const permissionShapes = ["Rectangle"];
        if (!permissionShapes.includes(shape)) return;
        this.activeModel = { geometry: null, layer: null, columns: 10, rows: 10 };
        this.activeModel.center = layer.getCenter();
        this.activeModel.geometry = layer.getLatLngs()[0];
        this.activeModel.layer = layer;
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
            if (layers) layers.forEach((layer) => layer.remove());
            await deleteGrid(id);
        } catch (error) {
            console.error(error);
        }
    };

    onClick = (grid, e) => {};

    async drawPolygon(grid) {
        const { coordinates } = grid;
        if (!coordinates.length) return;
        L.polygon(coordinates)
            .addTo(this.map)
            .on("pm:remove", (e) => this.onRemoveArea(grid.id, e));
        this.drawGridColumnsRows(grid);
    }
}
