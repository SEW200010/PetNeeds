import { useState } from "react";
import axios from "axios";
import EventImage from "@/assets/User/Event.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function FacilitatorEventCard({ event }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coordinatorList, setCoordinatorList] = useState([]);
  const [facultyName, setFacultyName] = useState("");
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // ✅ Convert UTC to SLST (GMT+5:30)
  const formatToSLST = (isoDate) => {
    if (!isoDate) return { date: "N/A", time: "N/A" };
    try {
      const d = new Date(isoDate);
      const date = d.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "Asia/Colombo",
      });
      const time = d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Colombo",
      });
      return { date, time };
    } catch (err) {
      return { date: "N/A", time: "N/A" };
    }
  };

  const startSLST = formatToSLST(event.start_time);
  const endSLST = formatToSLST(event.end_time);

  // ✅ Fetch coordinator data and show modal
  const handleContactCoordinator = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API}/api/facilitator/event-coordinators/${event._id}`);
      const coordinators = res.data.coordinators || [];
      setFacultyName(res.data.faculty || "N/A");

      if (coordinators.length === 0) {
        alert(`No coordinators available for faculty: ${res.data.faculty}`);
        return;
      }

      setCoordinatorList(coordinators);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching coordinators:", err);
      alert("Error fetching coordinator details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Event Card */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-transform duration-300 hover:scale-[1.02] border-0">
        <div className="aspect-[4/3] relative">
          <img
            src={EventImage}
            alt="Event poster"
            className="object-cover absolute inset-0 w-full h-full"
          />
        </div>

        <CardContent className="p-3">
          <p className="text-base font-semibold text-gray-900 mb-1 truncate">
            {event.name || event.title}
          </p>
          <p className="text-xs text-gray-500 mb-2">
            {startSLST.date} | {startSLST.time} - {endSLST.time}
          </p>
          <p className="text-xs text-gray-600 mb-4 line-clamp-1">
            📍 {event.venue || "Location not specified"}
          </p>

          <Button
            size="sm"
            onClick={handleContactCoordinator}
            disabled={isLoading}
            className="bg-teal-600 hover:bg-teal-700 text-white w-full"
          >
            {isLoading ? "Loading..." : "Contact Coordinator"}
          </Button>
        </CardContent>
      </Card>

      {/* ✅ Centered Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-lg shadow-2xl relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Coordinators – {facultyName}
            </h2>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {coordinatorList.map((c, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded-lg hover:shadow-md transition"
                >
                  <p><strong>👤 Name:</strong> {c.fullname || "N/A"}</p>
                  <p><strong>📧 Email:</strong> {c.email || "N/A"}</p>
                  <p><strong>📞 Contact:</strong> {c.contact || "N/A"}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-5">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="bg-teal-600 hover:bg-teal-700 text-white w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
