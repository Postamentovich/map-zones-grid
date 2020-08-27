import axios from "axios";

export async function getAreas() {
    try {
        const { data } = await axios.get("/api/area");
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
