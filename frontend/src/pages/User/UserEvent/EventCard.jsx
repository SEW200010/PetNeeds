import { useState } from "react";
import axios from "axios";
import EventImage from "../../../assets/User/Event.jpg";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function EventCard({ event, userId, onJoinSuccess }) {
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(event.status === "joined");

  const handleJoin = async () => {
    if (joined) return;

    setIsJoining(true);
    try {
      const res = await axios.post("http://localhost:5000/join-event", {
        user_id: userId,
        event_id: event._id,
      });

      if (res.data.message === "Event joined successfully") {
        setJoined(true);
        onJoinSuccess(event._id);
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

  // ✅ Format in Asia/Colombo time
  const formatEventTime = (startIso, endIso) => {
    try {
      const optionsDate = {
        year: "numeric",
        month: "short",
        day: "2-digit",
        timeZone: "Asia/Colombo",
      };
      const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Colombo",
      };

      const start = new Date(startIso);
      const end = new Date(endIso);

      const dateStr = new Intl.DateTimeFormat("en-GB", optionsDate).format(start);
      const startTimeStr = new Intl.DateTimeFormat("en-GB", optionsTime).format(start);
      const endTimeStr = new Intl.DateTimeFormat("en-GB", optionsTime).format(end);

      return `${dateStr} | ${startTimeStr} - ${endTimeStr}`;
    } catch {
      return "";
    }
  };

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
          {formatEventTime(event.start_time, event.end_time)}
        </p>
        <Button
          size="sm"
          className={
            joined
              ? "bg-orange-500 hover:bg-orange-600 text-white w-full cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 text-white w-full"
          }
          onClick={handleJoin}
          disabled={joined || isJoining}
        >
          {joined ? "Joined" : isJoining ? "Joining..." : "Join"}
        </Button>
      </CardContent>
    </Card>
  );
}
