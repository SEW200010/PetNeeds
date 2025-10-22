import { useState, useEffect } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // "" | "success" | "error"
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      setType("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("${API}/subscribe", { email });
      setType("success");
      setMessage(res.data.message || "Subscribed successfully!");
      setEmail("");

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
    } catch (err) {
      setType("error");
      setMessage(err.response?.data?.message || "Subscription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold">Subscribe to Our Newsletter</h3>
      <br />
      <div className="flex items-center border rounded-xl overflow-hidden">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // Clear error message while typing
            if (type === "error") setMessage("");
          }}
          className="w-full bg-white text-black px-3 py-2 outline-none"
          disabled={loading}
        />
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`px-6 py-2 text-white transition hover:scale-110 rounded-r-xl ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-green-600"
          }`}
        >
          {loading ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      {message && (
        <p className={`mt-2 text-sm ${type === "success" ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Subscribe;
