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
        const latLngs = coordinates.map((el) => [el.lat, el.lng]);
        const columnCoor = [latLngs[2], latLngs[1]];
        const columnLine = turf.lineString(columnCoor);
        const columnLength = turf.length(columnLine);
        const columnStep = columnLength / columns;
        const rowCoor = [latLngs[1], latLngs[0]];
        const rowLine = turf.lineString(rowCoor);
        const rowLength = turf.length(rowLine);
        const rowStep = rowLength / rows;

        const layers = [];

        for (let i = 1; i < columns; i++) {
            const columnOffset = i * columnStep;
            const line = turf.lineOffset(rowLine, columnOffset);
            const coords = turf.getCoords(line);
            const layer = L.polyline(coords).addTo(this.map);
            layers.push(layer);
        }

        for (let i = 1; i < columns; i++) {
            const columnOffset = i * rowStep;
            const line = turf.lineOffset(columnLine, columnOffset);
            const coords = turf.getCoords(line);
            const layer = L.polyline(coords).addTo(this.map);
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
