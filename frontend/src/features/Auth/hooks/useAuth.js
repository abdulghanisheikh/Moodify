import {register, login, getMe, logout} from "../services/auth.api.js"; 
import {useContext} from "react";
import {AuthContext} from "../auth.context.jsx";

export function useAuth() {
    const context = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = context;

    async function handleRegister(username, email, password) {
        setLoading(true);

        const {data} = await register(username, email, password);
        setUser(data.user);
        
        setLoading(false);
    }

    async function handleLogin(username, password) {
        setLoading(true);

        const {data} = await login(username, password);
        setUser(data.user);

        setLoading(false);
    }

    async function handleLogout() {
        setLoading(true);

        await logout();
        setUser(null);
        
        setLoading(false);
    }

    async function handleGetMe() {
        setLoading(true);

        const {data} = await getMe();
        setUser(data.user);

        setLoading(false);
    }

    return {user, loading, handleRegister, handleLogin, handleLogout, handleGetMe};
}