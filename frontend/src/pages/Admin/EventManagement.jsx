import React, { useState, useEffect, forwardRef } from "react";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { FaUsers, FaBookmark, FaPlay, FaStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
  TableContainer,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate, useLocation } from "react-router-dom";
import { Add, Remove } from "@mui/icons-material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: `#00695c`,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
  });

  // Fetch all events from backend
  const fetchEvents = () => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setFilteredEvents(data);
      })
      .catch((err) => console.error("Error fetching events:", err));
  };

  // Handle pre-filling form if editing via URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get("edit");

    if (editId && events.length > 0) {
      const eventToEdit = events.find((e) => e._id === editId);
      if (eventToEdit) {
        handleEditClick(eventToEdit);
      }
    }
  }, [location.search, events]);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events by search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredEvents(events.filter((e) => e.name.toLowerCase().includes(query)));
  }, [searchQuery, events]);

  // Submit form for create or update
  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/events/${editingEventId}`
      : "http://localhost:5000/events";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        fetchEvents();
        setSearchQuery("");
        setShowForm(false);
        setIsEditMode(false);
        setEditingEventId(null);
        resetForm();
        window.history.replaceState({}, document.title, "/admin/EventManagement");
      })
      .catch((err) => console.error("Error saving event:", err));
  };

  // Prepare form for editing existing event
  const handleEditClick = (event) => {
    setFormData({
      name: event.name,
      date: event.date,
      time: event.time,
      description: event.description,
      venue: event.venue || "",
      schedule: Array.isArray(event.schedule)
        ? event.schedule
        : [{ startTime: "", endTime: "", activity: "" }],
      status: event.status,
    });
    setEditingEventId(event._id);
    setIsEditMode(true);
    setShowForm(true);
  };

  // Handle generic form input changes (non-schedule)
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset form data to initial empty state
  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      time: "",
      description: "",
      venue: "",
      schedule: [{ startTime: "", endTime: "", activity: "" }],
      status: "Drafted",
    });
  };

  // Update schedule item fields
  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: newSchedule });
  };

  // Add a new empty schedule item
  const addScheduleItem = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { startTime: "", endTime: "", activity: "" }],
    });
  };

  // Remove a schedule item by index
  const removeScheduleItem = (index) => {
    if (formData.schedule.length === 1) return; // Prevent removing last item
    const updatedSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <AdminSidebar date={date} setDate={setDate} eventDates={[]} />
          <div className="w-full md:w-3/4 px-4 py-6">
            <div className="flex justify-between items-center mb-16">
              <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Event Management</h1>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setShowForm(true);
                  setIsEditMode(false);
                  resetForm();
                }}
              >
                Create New Event
              </Button>
            </div>

            <div className="flex justify-center items-center mb-6 px-8">
              <div className="flex items-center w-full max-w-md bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm">
                <FiSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search events"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full focus:outline-none"
                />
              </div>
            </div>

            <Dialog
              open={showForm}
              onClose={() => {
                setShowForm(false);
                setIsEditMode(false);
                resetForm();
              }}
              TransitionComponent={Transition}
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
                  <TextField
                    margin="dense"
                    label="Venue"
                    name="venue"
                    fullWidth
                    required
                    value={formData.venue}
                    onChange={handleInputChange}
                  />

                  {/* Schedule Section */}
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
                            <IconButton
                              aria-label="add"
                              onClick={addScheduleItem}
                            >
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

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8 px-8 mr-5">
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

            {/* Events Table */}
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 400, width: "90%", margin: "0 auto" }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>No</StyledTableCell>
                    <StyledTableCell>Event Name</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={5} align="center">
                        No events found.
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    filteredEvents.map((event, index) => (
                      <StyledTableRow key={event._id || index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{event.name}</StyledTableCell>
                        <StyledTableCell>{event.date}</StyledTableCell>
                        <StyledTableCell>
                          <span className={getStatusColor(event.status)}>{event.status}</span>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button
                            onClick={() => navigate(`/admin/ViewEvent/${event._id}`)}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded mr-2"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleEditClick(event)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventManagement;
