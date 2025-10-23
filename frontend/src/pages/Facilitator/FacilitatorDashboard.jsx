import React, { useEffect, useState } from "react";
import axios from "axios";
import FacilitatorSidebar from "@/components/Facilitator/FacilitatorSidebar";
import Header from "@/components/Facilitator/FacilitatorHeader";
import FacilitatorEventCard from "@/components/Facilitator/FacilitatorEventCard";
import { useNavigate } from "react-router-dom";

const FacilitatorDashboard = () => {
  const navigate = useNavigate();
  const [facilitatorName, setFacilitatorName] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("fullname");
    const facilitatorId = localStorage.getItem("userId");

    // ✅ Role check
    if (!role || role !== "facilitator") {
      alert("Access denied. Only facilitators can access this page.");
      navigate("/login");
      return;
    }

    setFacilitatorName(name || "Facilitator");

    // ✅ Fetch events conducted by facilitator
    const fetchFacilitatorEvents = async () => {
      try {
        const res = await axios.get(`${API}/api/facilitator/events/${facilitatorId}`);
        setEvents(res.data || []);
      } catch (err) {
        console.error("Error fetching facilitator events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilitatorEvents();
  }, [navigate]);

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen flex flex-col md:flex-row">
        <FacilitatorSidebar />

        <div className="w-full md:w-3/4 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome, {facilitatorName}
            </h1>
            <p className="text-gray-500">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Event Section */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming Events 
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading events...</p>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <FacilitatorEventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming events found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default FacilitatorDashboard;
