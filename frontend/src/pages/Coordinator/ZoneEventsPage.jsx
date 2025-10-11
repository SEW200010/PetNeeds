import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventImage from "@/assets/User/Event.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import Header from "@/components/Admin/Header";
export default function ZoneEventsPage() {
  const { zoneId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !zoneId) return;

    axios
      .get(`http://localhost:5000/zone/${zoneId}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvents(res.data.events || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [zoneId]);

  const handleJoin = async (eventId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/join-event",
        { user_id: userId, event_id: eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.message === "Event joined successfully") {
        setEvents((prev) =>
          prev.map((ev) =>
            ev._id === eventId ? { ...ev, joined: true } : ev
          )
        );
      } else {
        alert(res.data.message || "Join failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to join event.");
    }
  };

  const formatToSLST = (utcDate) => {
    const slst = new Date(new Date(utcDate).getTime() + 5.5 * 60 * 60 * 1000);
    return {
      date: slst.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" }),
      time: slst.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  if (loading) return <p className="p-6">Loading events...</p>;
  if (!events.length) return <p className="p-6">No events found for this zone.</p>;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
    <main className="pt-[65px] min-h-screen">
      <div className="flex flex-col md:flex-row">
        <CoordinatorSidebar />
        <div className="w-full md:w-3/4 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          {events.map((event) => {
            const startSLST = formatToSLST(event.start_time);
            const endSLST = formatToSLST(event.end_time);
            const joined = event.joined || false;
            const completed = event.completed || false;

            return (
              <Card key={event._id} className="overflow-hidden shadow-xl w-55 h-80 hover:shadow-xl transition-shadow border-0 py-2">
                <div className="aspect-[4/3] relative">
                  <img
                    src={EventImage}
                    alt="Event poster"
                    className="object-cover absolute inset-0 w-full h-full"
                  />
                </div>
                <CardContent className="p-2">
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.name}</p>
                  <p className="text-xs text-gray-400 mb-4">
                    {startSLST.date} | {startSLST.time} - {endSLST.time}
                  </p>
                  <Button
                    size="sm"
                    className={
                      completed
                        ? "bg-gray-500 text-white w-full cursor-not-allowed"
                        : joined
                        ? "bg-orange-500 hover:bg-orange-600 text-white w-full cursor-not-allowed"
                        : "bg-teal-600 hover:bg-teal-700 text-white w-full"
                    }
                    onClick={() => handleJoin(event._id)}
                    disabled={completed || joined}
                  >
                    {completed ? "Completed" : joined ? "Joined" : "Join"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </main>
    </div>
  );
}
