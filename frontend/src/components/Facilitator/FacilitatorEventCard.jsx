// 📂 frontend/src/components/Facilitator/FacilitatorEventCard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import EventImage from "@/assets/User/Event.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function FacilitatorEventCard({ event }) {
  const [isLoading, setIsLoading] = useState(false);
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const navigate = useNavigate();

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

  // 💬 Contact Coordinator button
  const handleContactCoordinator = async () => {
    setIsLoading(true);
    try {
      // you can open a chat, show a modal, or navigate to contact page
      navigate(`/contact-coordinator/${event.coordinator_id}`);
    } catch (err) {
      console.error("Failed to contact coordinator:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-0 py-2">
      <div className="aspect-[4/3] relative">
        <img
          src={EventImage}
          alt="Event poster"
          className="object-cover absolute inset-0 w-full h-full"
        />
      </div>

      <CardContent className="p-2">
        <p className="text-sm text-gray-800 font-medium mb-2 line-clamp-2">
          {event.name || event.title}
        </p>
        <p className="text-xs text-gray-500 mb-3">
          {startSLST.date} | {startSLST.time} - {endSLST.time}
        </p>
        <p className="text-xs text-gray-600 mb-4">
          📍 {event.venue || "Location not specified"}
        </p>

        <Button
          size="sm"
          onClick={handleContactCoordinator}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
        >
          {isLoading ? "Opening..." : "Contact Coordinator"}
        </Button>
      </CardContent>
    </Card>
  );
}
