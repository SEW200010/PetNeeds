import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import FilterJsxProp from "../../components/User/FilterJsxProp";

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

const API_BASE_URL = "http://localhost:5000";

const ViewEvent = () => {
  const { id } = useParams();
  const [date, setDate] = useState(new Date());
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || id === "null") {
      navigate("/admin/EventManagement", { replace: true });
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/events/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch event");
        setEvent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile || !event?._id) {
      alert("File or event ID missing");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("eventId", event._id);

    try {
      const res = await fetch(`${API_BASE_URL}/upload_media`, {
        method: "POST",
        body: formData,
      });

      // Parse response
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      // Add new media to event state
      setEvent((prev) => ({
        ...prev,
        eventMedia: [...(prev.eventMedia || []), data.media],
      }));

      setSelectedFile(null);
      alert("Upload successful!");
    } catch (err) {
      alert("Upload error: " + err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!event) return <div className="p-6">No event found.</div>;

  return (
    <FilterJsxProp>
      <>
        <Header />
        <main className="bg-gray-100 pt-[65px] min-h-screen">
          <div className="flex flex-col md:flex-row">
            <AdminSidebar date={date} setDate={setDate} eventDates={[]} />
            <div className="w-full md:w-3/4 px-6 py-8">
              <h1 className="text-3xl font-extrabold text-gray-800 mb-10">
                Event Management
              </h1>
              <h2 className="text-2xl font-bold text-teal-800 mb-10">
                {event.name || "Unnamed Event"}
              </h2>

              <div className="bg-white p-6 rounded-xl shadow space-y-6 text-[15px] text-gray-700">
                {/* Basic Info */}
                <section className="bg-gray-100 p-4 rounded-md flex flex-col lg:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-teal-800 mb-2">
                      Basic Information
                    </h3>
                    <p>
                      <strong>Date:</strong> {event.date || "N/A"}
                    </p>
                    <p>
                      <strong>Time:</strong> {event.time || "N/A"}
                    </p>
                    <p>
                      <strong>Venue:</strong> {event.venue || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className={getStatusColor(event.status)}>
                        {event.status || "N/A"}
                      </span>
                    </p>
                  </div>
                  {event.poster && (
                    <img
                      src={event.poster}
                      alt="Event Poster"
                      className="w-64 h-auto rounded-lg object-cover"
                    />
                  )}
                </section>

                {/* Description */}
                <section className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-teal-800 mb-2">
                    Program Description
                  </h3>
                  <p>{event.description || "No description provided."}</p>
                </section>

                {/* Speakers */}
                <section className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-teal-800 mb-2">
                    Speakers / Trainers
                  </h3>
                  {Array.isArray(event.speakers) && event.speakers.length > 0 ? (
                    <ul className="list-disc ml-5">
                      {event.speakers.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No speakers listed.</p>
                  )}
                </section>

                {/* Schedule */}
                <section className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-teal-800 mb-2">
                    Schedule
                  </h3>
                  {Array.isArray(event.schedule) && event.schedule.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {event.schedule.map((item, i) => (
                        <li key={i}>
                          {item.startTime} - {item.endTime}: {item.activity}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No schedule provided.</p>
                  )}
                </section>

                {/* Event Media */}
                {/* ... other imports and code above */}

{/* Event Media Section */}
<section className="bg-gray-100 p-4 rounded-md">
  <h3 className="text-lg font-semibold text-teal-800 mb-4">Event Media</h3>

  {event.eventMedia && event.eventMedia.length > 0 ? (
    <ul className=" list-inside text-gray-700 text-sm space-y-1">
      {event.eventMedia.map((media, index) => {
        const fileType = media.type || "";

        const isPPT =
          fileType === "application/vnd.ms-powerpoint" ||
          fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation";

        return (
          <li key={index}>
            {name} {isPPT && <span className="text-purple-600 font-semibold">(PowerPoint)</span>}
          </li>
        )
      })}
    </ul>
  ) : (
    <p>No media uploaded yet.</p>
  )}
{event.eventMedia?.map((media, index) => (
  <div key={index} className="mt-2">
    <p className="text-sm">{media.fileName}</p>
    <a
      href={`http://localhost:5000/api/events/download/${encodeURIComponent(media.fileName)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline text-sm"
    >
      Download
    </a>
  </div>
))}


  <form
    onSubmit={handleUpload}
    className="flex items-center gap-4 flex-wrap mt-4"
  >
    <input
      id="file-upload"
      type="file"
      name="media"
      accept="image/*,video/*,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
      onChange={handleFileChange}
      className="hidden"
    />
    <label
      htmlFor="file-upload"
      className="inline-block cursor-pointer bg-teal-600 mt-2 text-white px-4 py-2 rounded hover:bg-teal-700 select-none"
    >
      Choose File
    </label>
    <button
      type="submit"
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2"
    >
      Upload Media
    </button>
  </form>
</section>

{/* Other sections below, make sure each is closed properly */}
{/* e.g. Participants section, Feedback section, Buttons section */}


                {/* Participants */}
                <section className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-teal-800 mb-2">
                    Participants
                  </h3>
                  <p>
                    <strong>Total Number of Slots:</strong>{" "}
                    {event.numberOfSlots ?? "N/A"}
                  </p>
                  <p>
                    <strong>Registered:</strong>{" "}
                    {(event.participants && event.participants.registered) ?? 0}
                  </p>
                  <p>
                    <strong>Confirmed:</strong>{" "}
                    {(event.participants && event.participants.confirmed) ?? 0}
                  </p>
                  <p>
                    <strong>Total:</strong>{" "}
                    {((event.participants && event.participants.registered) ?? 0) +
                      ((event.participants && event.participants.confirmed) ?? 0)}
                  </p>
                  <a
                    href={`/admin/events/${id}/basic`}
                    className="text-blue-600 hover:underline mt-1 inline-block"
                  >
                    View Participants List
                  </a>
                </section>

                {/* Feedback */}
                <section className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold text-teal-800 mb-2">
                    Feedback Summary
                  </h3>
                  <a
                    href={`/admin/events/${id}/feedback`}
                    className="text-blue-600 hover:underline mt-1 inline-block"
                  >
                    View Full Feedback List
                  </a>
                </section>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-end">
                  {event.status !== "Completed" && (
                    <button
                      onClick={() =>
                        navigate("/admin/EventManagement", { state: { event } })
                      }
                      className="w-40 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-center"
                    >
                      Edit Event
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      if (!(event && event._id)) {
                        alert("Invalid event ID. Cannot delete.");
                        return;
                      }
                      if (
                        window.confirm("Are you sure you want to delete this event?")
                      ) {
                        try {
                          const res = await fetch(`${API_BASE_URL}/events/${event._id}`, {
                            method: "DELETE",
                          });
                          const text = await res.text();
                          if (!res.ok) {
                            alert(`Delete failed: ${res.status} ${res.statusText} - ${text}`);
                            return;
                          }
                          const data = await res.json();
                          alert(data.message || "Event deleted");
                          navigate("/admin/EventManagement");
                        } catch (err) {
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
                      if (!(event && event._id)) {
                        alert("Invalid event ID. Cannot send notifications.");
                        return;
                      }
                      try {
                        const res = await fetch(`${API_BASE_URL}/notify/${event._id}`, {
                          method: "POST",
                        });
                        const text = await res.text();
                        if (!res.ok) {
                          alert(`Failed to send emails: ${res.status} ${res.statusText} - ${text}`);
                          return;
                        }
                        const result = await res.json();
                        alert(result.message || "Notification emails sent successfully!");
                      } catch (err) {
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
      </>
    </FilterJsxProp>
  );
};

export default ViewEvent;
