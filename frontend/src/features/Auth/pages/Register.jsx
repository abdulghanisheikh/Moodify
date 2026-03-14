import {Link, useNavigate} from "react-router";
import FormGroup from "../components/FormGroup";
import {useState} from "react";
import {useAuth} from "../hooks/useAuth.js";

const Register = () => {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const {handleRegister} = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { username, email, password } = userData;
            await handleRegister(username, email, password);

            navigate("/");

            setUserData({
                username: "",
                email: "",
                password: ""
            });
        } catch(err) {
            console.log(err.message);
        }
    }

    return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-10 sm:p-6">
      <div className="w-full max-w-sm">

        <h1 className="lg:text-4xl text-3xl font-semibold text-white text-center mb-6 sm:mb-8">
          Create Account
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
          name="email"
          type="text"
          value={userData.email}
          onChange={(e) => setUserData({...userData, [e.target.name]: e.target.value})}
          label="email" 
          placeholder="Enter your email" />

          <FormGroup
          name="password"
          type="password"
          value={userData.password}
          onChange={(e) => setUserData({...userData, [e.target.name]: e.target.value})}
          label="password"
          placeholder="Enter your password" />

          <button type="submit" className="w-full py-3 sm:py-2.5 rounded-lg bg-orange-700 hover:bg-orange-600 duration-300 ease-in-out text-neutral-100 text-sm font-medium mt-2 cursor-pointer active:scale-95">
            Create Account
          </button>

        </form>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-600 cursor-pointer">Login</Link>
        </p>

      </div>
    </div>
    )
}

export default Register;