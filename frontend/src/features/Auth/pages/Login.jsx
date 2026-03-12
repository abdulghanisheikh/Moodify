import {Link, useNavigate} from "react-router";
import FormGroup from "../components/FormGroup";
import {useState} from "react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    const {handleLogin} = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const {username, password} = userData;
            await handleLogin(username, password);

            navigate("/");

            setUserData({
                username: "",
                password: ""
            });
        } catch(err) {
            console.log(err.message);
        }
    }

    return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">

        <h1 className="lg:text-4xl text-3xl font-semibold text-white text-center mb-8">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <FormGroup
          name="username"
          type="text"
          value={userData.username}
          onChange={(e) => setUserData({...userData, [e.target.name]: e.target.value})}
          label="username"
          placeholder="Enter your username" />

          <FormGroup
          name="password"
          type="password"
          value={userData.password}
          onChange={(e) => setUserData({...userData, [e.target.name]: e.target.value})}
          label="password"
          placeholder="Enter your password" />

          <button type="submit" className="w-full py-2.5 rounded-lg bg-orange-700 hover:bg-orange-600 duration-300 ease-in-out text-neutral-100 text-sm font-medium mt-2 cursor-pointer active:scale-95">
            Login
          </button>

        </form>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Don't have an account?{" "}
          <Link className="text-orange-600 cursor-pointer" to="/register">Sign up</Link>
        </p>

      </div>
    </div>
    )
}

export default Login;