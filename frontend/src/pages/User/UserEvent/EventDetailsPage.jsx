import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:5000/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEvent(res.data.event))
      .catch((err) => console.error(err));
  }, [eventId]);

  if (!event) return <p>Loading event details...</p>;

  const handleModuleToggle = (moduleName) => {
    setSelectedModules((prev) =>
      prev.includes(moduleName)
        ? prev.filter((m) => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-4">
      <CardContent>
        <h2 className="text-xl font-bold mb-2">{event.name}</h2>
        <p className="text-sm text-gray-600 mb-4">
          {new Date(event.start_time).toLocaleString()} -{" "}
          {new Date(event.end_time).toLocaleString()}
        </p>

        <h3 className="font-semibold mb-2">Modules</h3>
        <div className="space-y-1">
          {event.modules?.map((module) => (
            <label key={module} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedModules.includes(module)}
                onChange={() => handleModuleToggle(module)}
              />
              <span>{module}</span>
            </label>
          ))}
        </div>

        <Button
          className="mt-4 bg-teal-600 hover:bg-teal-700 text-white w-full"
          onClick={() => alert(`Joined modules: ${selectedModules.join(", ")}`)}
        >
          Confirm Modules
        </Button>
      </CardContent>
    </Card>
  );
}
