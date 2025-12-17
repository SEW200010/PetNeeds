import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Simple validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // For now, just navigate to login
    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-black via-gray-800 to-gray-200">
      {/* LEFT SIDE - REGISTER FORM */}
      <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-r from-black via-gray-800 to-gray-200 p-5 md:p-10">
        {/* Topic above the form */}
        <h2 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-white mb-10 text-center w-full">
          JOIN WITH <span className="text-red-500">US</span>
        </h2>

        {/* Form container */}
        <div className="w-full max-w-lg p-8 md:p-12 lg:p-16 bg-white rounded-lg shadow-2xl">
          <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold mb-8">
            Register
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg md:text-xl font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-3 md:p-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-lg md:text-xl font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 md:p-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-lg md:text-xl font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              Register
            </button>
            <Link to="/login">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-3 md:py-4 bg-black text-white font-semibold text-lg rounded-md hover:bg-gray-800 transition duration-200"
            >
              Already have an account? Login
            </button></Link>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE */}
      <div className="flex-1 bg-cover bg-right center bg-no-repeat hidden md:block" style={{ backgroundImage: "url('/Land_image/land.png')" }} />
    </div>
  );
};

export default Register;
