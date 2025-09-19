import { useState, useEffect } from "react";
import axios from "axios";
import EventImage from "../../../assets/User/Event.jpg";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function EventCard({ event, userId, onJoinSuccess, completed }) {
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  // Only check joined state if not completed
  useEffect(() => {
    if (!completed && event.joined_events && event.joined_events.includes(event._id)) {
      setJoined(true);
    }
  }, [event, completed]);

  const handleJoin = async () => {
    if (completed || joined) return;
    setIsJoining(true);

    try {
      const res = await axios.post("http://localhost:5000/join-event", {
        user_id: userId,
        event_id: event._id,
      });

      if (res.data.message === "Event joined successfully") {
        setJoined(true);
        if (onJoinSuccess) onJoinSuccess(event._id);
      } else {
        alert(res.data.message || "Join failed");
      }
    } catch (error) {
      console.error("Join event failed:", error);
      alert("Failed to join event.");
    } finally {
      setIsJoining(false);
    }
  };

  // Convert UTC ISO string to SLST (UTC+5:30)
  const formatToSLST = (utcDate) => {
    const slstDate = new Date(new Date(utcDate).getTime() + 5.5 * 60 * 60 * 1000);
    const optionsDate = { year: "numeric", month: "short", day: "numeric" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };
    return {
      date: slstDate.toLocaleDateString("en-GB", optionsDate),
      time: slstDate.toLocaleTimeString("en-GB", optionsTime),
    };
  };

  const startSLST = formatToSLST(event.start_time);
  const endSLST = formatToSLST(event.end_time);

  return (
    <Card className="overflow-hidden shadow-xl hover:shadow-xl transition-shadow border-0 py-2">
      <div className="aspect-[4/3] relative">
        <img
          src={EventImage}
          alt="Event poster"
          className="object-cover absolute inset-0 w-full h-full"
        />
      </div>
      <CardContent className="p-2">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {event.name || event.title}
        </p>
        <p className="text-xs text-gray-400 mb-4">
          {startSLST.date} | {startSLST.time} - {endSLST.time}
        </p>

        {/* Button logic */}
        <Button
          size="sm"
          className={
            completed
              ? "bg-gray-500 text-white w-full cursor-not-allowed"
              : joined
              ? "bg-orange-500 hover:bg-orange-600 text-white w-full cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 text-white w-full"
          }
          onClick={handleJoin}
          disabled={completed || joined || isJoining}
        >
          {completed
            ? "Completed"
            : joined
            ? "Joined"
            : isJoining
            ? "Joining..."
            : "Join"}
        </Button>
      </CardContent>
    </Card>
  );
}