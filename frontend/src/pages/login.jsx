import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Login = ({ onLogin = () => {} }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Temporary credentials
  const credentials = {
    admin: { username: "admin", password: "admin123" },
    user: { username: "user", password: "user123" },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user.role);
        navigate(data.user.role === "admin" ? "/dashboard" : "/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-black via-gray-800 to-gray-200">
{/* LEFT SIDE - LOGIN FORM */}
<div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-r from-black via-gray-800 to-gray-200 p-5 md:p-10">
  {/* Topic above the form */}
  <h2 className="self-start text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-10 text-center w-full">
    GET ACCESS TO SHOPPING <span className="text-red-500">WITH YOUR DOG!</span>
  </h2>

  {/* Form container */}
  <div className="w-full max-w-lg p-8 md:p-12 lg:p-16 bg-white rounded-lg shadow-2xl">
    <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
      Login Page
    </h1>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-lg md:text-xl font-semibold mb-2">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 md:p-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      <div>
        <label className="block text-lg md:text-xl font-semibold mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 md:p-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-3 md:py-4 bg-red-500 text-white font-semibold text-lg rounded-md hover:bg-red-600 transition duration-200 mb-3"
      >
        Login
      </button>
      <Link to="/register">

      <button
        type="submit"
        className="w-full py-3 md:py-4 bg-black text-white font-semibold text-lg rounded-md hover:bg-gray-800 transition duration-200"
      >
        Register
      </button></Link>
    </form>
  </div>
</div>


      {/* RIGHT SIDE - IMAGE */}
      <div className="flex-1 bg-cover bg-right center bg-no-repeat hidden md:block" style={{ backgroundImage: "url('/Land_image/land.png')" }} />
    </div>
  );
};

export default Login;
