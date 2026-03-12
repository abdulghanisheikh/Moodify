import {Navigate} from "react-router";
import {useAuth} from "../hooks/useAuth.js";

const Protected = ({children}) => {
    const {user, loading} = useAuth();

    if(loading) {
        return <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center p-6 text-white">
            <h1 className="text-3xl">Loading...</h1>  
        </div>
    }

    // Unauthorized user
    if(!user) {
        return <Navigate to="/login" />
    }

    return children;
}

export default Protected;