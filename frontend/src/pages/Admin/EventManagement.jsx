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
  FormControl
} from "@mui/material";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor:`#00695c`,

    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const getStatusColor = (status) => {
  switch (status) {
    case "Upcoming": return "text-green-600";
    case "Ongoing": return "text-blue-600";
    case "Completed": return "text-gray-600";
    case "Drafted": return "text-yellow-600";
    default: return "text-black";
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

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    description: "",
    status: "Drafted"
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
    const query = searchQuery.toLowerCase();
    setFilteredEvents(
      events.filter((e) => e.name.toLowerCase().includes(query))
    );
  }, [searchQuery, events]);

  const handleAddOrUpdateEvent = (e) => {
    e.preventDefault();
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `http://localhost:5000/events/${editingEventId}`
      : "http://localhost:5000/events";

    const eventToSend = { ...formData };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventToSend),
    })
      .then((res) => res.json())
      .then(() => {
        fetchEvents();
        setShowForm(false);
        setIsEditMode(false);
        setEditingEventId(null);
        setFormData({ name: "", date: "", time: "", description: "", status: "Drafted" });
      })
      .catch((err) => console.error("Error saving event:", err));
  };

  const handleEditClick = (event) => {
    setFormData({
      name: event.name,
      date: event.date,
      time: event.time,
      description: event.description,
      status: event.status
    });
    setEditingEventId(event._id);
    setIsEditMode(true);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                  setFormData({ name: "", date: "", time: "", description: "", status: "Drafted" });
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
                setFormData({ name: "", date: "", time: "", description: "", status: "Drafted" });
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
                      setFormData({ name: "", date: "", time: "", description: "", status: "Drafted" });
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

            <TableContainer
              component={Paper}
              sx={{ maxHeight: 400, width: '90%', margin: '0 auto' }}

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
                      <StyledTableCell colSpan={5} align="center">No events found.</StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    filteredEvents.map((event, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell>{index + 1}</StyledTableCell>
                        <StyledTableCell>{event.name}</StyledTableCell>
                        <StyledTableCell>{event.date}</StyledTableCell>
                        <StyledTableCell>
                          <span className={getStatusColor(event.status)}>{event.status}</span>
                        </StyledTableCell>
                        <StyledTableCell>
                          <button className="bg-teal-600 hover:bg-teal-600 text-white px-3 py-1 rounded mr-2">
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