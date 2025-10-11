import React, { useEffect, useState, forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import {
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Slide,
} from "@mui/material";

import CreateUniversityEvent from "../../components/Admin/CreateUniversityEvent";
import CreateSchoolEvent from "../../components/Admin/CreateSchoolEvent";
import EditUniversityEvent from "../../components/Admin/EditUniversityEvent";


const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const API_BASE = "http://localhost:5000";

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

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
const [universityEditOpen, setUniversityEditOpen] = useState(false);
const [schoolEditOpen, setSchoolEditOpen] = useState(false);


  // ✅ Event columns
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
            onClick={() => handleViewEvent(params.row)}
          >
            <Visibility />
          </IconButton>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => handleEditEvent(params.row)}
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteEvent(params.row.id)}
          >
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // ✅ Handle Add Event
  const handleCreateClick = () => {
    document.activeElement?.blur(); // prevent ARIA warning
    setCategoryDialogOpen(true);
  };

  const handleCategorySelect = (category) => {
    setCategoryDialogOpen(false);
    setSelectedEvent(null); // reset event data
    setEditMode(false);
    if (category === "School") setSchoolFormOpen(true);
    if (category === "University") setUniversityFormOpen(true);
  };

 const handleEditEvent = (row) => {
  const event = events.find((e) => e.id === row.id);
  setSelectedEvent(event);

  // Open correct form based on unit type
  if (unitType === "university") {
    setUniversityFormOpen(false); // close create dialog if open
    setSchoolFormOpen(false);
    setEditMode(true);
    setUniversityEditOpen(true); // new state for edit dialog
  } else {
    setSchoolFormOpen(false);
    setUniversityFormOpen(false);
    setEditMode(true);
    setSchoolEditOpen(true); // new state for school edit dialog
  }
};



  // ✅ View Event
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setViewMode(true);
  };

  // ✅ Delete Event
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await fetch(`${API_BASE}/events/${eventId}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    }
  };

 const handleSubmitForm = (formData) => {
  // Only for creating new events
  setEvents((prev) => [...prev, { id: prev.length + 1, ...formData }]);
  setSchoolFormOpen(false);
  setUniversityFormOpen(false);
};

  // ✅ Fetch events and users
  useEffect(() => {
    const token = localStorage.getItem("token");
    const organizationUnit = localStorage.getItem("organization_unit");

    if (!token || !organizationUnit) return;

    const type = organizationUnit.toLowerCase();
    setUnitType(type);

    const baseUrl = API_BASE;
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
    id: e.id || index,
    title: e.title,
    date: e.date,
    location: e.location || "",
  }));

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />

          <div className="flex-1 p-6">
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
                </Button>
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
              <Typography color="text.secondary">No events found.</Typography>
            )}

            <Divider sx={{ my: 3 }} />

            {/* ✅ Users Section */}
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

            {/* ✅ Category Selection Dialog */}
            <Dialog
              open={categoryDialogOpen}
              onClose={() => setCategoryDialogOpen(false)}
              TransitionComponent={Transition}
              fullWidth
              maxWidth="sm"
              PaperProps={{
                sx: {
                  width: "500px",
                  maxWidth: "80%",
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

            <CreateSchoolEvent
  open={schoolFormOpen}
  onClose={() => {
    setSchoolFormOpen(false);
    setEditMode(false);
  }}
  onSubmit={handleSubmitForm}
  zone={zone}
  school={school_name}
  initialData={selectedEvent} // now contains full event object
/>

<CreateUniversityEvent
  open={universityFormOpen}
  onClose={() => {
    setUniversityFormOpen(false);
    setEditMode(false);
  }}
  onSubmit={handleSubmitForm}
  university={university_name}
  faculty={faculty_name}
  initialData={selectedEvent} // full object
/>

<EditUniversityEvent
  open={universityEditOpen}
  onClose={() => {
    setUniversityEditOpen(false);
    setEditMode(false);
    setSelectedEvent(null);
  }}
  initialData={selectedEvent}
  onUpdate={async () => {
    // Refresh events after update
    const res = await fetch(`${API_BASE}/faculty/${encodeURIComponent(university_name)}/${encodeURIComponent(faculty_name)}/events`);
    const data = await res.json();
    setEvents(data.events || []);
  }}
/>

            <CreateUniversityEvent
  open={universityFormOpen}
  onClose={() => {
    setUniversityFormOpen(false);
    setEditMode(false);
  }}
  onSubmit={handleSubmitForm}
  university={university_name}
  faculty={faculty_name}
  initialData={selectedEvent} // full object
/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorUnitView;
