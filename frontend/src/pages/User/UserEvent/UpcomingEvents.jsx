import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import EventCard from "./EventCard";
import Header from "../../../components/Header";
import UserSidebar from "../../../components/User/UserSidebar";
import { jwtDecode } from "jwt-decode"; // ✅ import jwtDecode

export default function OngoingEvents() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null); // store user info
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.user_id;

      // Fetch full user info from backend
      axios
        .get(`${API}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) =>
          setUser({
            fullName: res.data.fullname,
            email: res.data.email,
            _id: res.data._id,
          })
        )
        .catch((err) => console.error("Failed to fetch user info", err));

      // Fetch ongoing events
      axios
        .get(`${API}/upcoming-events`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setEvents(res.data))
        .catch((err) => console.error("Failed to load ongoing events", err));
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }, []);

  const handleJoinSuccess = (joinedEventId) => {
    setEvents((prev) =>
      prev.map((event) =>
        event._id === joinedEventId ? { ...event, status: "joined" } : event
      )
    );
  };

  if (!user) return <div className="mt-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          {/* left panel- Sidebar */}
          <UserSidebar />

          {/* right panel- Sidebar */}
          <div className="w-full md:w-3/4 px-4 py-6">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome, {user.fullName}
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

            {/* Tabs */}
            <div className="bg-teal-50 rounded-full p-1 inline-flex mb-8">
              <Link to="/upcoming-events">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white shadow-sm rounded-full px-6 text-teal-700"
                >
                  Upcoming
                </Button>
              </Link>
              <Link to="/ongoing-events">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-6 text-teal-600 hover:bg-white/50"
                >
                  Ongoing
                </Button>
              </Link>
              <Link to="/completed-events">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-6 text-teal-600 hover:bg-white/50"
                >
                  Completed
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-teal-600">
                Upcoming events
              </h2>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {events.length > 0 ? (
                events.map((event) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    userId={user._id} // use decoded userId
                    onJoinSuccess={handleJoinSuccess}
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-full">
                  No upcoming events yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
