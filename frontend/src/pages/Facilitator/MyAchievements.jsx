import React, { useEffect, useState } from "react";
import FacilitatorSidebar from "@/components/Facilitator/FacilitatorSidebar";
import Header from "@/components/Facilitator/FacilitatorHeader";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import letterImage from "@/assets/image.png"; // 🧾 use one image only (your letter or certificate image)

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const MyAchievements = () => {
  const navigate = useNavigate();
  const [facilitatorName, setFacilitatorName] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");

    if (!role || role !== "facilitator") {
      alert("Access denied. Only facilitators can access this page.");
      navigate("/login");
      return;
    }

    setFacilitatorName(name || "Facilitator");

    const fetchFacilitatorInfo = async () => {
      try {
        const response = await fetch(`${API}/facilitators/info/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError(`API error: ${response.status}`);
          return;
        }

        const data = await response.json();
        console.log("Facilitator Info:", data);
        setIsVerified(data.isVerified || false);
      } catch (err) {
        setError("Failed to fetch facilitator info.");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilitatorInfo();
  }, [navigate]);

  // 📄 Download letter handler
  const handleDownloadLetter = () => {
    const link = document.createElement("a");
    link.href = "/letters/promotion_letter.pdf"; // your letter file
    link.download = "Promotion_Letter.pdf";
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <FacilitatorSidebar />
          <div className="w-full md:w-3/4 p-6">
            <div className="text-2xl font-bold pb-8">
              {facilitatorName}'s Achievements
            </div>

            {/* Verification status */}
            <div
              className={`p-4 w-fit rounded-md mb-6 ${
                isVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isVerified ? "✅ Verified Facilitator" : "❌ Not Verified Yet"}
            </div>

            {/* Letter preview section */}
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-80 flex items-center justify-center">
                {/* Letter image (same for both states) */}
                <img
                  src={letterImage}
                  alt="Promotion Letter"
                  className={`w-full h-full object-contain rounded-lg shadow-lg transition-all duration-500 ${
                    isVerified
                      ? "opacity-100 blur-0 brightness-100"
                      : "opacity-60 blur-sm brightness-75"
                  }`}
                />

                {/* Overlay for locked state */}
                {!isVerified && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <span className="text-white text-3xl">🔒</span>
                  </div>
                )}
              </div>

              {/* Status message */}
              <p
                className={`mt-4 text-lg font-semibold text-center ${
                  isVerified ? "text-green-700" : "text-gray-500"
                }`}
              >
                {isVerified
                  ? "🎉 Congratulations! You can now download your letter."
                  : "🔒 Get verified to unlock your promotion letter."}
              </p>

              {/* Download button */}
              <button
                disabled={!isVerified}
                onClick={handleDownloadLetter}
                className={`mt-6 px-6 py-2 rounded-md text-white font-medium transition-all duration-300 ${
                  isVerified
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isVerified ? "Download Letter 📄" : "Locked 🔒"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAchievements;
