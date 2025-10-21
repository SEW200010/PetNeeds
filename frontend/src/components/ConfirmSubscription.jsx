import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ConfirmSubscription = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirm = async () => {
      try {
        const res = await axios.get(
          `${API}/confirm-subscription/${token}`
        );
        setStatus("success");
        setMessage(res.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Something went wrong. Try again."
        );
      }
    };
    confirm();
  }, [token]);

  // Auto-close after 3 seconds and redirect to /login
  useEffect(() => {
    if (status !== "loading") {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center w-96">
        {status === "loading" && (
          <h2 className="text-lg font-semibold text-gray-700">Confirming...</h2>
        )}
        {status === "success" && (
          <h2 className="text-lg font-semibold text-green-600">{message}</h2>
        )}
        {status === "error" && (
          <h2 className="text-lg font-semibold text-red-600">{message}</h2>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Redirecting to login in 3 seconds...
        </p>
      </div>
    </div>
  );
};

export default ConfirmSubscription;
