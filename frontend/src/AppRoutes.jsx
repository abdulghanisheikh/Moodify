import { Routes, Route } from "react-router";
import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import Home from "./features/home/pages/Home";
import Protected from "./features/Auth/components/Protected";

const AppRoutes = () => {
    return <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={ <Protected><Home /></Protected> }></Route>
    </Routes>
}

export default AppRoutes;