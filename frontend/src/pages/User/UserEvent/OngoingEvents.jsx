import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import EventCard from "./EventCard";
import Header from "../../../components/User/UserHeader";
import UserSidebar from "../../../components/User/UserSidebar";
import {jwtDecode} from "jwt-decode";

export default function OngoingEvents() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const userId = localStorage.getItem("userId") || decoded.sub;

        const [userRes, eventsRes] = await Promise.all([
          axios.get(`${API}/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/events`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { user_id: userId },
          }),
        ]);

        setUser({
          fullName: userRes.data.fullName,
          email: userRes.data.email,
          _id: userRes.data._id,
          faculty: userRes.data.faculty_name,
        });

        setEvents(eventsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load events. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Update event in local state after joining
  const handleJoinSuccess = (eventId) => {
    setEvents(prev =>
      prev.map(event =>
        event._id === eventId
          ? { ...event, joined: true }
          : event
      )
    );
  };

  // Handle joining an event (API + state + redirect)
  const handleJoin = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `${API}/join-event`,
        { user_id: user._id, event_id: eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      handleJoinSuccess(eventId);
      navigate(`/modules/${eventId}`); // redirect after successful join
    } catch (err) {
      console.error(err);
      alert("Failed to join the event. Please try again.");
    }
  };

  const filteredEvents = events.filter(
    (event) => new Date(event.start_time) <= new Date() && new Date(event.end_time) >= new Date()
  );

  if (error) return <div className="mt-10 text-center text-red-500">{error}</div>;
  if (!user) return <div className="mt-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <UserSidebar />
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

            <div className="bg-teal-50 rounded-full p-1 inline-flex mb-8">
              <Link to="/upcoming-events">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-6 text-teal-600 hover:bg-white/50"
                >
                  Upcoming
                </Button>
              </Link>
              <Link to="/ongoing-events">
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-white shadow-sm rounded-full px-6 text-teal-700"
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

            <h2 className="text-xl font-medium text-teal-600 mb-6">Ongoing events</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map(event => (
                  <EventCard
                    key={event._id}
                    event={event}
                    userId={user._id}
                    onJoin={handleJoin}
                  />
                ))
              ) : (
                <p className="text-gray-500 col-span-full">
                  No ongoing events for your faculty.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
