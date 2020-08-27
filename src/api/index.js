import axios from "axios";

export async function getAreas() {
    const { data } = await axios.get("/api/area");
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

let cachZones = null;
export async function getZones() {
    if (cachZones) return cachZones;
    const { data } = await axios.get("/api/zone");
    cachZones = data;
    return data;
}
