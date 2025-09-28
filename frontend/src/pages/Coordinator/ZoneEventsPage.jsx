import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const ZoneEventsPage = () => {
  const { zoneId } = useParams();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/zone/${zoneId}/events`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, [zoneId]);

  return (
    <div>
      <h2>Events for Zone {zoneId}</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((ev) => (
            <li key={ev.id}>{ev.name}</li>
          ))}
        </ul>
      ) : (
        <p>No events found for this zone.</p>
      )}
    </div>
  );
};

export default ZoneEventsPage;
