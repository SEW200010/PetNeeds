import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const getStatusColor = (status) => {
  switch (status) {
    case "Upcoming":
      return "text-green-600";
    case "Ongoing":
      return "text-blue-600";
    case "Completed":
      return "text-gray-600";
    case "Drafted":
      return "text-yellow-600";
    default:
      return "text-black";
  }
};

const ViewEvent = () => {
  const { id } = useParams();
  const [date, setDate] = useState(new Date());
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!id || id === "null") {
      // Redirect to event management page if invalid ID
      navigate("/admin/EventManagement", { replace: true });
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/events/${id}`);
        if (!res.ok) throw new Error(`Error fetching event: ${res.status} ${res.statusText}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`http://localhost:5000/participants?event_id=${id}`);
      if (!res.ok) throw new Error(`Error fetching participants: ${res.status} ${res.statusText}`);
      const data = await res.json();
      setParticipants(data);
      setShowParticipants(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load participants.");
    }
  };

  if (loading) return <div className="p-6">Loading event details...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!event) return <div className="p-6">No event data available.</div>;

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <AdminSidebar date={date} setDate={setDate} eventDates={[]} />
          <div className="w-full md:w-3/4 px-6 py-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-10">Event Management</h1>
            <h2 className="text-2xl font-bold text-teal-800 mb-10">{event.name || "Unnamed Event"}</h2>

            <div className="bg-white p-6 rounded-xl shadow space-y-6 text-[15px] text-gray-700">

              {/* Basic Info */}
              <section className="bg-gray-100 p-4 rounded-md flex flex-col lg:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-teal-800 mb-2">Basic Information</h3>
                  <p><strong>Date:</strong> {event.date || "N/A"}</p>
                  <p><strong>Time:</strong> {event.time || "N/A"}</p>
                  <p><strong>Venue:</strong> {event.venue || "N/A"}</p>
                  <p><strong>Status:</strong>{" "}
                    <span className={getStatusColor(event.status)}>{event.status || "N/A"}</span>
                  </p>
                </div>
                {event.poster && (
                  <img src={event.poster} alt="Event Poster" className="w-64 h-auto rounded-lg object-cover" />
                )}
              </section>

              {/* Description */}
              <section className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Program Description</h3>
                <p>{event.description || "No description provided."}</p>
              </section>

              {/* Speakers */}
              <section className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Speakers / Trainers</h3>
                {Array.isArray(event.speakers) && event.speakers.length > 0 ? (
                  <ul className="list-disc ml-5">
                    {event.speakers.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                ) : (
                  <p>No speakers listed.</p>
                )}
              </section>

              {/* Schedule */}
              <section className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Schedule</h3>
                {Array.isArray(event.schedule) && event.schedule.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {event.schedule.map((item, i) => (
                      <li key={i}>{item.startTime} - {item.endTime}: {item.activity}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No schedule provided.</p>
                )}
              </section>
                {/* Media Section */}
              <section className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Event Media</h3>
                {Array.isArray(event.eventMedia) && event.eventMedia.filter(m => m && m.trim() !== "").length > 0 ? (
                  <ul className="list-disc ml-5">
                    {event.eventMedia.filter(m => m && m.trim() !== "").map((media, index) => (
                      <li key={index}>{media}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No media types selected for this event.</p>
                )}
              </section>

              {/* Participants Summary + Button */}
              <section className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Participants</h3>
                {/* Number of Slots */}
                <p><strong>Total Number of Slots:</strong> {event.numberOfSlots ?? "N/A"}</p>
                <p><strong>Registered:</strong> {event.participants?.registered ?? 0}</p>
                <p><strong>Confirmed:</strong> {event.participants?.confirmed ?? 0}</p>
                <p><strong>Total:</strong>{" "}
                  {(event.participants?.registered ?? 0) + (event.participants?.confirmed ?? 0)}
                </p>

                <a
                  href={`/admin/events/${id}/basic`}
                  className="text-blue-600 hover:underline mt-1 inline-block"
                >
                  View Participants List
                </a>
              </section>

              {/* Feedback Summary + Link */}
              <section className="bg-gray-100 p-4 rounded-md">
                <h3 className="text-lg font-semibold text-teal-800 mb-2">Feedback Summary</h3>
                <a
                  href={`/admin/events/${id}/feedback`}
                  className="text-blue-600 hover:underline mt-1 inline-block"
                >
                  View Full Feedback List
                </a>
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-end">
                {event.status !== "Completed" && (
                 <button
                  onClick={() => navigate("/admin/EventManagement", { state: { event } })}
                  className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-center"
                >
                  Edit Event
                </button>

                )}
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this event?")) {
                      try {
                        const res = await fetch(`http://localhost:5000/events/${event._id}`, {
                          method: "DELETE",
                        });
                        const data = await res.json();
                        if (res.ok) {
                          alert(data.message || "Event deleted");
                          navigate("/admin/EventManagement");
                        } else {
                          alert(data.error || "Delete failed");
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Error deleting event.");
                      }
                    }
                  }}
                  className="w-40 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 text-center"
                >
                  Delete Event
                </button>
                           <button
  onClick={async () => {
    try {
      const res = await fetch(`http://localhost:5000/notify/${event._id}`, {
        method: "POST",
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Notification emails sent successfully!");
      } else {
        alert(result.error || "Failed to send emails.");
      }
    } catch (err) {
      console.error("Email error:", err);
      alert("An error occurred while sending emails.");
    }
  }}
  className="w-40 bg-teal-600 text-white px-2 py-2 rounded-md hover:bg-teal-700 text-center"
>
  Send Notification
</button>


              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewEvent;
