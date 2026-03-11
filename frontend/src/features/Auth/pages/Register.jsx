import {Link} from "react-router";

const Register = () => {
    return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4 py-10 sm:p-6">
      <div className="w-full max-w-sm">

        <h1 className="lg:text-4xl text-3xl font-semibold text-white text-center mb-6 sm:mb-8">
          Create Account
        </h1>

        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-neutral-400">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-3 sm:py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 outline-none focus:border-neutral-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-neutral-400">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 sm:py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 outline-none focus:border-neutral-600"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-neutral-400">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 sm:py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white text-sm placeholder:text-neutral-600 outline-none focus:border-neutral-600"
            />
          </div>

          <button className="w-full py-3 sm:py-2.5 rounded-lg bg-white text-neutral-950 text-sm font-medium mt-2 cursor-pointer">
            Create Account
          </button>

        </div>

        <p className="text-center text-sm text-neutral-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-neutral-400 cursor-pointer">Login</Link>
        </p>

      </div>
    </div>
    )
}

export default Register;