import React, { useState, useEffect } from "react";
import { BiUser, BiLock, BiHide, BiShow } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ install with: npm install jwt-decode

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.clear();
          return;
        }

        const role = decoded.role;
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "teacher-in-charge") navigate("/teacher-dashboard");
        else if (role === "facilitator") navigate("/facilitator-dashboard");
        else if (role === "coordinator") navigate("/coordinator-dashboard");
        else navigate("/upcoming-events");
      } catch (error) {
        console.error("Token decoding error:", error);
        localStorage.clear();
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();

      if (res.ok) {
        const decoded = jwtDecode(data.access_token);
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", decoded.role);
        localStorage.setItem("name", decoded.name || decoded.identity || "");
        localStorage.setItem("organization_unit", decoded.organization_unit || "");
        localStorage.setItem("university_name", decoded.university || "");
        localStorage.setItem("zone", decoded.zone || "");
        localStorage.setItem("userId", data.user_id || decoded.sub || "");

        const role = decoded.role;
        if (role === "admin") navigate("/admin-dashboard");
        else if (role === "teacher-in-charge") navigate("/teacher-dashboard");
        else if (role === "facilitator") navigate("/facilitator-dashboard");
        else if (role === "coordinator") navigate("/coordinator-dashboard");
        else navigate("/upcoming-events");
      } else if (data.error === "facilitator_not_verified") {
        alert("Your facilitator account is not verified yet.");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const inputClass = `
    w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1
    hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg
    transition duration-300
  `;

  return (
    <div
      className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/Home_images/image2copy.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* Left Section */}
      <div className="relative text-center lg:text-left px-6 sm:px-10 lg:px-16 z-10 mb-8 lg:mb-0">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
          Welcome Back!
        </h1>
        <p className="text-md sm:text-lg text-emerald-400 mt-3">
          Sign in to access your account
        </p>
      </div>

      {/* Right Section (Login Form) */}
      <div className="relative border-[3px] sm:border-[4px] lg:border-[5px] border-white bg-gray-900/80 p-6 sm:p-8 rounded-2xl shadow-xl w-11/12 sm:w-3/4 md:w-2/3 lg:max-w-md z-10">
        <h2 className="text-white text-center text-3xl sm:text-4xl font-semibold mb-6">
          Sign In
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4 relative">
            <label htmlFor="email" className="text-white text-lg">Email</label>
            <div className="flex items-center mt-2">
              <BiUser className="absolute left-3 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="text-white text-lg">Password</label>
            <div className="relative mt-2">
              <BiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-md text-white mb-6">
            <label className="flex items-center mb-2 sm:mb-0">
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            <Link to="/forgot-password" className="text-green-400 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-green-600 text-white py-3 rounded-lg font-semibold
                       transition duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Sign In
          </button>

          {/* Register link */}
          <p className="text-white text-center text-sm sm:text-md mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-emerald-400 font-semibold hover:underline transition"
            >
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
