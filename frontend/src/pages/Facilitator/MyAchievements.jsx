import React, { useEffect, useState } from "react";
import FacilitatorSidebar from "@/components/Facilitator/FacilitatorSidebar";
import Header from "@/components/Facilitator/FacilitatorHeader";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Download, Star } from "lucide-react";

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

  const handleDownloadBadge = () => {
    const link = document.createElement("a");
    link.href = "/badges/verified-facilitator-badge.png";
    link.download = "Verified_Facilitator_Badge.png";
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
      <main className="pt-[65px] min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col md:flex-row">
          <FacilitatorSidebar />
          <div className="w-full md:w-3/4 p-6 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {facilitatorName}'s Badge
                </h1>
                <p className="text-gray-600">
                  {isVerified
                    ? "Congratulations! You've earned your verified facilitator badge."
                    : "Complete all TOT sessions to unlock your verified badge."}
                </p>
              </div>

              {/* Badge Container */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 backdrop-blur-sm border border-gray-100">
                {/* Badge Display */}
                <div className="flex justify-center mb-8">
                  <div
                    className={`relative w-48 h-48 flex items-center justify-center transition-all duration-700 ${
                      isVerified
                        ? "scale-100 opacity-100"
                        : "scale-75 opacity-60"
                    }`}
                  >
                    {/* Badge Circle */}
                    <div
                      className={`absolute inset-0 rounded-full transition-all duration-700 ${
                        isVerified
                          ? "bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 shadow-2xl"
                          : "bg-gray-300 shadow-lg"
                      }`}
                    >
                      {/* Inner Circle */}
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-gradient-to-t from-black/10 to-transparent">
                        <div className="text-6xl animate-pulse">
                          {isVerified ? "⭐" : "🔒"}
                        </div>
                      </div>

                      {/* Shine Effect */}
                      {isVerified && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Text */}
                <div className="text-center mb-8">
                  <h2
                    className={`text-2xl font-bold mb-2 transition-colors duration-500 ${
                      isVerified ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isVerified ? "✓ Verified" : "Locked"}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {isVerified
                      ? "You are now a verified facilitator. Download your badge and showcase your achievement."
                      : "Once you complete all required TOT sessions, your badge will be unlocked automatically."}
                  </p>
                </div>

                {/* Download Button */}
                <button
                  disabled={!isVerified}
                  onClick={handleDownloadBadge}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    isVerified
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Download className="h-5 w-5" />
                  {isVerified ? "Download Badge" : "Badge Locked"}
                </button>

                {/* Divider */}
                <div className="my-6 border-t border-gray-200"></div>

                {/* Badge Info */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Star className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isVerified ? "text-yellow-500" : "text-gray-300"}`} />
                    <div>
                      <p className="font-semibold text-gray-900">Verified Facilitator Badge</p>
                      <p className="text-gray-600">Recognition of your training completion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAchievements;
