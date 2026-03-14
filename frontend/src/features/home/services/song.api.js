import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    withCredentials: true
});

export async function getSong({ mood }) {
    const response = api.get(`/api/songs?mood=${mood}`);
    return response;
}