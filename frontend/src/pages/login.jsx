import React, { useState, useEffect } from "react";
import { BiUser, BiLock, BiHide, BiShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-login if valid token exists
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.clear();
          sessionStorage.clear();
          return;
        }

        const role = decoded.role;
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "student") navigate("/teacher-dashboard");
        else if (role === "coordination") navigate("/coordinator-dashboard");
        else navigate("/upcoming-events");
      } catch {
        localStorage.clear();
        sessionStorage.clear();
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        const decoded = jwtDecode(data.access_token);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("token", data.access_token);
        storage.setItem("user", JSON.stringify(decoded));

        const role = decoded.role;
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "teacher-in-charge") navigate("/teacher-dashboard");
        else if (role === "coordination") navigate("/coordinator-dashboard");
        else navigate("/upcoming-events");
      } else if (data.error === "facilitator_not_verified") {
        alert("Your facilitator account is not verified yet.");
      } else {
        alert(data.error || "Login failed");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="relative h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/Home_images/image2copy.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      <div className="relative flex flex-col items-start text-white px-12 z-10">
        <h1 className="text-5xl font-bold">Welcome Back!</h1>
        <p className="text-lg text-emerald-600 mt-2">Sign in to access your account</p>
      </div>

      <div className="relative border-[5px] border-white bg-gray-900/70 p-8 rounded-2xl shadow-lg max-w-md w-full z-10">
        <h2 className="text-white text-center text-5xl font-semibold mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4 relative">
            <label htmlFor="email" className="text-lg text-white">Email</label>
            <div className="flex items-center mt-2">
              <BiUser className="absolute left-3 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="text-lg text-white">Password</label>
            <div className="relative mt-2">
              <BiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex justify-between items-center text-md text-white mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
            <Link to="/forgot-password" className="text-green-400 hover:underline">Forgot Password</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Sign In
          </button>

          <p className="text-white text-center text-md mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#27987A] font-semibold hover:underline">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
