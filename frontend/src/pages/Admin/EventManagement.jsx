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
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    description: "",
    venue: "",
    schedule: [{ startTime: "", endTime: "", activity: "" }],
    status: "Drafted",
    speakers: [],
    participants: {
      registered: "",
      confirmed: "",
    },
  });

  const fetchEvents = () => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch((err) => console.error("Error fetching events:", err));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");
    if (editId && events.length > 0) {
      const eventToEdit = events.find((e) => e._id === editId);
      if (eventToEdit) handleEditClick(eventToEdit);
    }
  }, [location.search, events]);

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
  const participants = event.participants || {};

  setFormData({
    name: event.name || "",
    date: event.date || "",
    time: event.time || "",
    description: event.description || "",
    venue: event.venue || "",
    schedule: Array.isArray(event.schedule) && event.schedule.length > 0
      ? event.schedule
      : [{ startTime: "", endTime: "", activity: "" }],
    status: event.status || "Drafted",
    speakers: event.speakers || [],
    participants: {
      registered: participants.registered ?? "",
      confirmed: participants.confirmed ?? "",
    },
  });

  setSpeakers((event.speakers || []).join(", "));
  setEditingEventId(event._id);
  setIsEditMode(true);
  setShowForm(true);
};



  const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (["registered", "confirmed"].includes(name)) {
    setFormData((prev) => ({
      ...prev,
      participants: {
        ...(prev.participants || {}),
        [name]: value,
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
      name: "",
      date: "",
      time: "",
      description: "",
      venue: "",
      schedule: [{ startTime: "", endTime: "", activity: "" }],
      status: "Drafted",
      speakers: [],
      participants: { registered: "", confirmed: "" },
    });
    setSpeakers("");
  };

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/events/${editingEventId}`
      : "http://localhost:5000/events";

    const speakersArray = speakers
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

       console.log("Sending data:", {
    ...formData,
    speakers: speakersArray,
  });

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, speakers: speakersArray }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchEvents();
        setShowForm(false);
        setIsEditMode(false);
        setEditingEventId(null);
        resetForm();
        window.history.replaceState({}, document.title, "/admin/EventManagement");
      })
      .catch((err) => console.error("Error saving event:", err));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData((prev) => ({ ...prev, schedule: updatedSchedule }));
  };

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

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

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
  // Assuming date format is "DD/MM/YYYY", parse accordingly
  const [day, month, year] = str.split("/");
  return new Date(year, month - 1, day);
}

  const processedEvents = filteredEvents
  .filter((event) => (filterStatus === "All" ? true : event.status === filterStatus))
  .sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  })
    .sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
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
              <div className="text-green-700 text-xl">230</div>
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
    backgroundColor: '#4B9E8B',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#004830',
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
      backgroundColor: '#4B9E8B', // green-700
      color: '#ffffff',
      borderRadius: '6px',
      '& .MuiSelect-icon': {color: '#ffffff'},
      '&:hover': {backgroundColor: '#004830'},
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
                { id: "no", label: "#" },
                { id: "name", label: "Event Name" },
                { id: "date", label: "Date" },
                { id: "status", label: "Status" },
                {
                  id: "actions",
                  label: "Actions",
                  render: (_, row) => (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/ViewEvent/${row._id}`)}
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
  ...event, // <-- this adds the full event data
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
            >
              <DialogTitle>{isEditMode ? "Edit Event" : "Create New Event"}</DialogTitle>
              <form onSubmit={handleAddOrUpdateEvent}>
                <DialogContent dividers>
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
                        handleInputChange({ target: { name: "registered", value: e.target.value } })
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
                        handleInputChange({ target: { name: "confirmed", value: e.target.value } })
                      }
                    />
                  </div>

                  <TextField
                    label="Speakers"
                    name="speakers"
                    multiline
                    rows={3}
                    value={speakers}
                    onChange={(e) => setSpeakers(e.target.value)}
                    placeholder="Enter speakers separated by commas"
                  />

                  <TextField
                    margin="dense"
                    label="Venue"
                    name="venue"
                    fullWidth
                    required
                    value={formData.venue}
                    onChange={handleInputChange}
                  />

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule (Start Time – End Time – Activity)
                    </label>
                    {formData.schedule.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row gap-1 items-start md:items-center mb-3"
                      >
                        <TextField
                          type="time"
                          label="Start"
                          value={item.startTime}
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) =>
                            handleScheduleChange(index, "startTime", e.target.value)
                          }
                          size="small"
                          className="w-full md:w-35"
                        />
                        <TextField
                          type="time"
                          label="End"
                          value={item.endTime}
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) =>
                            handleScheduleChange(index, "endTime", e.target.value)
                          }
                          size="small"
                          className="w-full md:w-35"
                        />
                        <TextField
                          label="Activity"
                          value={item.activity}
                          onChange={(e) =>
                            handleScheduleChange(index, "activity", e.target.value)
                          }
                          size="small"
                          className="w-full md:flex-1"
                        />
                        <div className="flex gap-2 mt-1 md:mt-0">
                          <IconButton
                            aria-label="remove"
                            onClick={() => removeScheduleItem(index)}
                            disabled={formData.schedule.length === 1}
                          >
                            <Remove sx={{ fontSize: 15, color: "red" }} />
                          </IconButton>
                          {index === formData.schedule.length - 1 && (
                            <IconButton aria-label="add" onClick={addScheduleItem}>
                              <Add sx={{ fontSize: 15, color: "red" }} />
                            </IconButton>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                      labelId="status-label"
                      name="status"
                      value={formData.status}
                      label="Status"
                      onChange={handleInputChange}
                      required
                    >
                      <MenuItem value="Upcoming">Upcoming</MenuItem>
                      <MenuItem value="Ongoing">Ongoing</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Drafted">Drafted</MenuItem>
                    </Select>
                  </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setShowForm(false);
                      setIsEditMode(false);
                      resetForm();
                    }}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="success">
                    {isEditMode ? "Save Changes" : "Submit"}
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
