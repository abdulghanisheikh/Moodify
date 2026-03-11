import {BrowserRouter, Routes, Route} from "react-router";
import Login from "./features/Auth/pages/Login";
import Register from "./features/Auth/pages/Register";
import FaceExpressions from "./features/Expression/components/FaceExpressions";

const AppRoutes = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="/" element={<FaceExpressions />}></Route>
        </Routes>
    </BrowserRouter>
}

export default AppRoutes;