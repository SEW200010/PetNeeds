import React from "react";
import { BiUser, BiLock } from "react-icons/bi";

const Login = () => {
  return (
    <div
      className="relative h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/Home_images/image2copy.jpg')", // Correct relative path to public folder
        backgroundSize: 'cover', // Make the background cover the entire div
        backgroundPosition: 'center', // Center the background image
        backgroundRepeat: 'no-repeat', // Prevent the image from repeating
      }}
    ><div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-0"></div>

      <div className="absolute inset-0 bg-opacity-50"></div>
      <div className="relative flex flex-col items-start text-white px-12">
        <h1 className="text-5xl font-bold">Welcome Back !</h1>
        <p className="text-lg text-emerald-600 mt-2">You can sign in to your access with an existing account</p>
      </div>

      <div className="relative border-5 border-white bg-opacity-50 p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-white text-center text-5xl font-semibold mb-6">Sign In</h2>
        <form>
          {/* Username or Email */}
          <div className="mb-4 hover:scale-105 relative">
            <label htmlFor="username" className="text-lg text-white">Username or Email</label>
            <div className="flex items-center mt-2">
              <BiUser className="absolute left-3 text-gray-400" size={20} />
              <input
                type="text"
                id="username"
                placeholder="Enter Username or Email"
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
                placeholder="Enter Password"
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center text-md text-white mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" /> Remember Me
            </label>
            <a href="#" className="text-green-400 hover:underline">Forgot Password</a>
          </div>

          {/* Sign In Button */}
          <button className="w-full bg-emerald-600 hover:bg-green-600 hover:scale-105 text-white py-3 rounded-lg font-semibold transition duration-300">
            Sign In
          </button>

          {/* Create an Account link */}
          <p className="text-white text-center text-md mt-4">
            Haven’t Account? <a href="#" className="text-green-400 hover:underline">Create an Account</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
