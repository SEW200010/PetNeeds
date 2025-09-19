import React, { useState } from "react";
import { BiUser, BiLock } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ install with: npm install jwt-decode

const Login = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    const data = await res.json();

   if (res.ok) {
  alert(data.message);

  // ✅ Store token
  localStorage.setItem("token", data.access_token);

  // ✅ Decode token to get role and name
  const decoded = jwtDecode(data.access_token);
  const role = decoded.role;
  const name = decoded.name || decoded.identity; // make sure backend includes this

  // ✅ Store in localStorage
  localStorage.setItem("role", role);
  localStorage.setItem("name", name);
localStorage.setItem("token", data.access_token);

  // ✅ Navigate based on role
  if (role === "admin") {
    navigate("/admin-dashboard");
  } else if (role === "teacher-in-charge") {
    navigate("/teacher-dashboard");
  } else {
    navigate("/user-dashboard"); // student or parent
  }

    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <div
      className="relative h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/Home_images/image2copy.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-0"></div>

      <div className="relative flex flex-col items-start text-white px-12">
        <h1 className="text-5xl font-bold">Welcome Back!</h1>
        <p className="text-lg text-emerald-600 mt-2">You can sign in to your access with an existing account</p>
      </div>

      <div className="relative border-5 border-white bg-opacity-50 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-white text-center text-5xl font-semibold mb-6">Sign In</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4 hover:scale-105 relative">
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
          <div className="mb-4 hover:scale-105 relative">
            <label htmlFor="password" className="text-lg text-white">Password</label>
            <div className="flex items-center mt-2">
              <BiLock className="absolute left-3 text-gray-400" size={20} />
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex justify-between items-center text-md text-white mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            <a href="#" className="text-green-400 hover:underline">Forgot Password</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-green-600 hover:scale-105 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Sign In
          </button>

          {/* Register Link */}
          <p className="text-white text-center text-md mt-4">
            Don't have an account?{" "}
            <Link to="/Register" className="text-[#27987A] font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
