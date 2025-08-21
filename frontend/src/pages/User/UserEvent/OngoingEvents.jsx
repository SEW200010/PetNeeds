import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Grid, List } from "lucide-react";
import { Button } from "../../../components/ui/button";
import EventCard from "./EventCard";
import Header from "../../../components/Header";
import UserSidebar from "./UserSidebar";

export default function UserEvents() {
  const [events, setEvents] = useState([]);

  const userId = 3; // Replace with session or real logged-in ID

  useEffect(() => {
    axios
      .get(`http://localhost:5000/ongoing-events`)
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error("Failed to load ongoing events", err.response?.data || err.message);
      });
  }, []);

  const handleJoinSuccess = (joinedEventId) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
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
                weekday: "short",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Status Tabs */}
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

          {/* Events Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-teal-600">Ongoing events</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-gray-400"><Grid className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" className="text-gray-400"><List className="h-5 w-5" /></Button>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="bg-teal-600 text-white border-teal-600 hover:bg-teal-700">filter</Button>
                <Button variant="outline" size="sm" className="bg-teal-600 text-white border-teal-600 hover:bg-teal-700">sort</Button>
              </div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                userId={userId}
                onJoinSuccess={handleJoinSuccess}
              />
            ))}
          </div>

          <div className="text-center">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-2">
              Explore events
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
