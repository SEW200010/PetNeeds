import React, { useEffect, useState , forwardRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import Header from "@/components/Admin/Header";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack"; // ✅ for horizontal button layout
import IconButton from "@mui/material/IconButton";
import { Edit, Delete, Visibility } from "@mui/icons-material"; // ✅ MUI icons
import {
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,

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

const CoordinatorUnitView = () => {
  const navigate = useNavigate();
  const { faculty_name, university_name, school_name, zone } = useParams();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unitType, setUnitType] = useState("");
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [schoolFormOpen, setSchoolFormOpen] = useState(false);
  const [universityFormOpen, setUniversityFormOpen] = useState(false);
//const [events, setEvents] = useState([]);
const [selectedEvent, setSelectedEvent] = useState(null);
const [editMode, setEditMode] = useState(false);
const [viewMode, setViewMode] = useState(false);



  // ✅ Define event table columns
  const eventColumns = [
    { field: "title", headerName: "Event Title", flex: 2 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "location", headerName: "Venue", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleViewEvent(event)}
          >
            <Visibility />
          </IconButton>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => handleEditEvent(event)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            size="small"
             onClick={() => handleDeleteEvent(event.id)}
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];


  const handleEditEvent = (event) => {
  setSelectedEvent(event);
  setEditMode(true);
};

const handleViewEvent = (event) => {
  setSelectedEvent(event);
  setViewMode(true);
};

const handleDeleteEvent = async (eventId) => {
  if (window.confirm("Are you sure you want to delete this event?")) {
    await fetch(`${API_BASE}/events/${eventId}`, { method: "DELETE" });
    setEvents(events.filter((e) => e.id !== eventId));
  }
};

  // ✅ Action Handlers
  const handleAdd = () => {
    navigate("/coordinator/add-event");
  };

  const handleView = (row) => {
    navigate(`/coordinator/event/${row.id}`); // customize route as needed
  };

  const handleEdit = (row) => {
    navigate(`/coordinator/edit-event/${row.id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents((prev) => prev.filter((event, index) => index !== id));
      // optional: also call DELETE API here
    }
  };
     const handleCreateClick = () => {
    setCategoryDialogOpen(true);
  };

    const handleCategorySelect = (category) => {
    setCategoryDialogOpen(false);
    if (category === "School") setSchoolFormOpen(true);
    if (category === "University") setUniversityFormOpen(true);
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const organizationUnit = localStorage.getItem("organization_unit");

    if (!token || !organizationUnit) {
      console.warn("Missing token or organization unit.");
      return;
    }

     const handleCreateClick = () => {
    setCategoryDialogOpen(true);
  };

    const type = organizationUnit.toLowerCase();
    setUnitType(type);

    
    const baseUrl = "http://localhost:5000";
    let eventsUrl = "";
    let usersUrl = "";

    if (type === "university") {
      eventsUrl = `${baseUrl}/faculty/${encodeURIComponent(
        university_name
      )}/${encodeURIComponent(faculty_name)}/events`;
      usersUrl = `${baseUrl}/faculty/${encodeURIComponent(
        university_name
      )}/${encodeURIComponent(faculty_name)}/users`;
    } else {
      eventsUrl = `${baseUrl}/school/${encodeURIComponent(
        zone
      )}/${encodeURIComponent(school_name)}/events`;
      usersUrl = `${baseUrl}/school/${encodeURIComponent(
        zone
      )}/${encodeURIComponent(school_name)}/users`;
    }

    Promise.all([
      fetch(eventsUrl, { headers: { Authorization: `Bearer ${token}` } }).then(
        (res) => res.json()
      ),
      fetch(usersUrl, { headers: { Authorization: `Bearer ${token}` } }).then(
        (res) => res.json()
      ),
    ])
      .then(([eventData, userData]) => {
        setEvents(eventData.events || []);
        setUsers(userData.users || []);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, [faculty_name, school_name, university_name, zone]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );

  const unitTitle =
    unitType === "university"
      ? `${faculty_name} (${university_name})`
      : `${school_name} (${zone})`;

  const eventRows = events.map((e, index) => ({
    id: index,
    title: e.title,
    date: e.date,
    location: e.location || "",
  }));

   const handleSubmitForm = (formData) => {
    console.log("Form Submitted:", formData);
    // TODO: call API to save event
  };

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />

          <div className="flex-1 p-6">
            {/* ✅ Top section with title + buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h4">Events — {unitTitle}</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                   onClick={handleCreateClick}
                              
                              sx={{
                                backgroundColor: "green",
                                "&:hover": { backgroundColor: "darkgreen" },
                                color: "white",
                              }}
                >
                  Add Event
                </Button >

          
                <Button variant="outlined" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </Box>
            </Box>

            {/* ✅ Events Table */}
            <Typography variant="h5" sx={{ mb: 2 }}>
              Events
            </Typography>

            {events.length > 0 ? (
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={eventRows}
                  columns={eventColumns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  disableSelectionOnClick
                />
              </div>
            ) : (
              <Typography color="text.secondary">
                No events found.
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Users Section */}
            <Typography variant="h5" sx={{ mb: 2 }}>
              Registered Users
            </Typography>

            {users.length > 0 ? (
              users.map((user, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography color="text.secondary">
                No registered users found.
              </Typography>
            )}

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
          {/* School Event Form */}
<CreateSchoolEvent
  open={schoolFormOpen}
  onClose={() => setSchoolFormOpen(false)}
  onSubmit={handleSubmitForm}
  zone={zone}
  school={school_name}
/>

{/* University Event Form */}
<CreateUniversityEvent
  open={universityFormOpen}
  onClose={() => setUniversityFormOpen(false)}
  onSubmit={handleSubmitForm}
  university={university_name}
  faculty={faculty_name}
/>

          </div>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorUnitView;
