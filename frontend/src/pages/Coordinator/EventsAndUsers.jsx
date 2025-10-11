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
  const [error, setError] = useState(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [schoolFormOpen, setSchoolFormOpen] = useState(false);
  const [universityFormOpen, setUniversityFormOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [universityEditOpen, setUniversityEditOpen] = useState(false);
  const [schoolEditOpen, setSchoolEditOpen] = useState(false);

  const [usersCoordinator, setUsersCoordinator] = useState([]);
  const [usersFacilitator, setUsersFacilitator] = useState([]);
  const [usersStudent, setUsersStudent] = useState([]);


  // ✅ Users Columns for DataGrid
  const userColumns = [
    { field: "name", headerName: "Name", flex: 2 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "role", headerName: "Role", flex: 1 },
  ];

  // ✅ Users Rows
  const userRows = users.map((u, index) => ({
    id: u.id || index,
    name: u.name,
    email: u.email,
    role: u.role || "N/A",
  }));

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
    document.activeElement?.blur();
    setCategoryDialogOpen(true);
  };

  const handleCategorySelect = (category) => {
    setCategoryDialogOpen(false);
    setSelectedEvent(null);
    setEditMode(false);
    if (category === "School") setSchoolFormOpen(true);
    if (category === "University") setUniversityFormOpen(true);
  };

  // ✅ Edit Event
  const handleEditEvent = (row) => {
    const event = events.find((e) => e.id === row.id);
    setSelectedEvent(event);

    if (unitType === "university") {
      setUniversityFormOpen(false);
      setSchoolFormOpen(false);
      setEditMode(true);
      setUniversityEditOpen(true);
    } else {
      setSchoolFormOpen(false);
      setUniversityFormOpen(false);
      setEditMode(true);
      setSchoolEditOpen(true);
    }
  };

  // ✅ View Event
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setViewMode(true);
  };

  // ✅ Delete Event (safe)
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_BASE}/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) {
        console.warn(`Failed to delete event: ${res.status}`);
        return;
      }
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error("Network error while deleting event:", err);
    }
  };

  const handleSubmitForm = (formData) => {
    setEvents((prev) => [...prev, { id: prev.length + 1, ...formData }]);
    setSchoolFormOpen(false);
    setUniversityFormOpen(false);
  };

  // ✅ Safe Fetch helper
  const safeFetch = async (url, token) => {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.warn(`⚠️ Fetch failed for ${url}: ${res.status} ${res.statusText}`);
        return null;
      }
      const data = await res.json().catch(() => {
        console.warn(`⚠️ Failed to parse JSON from ${url}`);
        return null;
      });
      return data;
    } catch (err) {
      console.error(`❌ Network error fetching ${url}:`, err);
      return null;
    }
  };

  // ✅ Fetch events + users safely
  useEffect(() => {
    const token = localStorage.getItem("token");
    const organizationUnit = localStorage.getItem("organization_unit");

    if (!token || !organizationUnit) {
      setError("Missing authentication token or organization unit.");
      setLoading(false);
      return;
    }

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

    const fetchData = async () => {
      setLoading(true);
      const [eventData, userData] = await Promise.all([
        safeFetch(eventsUrl, token),
        safeFetch(usersUrl, token),
      ]);

      setEvents(eventData?.events || []);
      // Split users by role
      const allUsers = userData?.users || [];
      setUsersCoordinator(allUsers.filter(u => u.role === "coordinator"));
      setUsersFacilitator(allUsers.filter(u => u.role === "facilitator"));
      setUsersStudent(allUsers.filter(u => u.role === "student"));

      setUsers(userData?.users || []);

      setLoading(false);
    };

    fetchData();
  }, [faculty_name, school_name, university_name, zone]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography color="error">{error}</Typography>
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

  const renderUserTable = (usersArray, roleName) => (
    <>
      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        {roleName}
      </Typography>
      {usersArray.length > 0 ? (
        <div style={{ height: 300, width: "100%" }}>
          <DataGrid
            rows={usersArray.map((u, i) => ({
              id: u.id || i,
              name: u.name,
              email: u.email,
              role: u.role,
            }))}
            columns={userColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
          />
        </div>
      ) : (
        <Typography color="text.secondary">No {roleName.toLowerCase()} found.</Typography>
      )}
    </>
  );

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

            {/* Users Tables */}
            {renderUserTable(usersCoordinator, "Coordinators")}
            {renderUserTable(usersFacilitator, "Facilitators")}
            {renderUserTable(usersStudent, "Students")}
            {/* ✅ Category Selection Dialog */}
            <Dialog
              open={categoryDialogOpen}
              onClose={() => setCategoryDialogOpen(false)}
              TransitionComponent={Transition}
              fullWidth
              maxWidth="sm"
              PaperProps={{
                sx: { width: "500px", maxWidth: "80%", padding: 2 },
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
                <Button
                  onClick={() => setCategoryDialogOpen(false)}
                  color="error"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>

            {/* ✅ Create / Edit Dialogs */}
            <CreateSchoolEvent
              open={schoolFormOpen}
              onClose={() => {
                setSchoolFormOpen(false);
                setEditMode(false);
              }}
              onSubmit={handleSubmitForm}
              zone={zone}
              school={school_name}
              initialData={selectedEvent}
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
              initialData={selectedEvent}
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
                const res = await fetch(
                  `${API_BASE}/faculty/${encodeURIComponent(
                    university_name
                  )}/${encodeURIComponent(faculty_name)}/events`
                );
                const data = await res.json();
                setEvents(data.events || []);
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorUnitView;
