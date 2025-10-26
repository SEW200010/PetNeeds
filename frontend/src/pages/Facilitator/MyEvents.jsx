import React, { useEffect, useState } from "react";
import axios from "axios";
import FacilitatorSidebar from "@/components/Facilitator/FacilitatorSidebar";
import Header from "@/components/Facilitator/FacilitatorHeader";
import FacilitatorEventCard from "@/components/Facilitator/FacilitatorEventCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FacilitatorEvents = () => {
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

  // ✅ Split events into upcoming and past
  const currentDate = new Date();
  const upcomingEvents = events.filter(
    (event) => new Date(event.end_time || event.date) >= currentDate
  );
  const pastEvents = events.filter(
    (event) => new Date(event.end_time || event.date) < currentDate
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="pt-[65px] flex flex-col md:flex-row">
        <FacilitatorSidebar />

        <motion.div
          className="w-full md:w-3/4 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              My Events
            </h1>
            <p className="text-gray-600 text-sm">
              Welcome, {facilitatorName} 
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Loading / Empty State */}
          {loading ? (
            <p className="text-gray-500 animate-pulse">Loading your events...</p>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-20"
            >
              <p className="text-lg font-medium">You haven’t hosted any events yet </p>
              <p className="text-sm text-gray-400 mt-1">
                Your upcoming and past events will appear here once created.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Upcoming Events */}
              <motion.section
                className="mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <span> Upcoming Events</span>
                  <span className="text-sm text-gray-500">
                    ({upcomingEvents.length})
                  </span>
                </h2>

                {upcomingEvents.length > 0 ? (
                  <motion.div
                    layout
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {upcomingEvents.map((event, index) => (
                      <motion.div
                        key={event._id || index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <FacilitatorEventCard event={event} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-gray-500 mt-3">No upcoming events.</p>
                )}
              </motion.section>

              {/* Past Events */}
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <span> Past Events</span>
                  <span className="text-sm text-gray-500">
                    ({pastEvents.length})
                  </span>
                </h2>

                {pastEvents.length > 0 ? (
                  <motion.div
                    layout
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {pastEvents.map((event, index) => (
                      <motion.div
                        key={event._id || index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <FacilitatorEventCard event={event} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <p className="text-gray-500 mt-3">No past events.</p>
                )}
              </motion.section>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default FacilitatorEvents;
