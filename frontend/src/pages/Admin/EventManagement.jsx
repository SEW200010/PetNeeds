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
  Select,
  MenuItem,
  Slide,
  TextField,
  InputAdornment,
} from "@mui/material";
import CreateUniversityEvent from "../../components/Admin/CreateUniversityEvent";
import CreateSchoolEvent from "../../components/Admin/CreateSchoolEvent";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EventManagement = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [schoolFormOpen, setSchoolFormOpen] = useState(false);
  const [universityFormOpen, setUniversityFormOpen] = useState(false);

  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(""); // "University" or "School"
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({}); // holds form fields dynamically
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

    const handleOpenCreate = () => {
    setShowCategoryDialog(true);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryDialog(false);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({});
    setFormError("");
  };

  const handleCreateEvent = async () => {
    try {
      const response = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category: selectedCategory, // Send category to backend
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create event");

      alert("Event created successfully: ID " + data.event_id);
      resetForm();
      setShowForm(false);
      setSelectedCategory("");
    } catch (err) {
      setFormError(err.message);
    }
  };
  
  useEffect(() => {
    fetch("http://localhost:5000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const handleCreateClick = () => {
    setCategoryDialogOpen(true);
  };

  const handleCategorySelect = (category) => {
    setCategoryDialogOpen(false);
    if (category === "School") setSchoolFormOpen(true);
    if (category === "University") setUniversityFormOpen(true);
  };

  const handleSubmitForm = (formData) => {
    console.log("Form Submitted:", formData);
    // TODO: call API to save event
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 flex">
        <AdminSidebar date={date} setDate={setDate} eventDates={[]} />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
            <Button
              onClick={handleCreateClick}
              
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

          {/* Event Table */}
          <div className="bg-white p-6 rounded-xl shadow">
            <StickyHeadTable
              columns={[
                { id: "event_id", label: "Event ID" },
                { id: "name", label: "Event Name" },
                { id: "date", label: "Date" },
                { id: "status", label: "Status" },
              ]}
              rows={events.map((event, index) => ({
                ...event,
                event_id: index + 1,
              }))}
            />
          </div>

          {/* Category Dialog */}
          <Dialog
  open={categoryDialogOpen}
  onClose={() => setCategoryDialogOpen(false)}
  TransitionComponent={Transition}
  fullWidth
  maxWidth="sm" // can be 'xs', 'sm', 'md', 'lg', 'xl' for predefined widths
  PaperProps={{
    sx: {
      width: "500px",  // custom width
      maxWidth: "80%", // make it responsive
      padding: 2,
    },
  }}
>
  <DialogTitle>Select Event Category</DialogTitle>
  <DialogContent>
    <FormControl fullWidth>
      <Select
        defaultValue=""
        onChange={(e) => handleCategorySelect(e.target.value)}
      >
        <MenuItem value="School">School</MenuItem>
        <MenuItem value="University">University</MenuItem>
      </Select>
    </FormControl>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setCategoryDialogOpen(false)} color="error">
      Cancel
    </Button>
  </DialogActions>
</Dialog>


          {/* School Event Form */}
          <CreateSchoolEvent
            open={schoolFormOpen}
            onClose={() => setSchoolFormOpen(false)}
            onSubmit={handleSubmitForm}
          />

          {/* University Event Form */}
          <CreateUniversityEvent
            open={universityFormOpen}
            onClose={() => setUniversityFormOpen(false)}
            onSubmit={handleSubmitForm}
          />
        </main>
      </div>
    </div>
  );
};

export default EventManagement;
