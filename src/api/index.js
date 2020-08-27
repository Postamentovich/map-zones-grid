import axios from "axios";

export async function getAreas() {
    const { data } = await axios.get("/api/area");
    return data;
}

export async function createArea(area) {
    const { data } = await axios.post("/api/area", { area });
    return data;
}

let cachZones = null;
export async function getZones() {
    if (cachZones) return cachZones;
    const { data } = await axios.get("/api/zone");
    cachZones = data;
    return data;
}
