import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Grid, List } from "lucide-react";
import { Button } from "../../../components/ui/button";
import EventCard from "./EventCard";
import Header from "../../../components/Header";
import UserSidebar from "./UserSidebar";

export default function OngoingEvents() {
  const [events, setEvents] = useState([]);
  const userId = "68a6c2d32438f4fcfff8dd6f"; // Replace with logged-in user ID

  useEffect(() => {
    axios.get("http://localhost:5000/ongoing-events")
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to load ongoing events", err));
  }, []);

  const handleJoinSuccess = (joinedEventId) => {
    setEvents(prev =>
      prev.map(event =>
        event._id === joinedEventId ? { ...event, status: "joined" } : event
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <div className="pt-16 flex m-6">
        <UserSidebar />
        <main className="w-full md:w-3/4 px-4 py-6 flex-1">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome, Amanda
            </h1>
            <p className="text-gray-500">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short", day: "2-digit", month: "long", year: "numeric"
              })}
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-teal-50 rounded-full p-1 inline-flex mb-8">
            <Link to="/upcoming-events">
              <Button variant="ghost" size="sm" className="px-6 text-teal-600 hover:bg-white/50">
                Upcoming
              </Button>
            </Link>
            <Link to="/ongoing-events">
              <Button variant="ghost" size="sm" className="bg-white shadow-sm rounded-full px-6 text-teal-700">
                Ongoing
              </Button>
            </Link>
            <Link to="/completed-events">
              <Button variant="ghost" size="sm" className="px-6 text-teal-600 hover:bg-white/50">
                Completed
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-teal-600">Ongoing events</h2>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {events.map(event => (
              <EventCard key={event._id} event={event} userId={userId} onJoinSuccess={handleJoinSuccess} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
