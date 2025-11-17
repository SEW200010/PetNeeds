import { useState, useEffect } from "react";
import axios from "axios";
import EventImage from "../../../assets/User/Event.jpg";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { useNavigate } from "react-router-dom";

export default function EventCard({ event, userId, onJoinSuccess, completed = false }) {
  const [isJoining, setIsJoining] = useState(false);
  const [joined, setJoined] = useState(event.joined || false);
  const [modules, setModules] = useState(event.modules || []);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    setJoined(event.joined || false);
    setModules(event.modules || []);
  }, [event]);

  const handleJoin = async () => {
    if (joined) {
      navigateToModules();
      return;
    }

    setIsJoining(true);
    try {
      const res = await axios.post(`${API}/join-event`, { user_id: userId, event_id: event._id });
      if (res.data.message === "Event joined successfully") {
        setJoined(true);
        if (onJoinSuccess) onJoinSuccess(event._id);
      }
    } catch (err) {
      console.error("Join failed:", err);
    } finally {
      setIsJoining(false);
    }
  };

  const navigateToModules = () => {
    navigate(`/modules/${event._id}`);
  };

  const handleEnrollModule = async (module, key) => {
    try {
      const res = await axios.post(`${API}/enroll-module`, {
        user_id: userId,
        event_id: event._id,
        moduleName: module.moduleName,
        enrollmentKey: key,
      });
      if (res.data.message === "Enrolled successfully") {
        setModules((prev) =>
          prev.map((m) =>
            m.moduleName === module.moduleName ? { ...m, enrolled: true } : m
          )
        );
      } else {
        alert(res.data.message || "Enrollment failed");
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Enrollment failed");
    }
  };

  const formatToSLST = (utcDate) => {
    const utcDateObj = new Date(utcDate);
    const slstDate = new Date(utcDateObj.getTime() - (5.5 * 60 * 60 * 1000)); // Add 5.5 hours
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
        <img src={EventImage} alt="Event poster" className="object-cover absolute inset-0 w-full h-full" />
      </div>
      <CardContent className="p-2">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.name || event.title}</p>
        <p className="text-xs text-gray-400 mb-4">
          {startSLST.date} | {startSLST.time} - {endSLST.time}
        </p>

        {/* Conditional Button Rendering */}
        {completed ? (
          <Button
            size="sm"
            className="bg-gray-400 text-white w-full cursor-not-allowed"
            disabled={true}
          >
            Completed
          </Button>
        ) : (
          <Button
            size="sm"
            className={joined ? "bg-orange-500 hover:bg-orange-600 text-white w-full" : "bg-teal-600 hover:bg-teal-700 text-white w-full"}
            onClick={handleJoin}
            disabled={isJoining}
          >
            {joined ? "Go to Modules" : isJoining ? "Joining..." : "Join"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
