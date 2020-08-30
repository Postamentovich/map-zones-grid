import axios from "axios";

export async function getAreas() {
    const { data } = await axios.get("/api/area");
    return data;
}

export async function getGrids() {
    const { data } = await axios.get("/api/grid");
    return data;
}

export async function createArea(area) {
    const { data } = await axios.post("/api/area", { area });
    return data;
}

export async function updateArea(area) {
    const { data } = await axios.put("/api/area", { area });
    return data;
}

export async function deleteArea(id) {
    const { data } = await axios.delete(`/api/area/${id}`);
    return data;
}

export async function deleteGrid(id) {
    const { data } = await axios.delete(`/api/grid/${id}`);
    return data;
}

export async function searchArea(lat, lng) {
    const params = new URLSearchParams();
    if (lat) params.set("lat", lat);
    if (lng) params.set("lng", lng);
    const { data } = await axios.get(`/api/area/search`, { params });
    return data;
}

export async function searchGridCell(lat, lng) {
    const params = new URLSearchParams();
    if (lat) params.set("lat", lat);
    if (lng) params.set("lng", lng);
    const { data } = await axios.get(`/api/grid/search`, { params });
    return data;
}

export async function createGrid(grid) {
    const { data } = await axios.post("/api/grid", { grid });
    return data;
}

let cachZones = null;
export async function getZones() {
    if (cachZones) return cachZones;
    const { data } = await axios.get("/api/zone");
    cachZones = data;
    return data;
}
