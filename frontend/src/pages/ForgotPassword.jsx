import { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleForgotPassword = async () => {
    if (!email) {
      setType("error");
      setMessage("Please enter your email.");
      return;
    }

    try {
      const res = await axios.post("${API}/forgot-password", { email });
      setType("success");
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setType("error");
      setMessage(err.response?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <div
  className="min-h-screen flex items-center justify-center"
  style={{
        backgroundImage: "url('/Home_images/image2copy.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
>
  {/* Dark overlay */}
  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-70 z-0"></div>

  {/* White bordered box */}
  <div className="relative w-full max-w-md p-10 border-2 border-white rounded-2xl shadow-lg z-10">
    <h2 className="text-3xl font-bold text-white mb-4 text-center">
      Forgot Password
    </h2>
    <p className="text-center text-gray-200 mb-6">
      Enter your registered email to receive a reset link
    </p>

    <input
      type="email"
      placeholder="Email address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full p-3 bg-white text-gray-800 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
    />

    <button
      onClick={handleForgotPassword}
      className="w-full bg-emerald-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-green-600 transition-all transform hover:scale-105"
    >
      Send Reset Link
    </button>

    {message && (
      <p
        className={`mt-4 text-center text-sm ${
          type === "success" ? "text-green-400" : "text-red-400"
        }`}
      >
        {message}
      </p>
    )}

    <p className="mt-6 text-center text-gray-200">
      Remembered your password?{" "}
      <a href="/login" className="text-emerald-400 font-semibold hover:underline">
        Sign In
      </a>
    </p>
  </div>
</div>

  );
};

export default ForgotPassword;
