import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../components/User/UserHeader";
import UserSidebar from "../../../components/User/UserSidebar";
import { CircularProgress } from "@mui/material";
import EventCard from "./EventCard"; // Assuming you have EventCard
import {jwtDecode} from "jwt-decode";

export default function MyEvents() {
  const [loading, setLoading] = useState(true);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [userId, setUserId] = useState(null);

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      try {
        // Get JWT from localStorage or cookie
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("userId");
         // adjust as per your auth
        if (!token) return;
        console.log("Token:", id);
        const decoded = jwtDecode(token);
       
        const studentId = id; // adjust according to your token
        setUserId(studentId);

        const eventIdsRes = await axios.get(
          `${API}/students/${studentId}/joined-events`,);
          console.log("Event IDs Response:", eventIdsRes.data);
        // Fetch all joined events details
        

        setJoinedEvents(eventIdsRes.data.events || []);
      } catch (err) {
        console.error("Failed to fetch joined events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedEvents();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <UserSidebar />
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              My Events
            </h2>

            {joinedEvents.length === 0 ? (
              <p className="text-gray-500">You have not joined any events yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {joinedEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    event={{ ...event, joined: true }} 
                    userId={userId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
