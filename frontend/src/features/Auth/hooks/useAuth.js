import {register, login, getMe, logout} from "../services/auth.api.js"; 
import {useContext, useEffect} from "react";
import {AuthContext} from "../auth.context.jsx";

export function useAuth() {
    const context = useContext(AuthContext);
    const {user, setUser, loading, setLoading} = context;

    async function handleRegister(username, email, password) {
        setLoading(true);

        const res = await register(username, email, password);
        const {data} = res;

        setUser(data.user);
        setLoading(false);
    }

    async function handleLogin(username, password) {
        setLoading(true);

        const res = await login(username, password);
        const {data} = res;
        
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

        const res = await getMe();
        const {data} = res;

        setUser(data.user);
        setLoading(false);
    }

    useEffect(() => {
        handleGetMe();
    }, []);

    return {user, loading, handleRegister, handleLogin, handleLogout, handleGetMe};
}