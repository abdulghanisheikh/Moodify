import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    withCredentials: true
});

export async function login(username, password) {
    const response = await api.post("/api/auth/login", {
        username,
        password
    });

    return response;
}

export async function register(username, email, password) {
    const response = await api.post("/api/auth/register", {
        username,
        email,
        password
    });

    return response;
}

export async function logout() {
    const response = await api.post("/api/auth/logout");
    return response;
}

export async function getMe() {
    const response = await api.get("/api/auth/getMe");
    return response;
}