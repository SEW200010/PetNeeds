import React, { useState, useEffect, forwardRef } from "react";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { FaUsers, FaBookmark, FaPlay, FaStar } from "react-icons/fa";
import { Search } from "lucide-react";
import StickyHeadTable from "../../components/Admin/StickyHeadTable";
import { Add, Remove } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  InputAdornment,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";

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

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EventManagement = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [speakers, setSpeakers] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    event_id: "",
    name: "",
    date: "",
    time: "",
    description: "",
    venue: "",
    schedule: [{ startTime: "", endTime: "", activity: "" }],
    status: "Drafted",
    speakers: [],
    participants: { registered: "", confirmed: "" },
    numberOfSlots: "",
    eventMedia: [],
  });

  const fetchEvents = () => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        const validEvents = data.filter((e) => e._id && typeof e._id === "string" && e._id.length === 24);
        setEvents(validEvents);
        setFilteredEvents(validEvents);
      })
      .catch((err) => console.error("Error fetching events:", err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");
    if (editId && events.length > 0 && !showForm) {
      const eventToEdit = events.find((e) => e._id === editId);
      if (eventToEdit) handleEditClick(eventToEdit);
    }
  }, [location.search, events, showForm]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredEvents(
      events.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.venue.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, events]);

  const handleEditClick = (event) => {
    setFormData({
      event_id: event.event_id || 0,
      name: event.name || "",
      date: event.date || "",
      time: event.time || "",
      description: event.description || "",
      venue: event.venue || "",
      schedule: Array.isArray(event.schedule)
        ? event.schedule.map((item) => ({
            startTime: item.startTime || "",
            endTime: item.endTime || "",
            activity: item.activity || "",
          }))
        : [{ startTime: "", endTime: "", activity: "" }],
      status: typeof event.status === "string" ? event.status : "Drafted",
      speakers: Array.isArray(event.speakers) ? event.speakers : [],
      participants: event.participants || { registered: "", confirmed: "" },
      numberOfSlots: event.numberOfSlots || "",
      eventMedia: [], // Reset to avoid loading files
    });
    setEditingEventId(event._id);
    setSpeakers((event.speakers || []).join(", "));
    setIsEditMode(true);
    setShowForm(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["registered", "confirmed"].includes(name)) {
      let numericValue = value === "" ? "" : parseInt(value, 10);
      if (isNaN(numericValue)) numericValue = "";
      setFormData((prev) => ({
        ...prev,
        participants: {
          ...(prev.participants || {}),
          [name]: numericValue,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      event_id: 0,
      name: "",
      date: "",
      time: "",
      description: "",
      venue: "",
      schedule: [{ startTime: "", endTime: "", activity: "" }],
      status: "Drafted",
      speakers: [],
      participants: { registered: "", confirmed: "" },
      numberOfSlots: "",
      eventMedia: [],
    });
    setSpeakers("");
  };

  const [formError, setFormError] = React.useState("");

  // Helper function to determine general file type
  const getFileType = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'avi', 'mov', 'mkv'].includes(ext)) return 'video';
    if (ext === 'pdf') return 'pdf';
    return null;
  };

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    setFormError("");
    if (
      !formData.name ||
      !formData.date ||
      !formData.time ||
      !formData.description ||
      !formData.venue ||
      !formData.status
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/events/${editingEventId}`
      : "http://localhost:5000/events";

    const speakersArray = speakers
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // Prepare JSON data to send
    let eventIdToSend = formData.event_id;
    if (typeof eventIdToSend === "string" && /^\d+$/.test(eventIdToSend)) {
      eventIdToSend = parseInt(eventIdToSend, 10);
    }

    const jsonData = {
      event_id: eventIdToSend || uuidv4(),
      name: formData.name,
      date: formData.date,
      time: formData.time,
      description: formData.description,
      venue: formData.venue,
      status: formData.status,
      numberOfSlots: formData.numberOfSlots,
      participants: formData.participants,
      speakers: speakersArray,
      schedule: formData.schedule,
      eventMedia: formData.eventMedia || [],
    };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to save event");
        }
        return res.json();
      })
      .then(() => {
        fetchEvents();
        setShowForm(false);
        setIsEditMode(false);
        setEditingEventId(null);
        resetForm();
        navigate("/admin/EventManagement", { replace: true });
      })
      .catch((err) => {
        setFormError(err.message);
      });
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData((prev) => ({ ...prev, schedule: updatedSchedule }));
  };

  const totalRegistered = events.reduce((sum, e) => {
    return sum + (e.participants?.registered || 0);
  }, 0);

  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { startTime: "", endTime: "", activity: "" }],
    }));
  };

  const removeScheduleItem = (index) => {
    const updatedSchedule = [...formData.schedule];
    if (updatedSchedule.length > 1) {
      updatedSchedule.splice(index, 1);
      setFormData((prev) => ({ ...prev, schedule: updatedSchedule }));
    }
  };

  const handleFilterChange = (status) => setFilterStatus(status);

  const handleSortToggle = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredEvents(sortedEvents);
  };

  function parseDate(str) {
    const [day, month, year] = str.split("/");
    return new Date(year, month - 1, day);
  }

  const processedEvents = filteredEvents
    .filter((event) => (filterStatus === "All" ? true : event.status === filterStatus))
    .sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 flex">
        <AdminSidebar date={date} setDate={setDate} eventDates={[]} />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
            <Button
              onClick={() => {
                setShowForm(true);
                setIsEditMode(false);
                resetForm();
              }}
              sx={{
                backgroundColor: "green",
                "&:hover": { backgroundColor: "darkgreen" },
                color: "white",
              }}
            >
              Create New Event
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6 flex justify-center w-full">
            <div className="relative max-w-md w-full">
              <TextField
                placeholder="Search events"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    height: "40px",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& fieldset": {
                      borderColor: "black",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search className="text-gray-400 w-4 h-4" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-15 px-8 mr-5">
            <div className="bg-[#C6E6D9] p-6 rounded-2xl text-center font-semibold">
              <FaUsers className="text-2xl mx-auto" />
              <div className="text-green-700 text-xl">{totalRegistered}</div>
              <div>Registered Participants</div>
            </div>
            <div className="bg-[#C6E6D9] p-6 rounded-2xl text-center font-semibold">
              <FaBookmark className="text-2xl mx-auto" />
              <div className="text-green-700 text-xl">{events.length}</div>
              <div>Total Events</div>
            </div>
            <div className="bg-[#C6E6D9] p-6 rounded-2xl text-center font-semibold">
              <FaPlay className="text-2xl mx-auto" />
              <div className="text-green-700 text-xl">
                {events.filter((e) => e.status === "Upcoming").length}
              </div>
              <div>Upcoming Events</div>
            </div>
            <div className="bg-[#C6E6D9] p-6 rounded-2xl text-center font-semibold">
              <div className="flex justify-center gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <FaStar key={i} className="text-yellow-500 text-xl" />
                ))}
                <FaStar className="text-white text-xl mb-7" />
              </div>
              <div className="text-base">Overview Ratings</div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mb-1 px-8">
            {/* Sort Button */}
            <Button
              onClick={handleSortToggle}
              variant="contained"
              sx={{
                backgroundColor: "#4B9E8B",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#004830",
                },
              }}
            >
              Sort {sortOrder === "asc" ? "Oldest" : "Newest"}
            </Button>

            {/* Filter Dropdown */}
            <FormControl size="small">
              <Select
                displayEmpty
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                renderValue={(selected) => selected || "Filter"}
                sx={{
                  minWidth: 90,
                  backgroundColor: "#4B9E8B",
                  color: "#ffffff",
                  borderRadius: "6px",
                  "& .MuiSelect-icon": { color: "#ffffff" },
                  "&:hover": { backgroundColor: "#004830" },
                }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Drafted">Drafted</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Event Table */}
          <div className="bg-white p-6 rounded-xl shadow">
            <StickyHeadTable
              columns={[
                { id: "event_id", label: "Event ID" },
                { id: "name", label: "Event Name" },
                { id: "date", label: "Date" },
                { id: "status", label: "Status" },
                {
                  id: "actions",
                  label: "Actions",
                  render: (_, row) => (
                    <div className="flex gap-2">
                    <button
                      onClick={() => {
                        console.log("Navigating to view event with _id:", row._id);
                        if (row._id && row._id.length === 24) {
                          navigate(`/admin/ViewEvent/${row._id}`);
                        } else {
                          alert("Invalid event ID. Cannot view event.");
                        }
                      }}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded text-xs"
                    >
                      View
                    </button>
                      <button
                        onClick={() => handleEditClick(row)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={processedEvents.map((event, index) => ({
                ...event,
                event_id: index + 1,
                no: index + 1,
                status: (
                  <span className={`font-semibold ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                ),
              }))}
            />

            {/* Event Form Dialog */}
            <Dialog
              open={showForm}
              onClose={() => {
                setShowForm(false);
                setIsEditMode(false);
                resetForm();
              }}
              maxWidth="sm"
              fullWidth
              TransitionComponent={Transition}
            >
              <DialogTitle>
                {isEditMode ? "Edit Event" : "Create New Event"}
                <Button
                  size="small"
                  onClick={() => setIsMinimized(!isMinimized)}
                  sx={{ float: "right", minWidth: "auto", padding: "4px 8px" }}
                >
                  {isMinimized ? "Maximize" : "Minimize"}
                </Button>
              </DialogTitle>
              <form onSubmit={handleAddOrUpdateEvent}>
                {!isMinimized && (
                  <DialogContent dividers>
                    {formError && (
                      <div className="mb-4 text-red-600 font-semibold">{formError}</div>
                    )}
                    <TextField
                      margin="dense"
                      label="Event Title"
                      name="name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    <TextField
                      margin="dense"
                      type="date"
                      label="Date"
                      name="date"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                    <TextField
                      margin="dense"
                      type="time"
                      label="Time"
                      name="time"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                    <TextField
                      margin="dense"
                      label="Description"
                      name="description"
                      fullWidth
                      required
                      multiline
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                     <TextField
                      margin="dense"
                      label="Number of Slots"
                      name="numberOfSlots"
                      type="number"
                      fullWidth
                      value={formData.numberOfSlots}
                      onChange={handleInputChange}
                    />
                    
                    <div className="flex gap-4 my-4">
                      <TextField
                        margin="dense"
                        label="Registered Participants"
                        name="registered"
                        type="number"
                        fullWidth
                        required
                        value={formData.participants.registered}
                        onChange={(e) =>
                          handleInputChange({
                            target: { name: "registered", value: e.target.value },
                          })
                        }
                      />
                      <TextField
                        margin="dense"
                        label="Confirmed Participants"
                        name="confirmed"
                        type="number"
                        fullWidth
                        required
                        value={formData.participants.confirmed}
                        onChange={(e) =>
                          handleInputChange({
                            target: { name: "confirmed", value: e.target.value },
                          })
                        }
                      />
                    </div>

                    <TextField
                      margin="dense"
                      label="Venue"
                      name="venue"
                      fullWidth
                      required
                      value={formData.venue}
                      onChange={handleInputChange}
                    />

                    <TextField
                      margin="dense"
                      label="Speakers (comma separated)"
                      name="speakers"
                      fullWidth
                      value={speakers}
                      onChange={(e) => setSpeakers(e.target.value)}
                    />

                    {/* Schedule Inputs */}
                    <div className="my-4">
                      <label className="block font-semibold mb-2">Schedule</label>
                      {formData.schedule.map((item, idx) => (
                        <div key={idx} className="flex gap-3 mb-2">
                          <TextField
                            label="Start Time"
                            type="time"
                            required
                            value={item.startTime}
                            onChange={(e) =>
                              handleScheduleChange(idx, "startTime", e.target.value)
                            }
                          />
                          <TextField
                            label="End Time"
                            type="time"
                            required
                            value={item.endTime}
                            onChange={(e) =>
                              handleScheduleChange(idx, "endTime", e.target.value)
                            }
                          />
                          <TextField
                            label="Activity"
                            required
                            value={item.activity}
                            onChange={(e) =>
                              handleScheduleChange(idx, "activity", e.target.value)
                            }
                            sx={{ flex: 1 }}
                          />
                          <IconButton onClick={() => removeScheduleItem(idx)}>
                            <Remove />
                          </IconButton>
                        </div>
                      ))}
                      <Button onClick={addScheduleItem} startIcon={<Add />}>
                        Add Schedule Item
                      </Button>
                    </div>
                        
                    {/* Status Select */}
                    <FormControl fullWidth margin="dense" required>
                      <InputLabel>Status</InputLabel>
                      <Select
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="Drafted">Drafted</MenuItem>
                        <MenuItem value="Upcoming">Upcoming</MenuItem>
                        <MenuItem value="Ongoing">Ongoing</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                      </Select>
                    </FormControl>
                  </DialogContent>
                )}

                <DialogActions>
                  <Button
                    onClick={() => {
                      setShowForm(false);
                      setIsEditMode(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" sx={{ backgroundColor: "#4B9E8B" }}>
                    {isEditMode ? "Update Event" : "Create Event"}
                  </Button>
                </DialogActions>
              </form>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventManagement; 