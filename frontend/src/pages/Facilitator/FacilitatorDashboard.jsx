import React, { useEffect, useState } from "react";
import axios from "axios";
import FacilitatorSidebar from "@/components/Facilitator/FacilitatorSidebar";
import Header from "@/components/Facilitator/FacilitatorHeader";
import FacilitatorEventCard from "@/components/Facilitator/FacilitatorEventCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


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

    if (!role || role !== "facilitator") {
      alert("Access denied. Only facilitators can access this page.");
      navigate("/login");
      return;
    }

    setFacilitatorName(name || "Facilitator");

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
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="pt-[65px] flex flex-col md:flex-row">
        <FacilitatorSidebar />

        {/* Main Content */}
        <motion.div
          className="w-full md:w-3/4 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header Section */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Welcome, {facilitatorName}
              </h1>
              <p className="text-gray-500 text-sm">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Event Section */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
            Upcoming Events
          </h2>

          {loading ? (
            <p className="text-gray-500 animate-pulse">Loading events...</p>
          ) : events.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event, index) => (
                <motion.div
                  key={event._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <FacilitatorEventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center mt-16"
            >
              <p className="text-lg font-medium">No upcoming events found 😕</p>
              <p className="text-sm text-gray-400 mt-1">
                You can wait for events to be assigned or contact the coordinator for more information.
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default FacilitatorDashboard;
