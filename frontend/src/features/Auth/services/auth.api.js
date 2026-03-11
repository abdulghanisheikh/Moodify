import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

export async function login(username, password) {
    const response = await api.post("/api/auth/login", {
        username,
        password
    });

    return response;
}