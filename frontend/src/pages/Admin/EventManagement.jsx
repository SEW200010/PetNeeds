import React, { useState, useEffect, forwardRef } from "react";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { FaUsers, FaBookmark, FaPlay, FaStar } from "react-icons/fa";
import { Search } from "lucide-react";
import StickyHeadTable from "../../components/Admin/StickyHeadTable";
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
  const [totalAvgRating, setTotalAvgRating] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [districts, setDistricts] = useState([]);
const [provinceList, setProvinceList] = useState([]);
const [filteredDistricts, setFilteredDistricts] = useState([]);
const [zones, setZones] = useState([]);
const [filteredZones, setFilteredZones] = useState([]);


  const [formData, setFormData] = useState({
    name: "", date: "", description: "", start_time: "", end_time: "", venue: "", status: "Drafted", speakers: [], province: "", district: "", zone_id: "", participants: { registered_users: [], confirmed_users: [] }, numberOfSlots: "", eventMedia: [],
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

  const handleDistrictChange = (e) => {
  const selectedDistrict = e.target.value;
  setFormData({ ...formData, district: selectedDistrict, zone_id: "" }); // reset zone

  // Filter zones from your backend
  fetch(`http://localhost:5000/zones?district_id=${selectedDistrict}`)
    .then((res) => res.json())
    .then((data) => {
      setFilteredZones(data); // store zones for selected district
    })
    .catch((err) => console.error("Error fetching zones:", err));
};


  useEffect(() => {
    fetchEvents();

    fetch("http://localhost:5000/districts") // your API to get districts
    .then((res) => res.json())
    .then((data) => {
      setDistricts(data);
      // extract unique provinces
      const provinces = [...new Set(data.map(d => d.province))];
      setProvinceList(provinces);
    })
    .catch(err => console.error(err));

    
  }, []);

  const handleProvinceChange = (e) => {
  const selectedProvince = e.target.value;
  setFormData({ ...formData, province: selectedProvince, district: "" }); // reset district
  const filtered = districts.filter(d => d.province === selectedProvince);
  setFilteredDistricts(filtered);
};


  useEffect(() => {
    fetch("http://localhost:5000/all_feedback")
      .then((res) => res.json())
      .then((data) => {
        const ratings = data.map(item => Number(item.rating)).filter(r => !isNaN(r));
        const total = ratings.reduce((sum, r) => sum + r, 0);
        const average = ratings.length ? (total / ratings.length).toFixed(2) : null;
        setTotalAvgRating(average);
      })
      .catch((err) => {
        console.error("Error fetching all feedback:", err);
      });
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
    name: event.name || "",
    date: event.date || "",
    description: event.description || "",
    start_time: event.start_time || "",
    end_time: event.end_time || "",
    venue: event.venue || "",
    status: typeof event.status === "string" ? event.status : "Drafted",
    speakers: Array.isArray(event.speakers) ? event.speakers : [],
    province: event.province || "",
    district: event.district || "",
    zone_id: event.zone_id || "",
    participants: event.participants || { registered_users: [], confirmed_users: [] },
    numberOfSlots: event.numberOfSlots || "",
    eventMedia: [], // Reset so no old uploads stay
  });
  setEditingEventId(event._id);
  setSpeakers((event.speakers || []).join(", "));
  setIsEditMode(true);
  setShowForm(true);
};

const resetForm = () => {
  setFormData({
    name: "",
    date: "",
    description: "",
    start_time: "",
    end_time: "",
    venue: "",
    status: "Drafted",
    speakers: [],
    province: "",
    district: "",
    zone_id: "",
    participants: { registered_users: [], confirmed_users: [] },
    numberOfSlots: "",
    eventMedia: [],
  });
  setSpeakers("");
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


    // Validate required fields
    if (
      !formData.name ||
      !formData.date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.description ||
      !formData.venue ||
      !formData.status
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    // Validate numberOfSlots
    if (
      formData.numberOfSlots !== "" &&
      (!Number.isInteger(Number(formData.numberOfSlots)) || Number(formData.numberOfSlots) < 0)
    ) {
      setFormError("Number of Slots must be a positive integer.");
      return;
    }

    // Validate participants registered and confirmed
    if (
      formData.participants.registered !== "" &&
      (!Number.isInteger(Number(formData.participants.registered)) || Number(formData.participants.registered) < 0)
    ) {
      setFormError("Registered participants must be a positive integer.");
      return;
    }
    if (
      formData.participants.confirmed !== "" &&
      (!Number.isInteger(Number(formData.participants.confirmed)) || Number(formData.participants.confirmed) < 0)
    ) {
      setFormError("Confirmed participants must be a positive integer.");
      return;
    }

 

    // Validate speakers input (comma separated)
    const speakersArray = speakers
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (speakers && speakersArray.length === 0) {
      setFormError("Please enter valid speakers separated by commas.");
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/events/${editingEventId}`
      : "http://localhost:5000/events";

    // Prepare JSON data to send
    let eventIdToSend = formData.event_id;
    if (typeof eventIdToSend === "string" && /^\d+$/.test(eventIdToSend)) {
      eventIdToSend = parseInt(eventIdToSend, 10);
    }

    const jsonData = {
      
      name: formData.name,
      date: formData.date,
      time: formData.start_time,
      description: formData.description,
      venue: formData.venue,
      status: formData.status,
      numberOfSlots: Number(formData.numberOfSlots) || 0,
      participants: {
        registered: Number(formData.participants.registered) || 0,
        confirmed: Number(formData.participants.confirmed) || 0,
      },
      speakers: speakersArray,
     
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



  const totalRegistered = events.reduce((sum, e) => {
    return sum + (e.participants?.registered || 0);
  }, 0);


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
  if (!str || typeof str !== "string") {
    console.error("Invalid date string:", str);
    return null;
  }

  const parts = str.split("/");
  if (parts.length !== 3) {
    console.error("Date format should be dd/mm/yyyy:", str);
    return null;
  }

  const [day, month, year] = parts.map(Number); // convert to numbers
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
              <FaStar
                      key={i}
                      className={`text-xl ${
                        totalAvgRating >= i
                          ? "text-yellow-500"
                          : totalAvgRating >= i - 0.5
                          ? "text-yellow-300"
                          : "text-white"
                      }`}
                    />               
                     ))}
                <FaStar className="text-white text-xl mb-7" />
              </div>
              <div className="text-base">Overview Ratings</div>
              <p className="text-lg font-semibold mb-4">{totalAvgRating || "Not available"}
</p>

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
        label="Start Time"
        name="start_time"
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        value={formData.start_time}
        onChange={handleInputChange}
      />

      <TextField
        margin="dense"
        type="time"
        label="End Time"
        name="end_time"
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
        value={formData.end_time}
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
          label="Registered Users"
          name="registered_users"
          fullWidth
          value={formData.participants.registered_users.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              participants: {
                ...formData.participants,
                registered_users: e.target.value.split(",").map((s) => s.trim()),
              },
            })
          }
        />
        <TextField
          margin="dense"
          label="Confirmed Users"
          name="confirmed_users"
          fullWidth
          value={formData.participants.confirmed_users.join(", ")}
          onChange={(e) =>
            setFormData({
              ...formData,
              participants: {
                ...formData.participants,
                confirmed_users: e.target.value.split(",").map((s) => s.trim()),
              },
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

     <FormControl fullWidth margin="dense" required>
  <InputLabel>Province</InputLabel>
  <Select
    label="Province"
    name="province"
    value={formData.province}
    onChange={handleProvinceChange}
  >
    {provinceList.map((prov) => (
      <MenuItem key={prov} value={prov}>
        {prov}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl fullWidth margin="dense" required>
  <InputLabel>District</InputLabel>
  <Select
    label="District"
    name="district"
    value={formData.district}
    onChange={handleDistrictChange}
    disabled={!formData.province} // disable until a province is selected
  >
    {filteredDistricts.map((d) => (
      <MenuItem key={d._id} value={d._id}>
        {d.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>


      <FormControl fullWidth margin="dense" required>
  <InputLabel>Zone</InputLabel>
  <Select
    label="Zone"
    name="zone_id"
    value={formData.zone_id}
    onChange={(e) => setFormData({ ...formData, zone_id: e.target.value })}
    disabled={!formData.district} // disabled until a district is selected
  >
    {filteredZones.map((z) => (
      <MenuItem key={z._id} value={z._id}>
        {z.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>


      {/* Event Media URLs */}
      <TextField
        margin="dense"
        label="Event Media URL (comma separated)"
        name="eventMedia"
        fullWidth
        value={formData.eventMedia.map((m) => m.url).join(", ")}
        onChange={(e) => {
          const urls = e.target.value.split(",").map((url) => url.trim());
          setFormData({
            ...formData,
            eventMedia: urls.map((url) => ({ type: "image", url })),
          });
        }}
      />

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
          <MenuItem value="Published">Published</MenuItem>
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