import React, { useEffect, useState, forwardRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import CoordinatorHeader from "@/components/Coordinator/CoordinatorHeader";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import {
  Slide,
} from "@mui/material";

import CreateUniversityEvent from "../../components/Admin/CreateUniversityEvent";
import EditUniversityEvent from "../../components/Admin/EditUniversityEvent";
import UserForm from "../../components/Admin/UserForm";
import ViewUserDialog from "../../components/Admin/ViewUserDialog";
import ViewEventDialog from "../../components/Admin/ViewEventDialog";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


const CoordinatorUnitView = () => {
  const navigate = useNavigate();
  const { faculty_name, university_name, school_name, zone } = useParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unitType, setUnitType] = useState("");
  const [error, setError] = useState(null);

  const [universityFormOpen, setUniversityFormOpen] = useState(false);
  const [universityEditOpen, setUniversityEditOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [userFormOpen, setUserFormOpen] = useState(false);

  const [usersCoordinator, setUsersCoordinator] = useState([]);
  const [usersFacilitator, setUsersFacilitator] = useState([]);
  const [usersStudent, setUsersStudent] = useState([]);

  const [deletedEvent, setDeletedEvent] = useState(null);
  const [viewEventOpen, setViewEventOpen] = useState(false);

  const userColumns = [
    { field: "name", headerName: "Name", flex: 2 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" size="small" onClick={() => handleViewUser(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton color="secondary" size="small" onClick={() => handleEditUser(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDeleteUser(params.row.id)}>
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

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
          <IconButton color="primary" size="small" onClick={() => handleViewEvent(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton color="secondary" size="small" onClick={() => handleEditEvent(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDeleteEvent(params.row.id)}>
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const handleDeleteEvent = async (eventId) => {
    const eventToDelete = events.find((e) => e.id === eventId);
    if (!eventToDelete) return;

    if (!window.confirm(`Are you sure you want to delete the event: ${eventToDelete.title}?`)) return;

    try {
      const res = await fetch(`${API_BASE}/events/${eventId}`, { method: "DELETE" });
      if (res.ok) {
        // Remove from state
        setEvents((prev) => prev.filter((e) => e.id !== eventId));

        // Store deleted event for later use
        setDeletedEvent(eventToDelete);

        // Optional: callback
        console.log("Deleted event:", eventToDelete);
      }
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleEditEvent = (row) => {
    setSelectedEvent(row);
    if (unitType === "university") setUniversityEditOpen(true);
  };

  // Update handleViewEvent
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setViewEventOpen(true);
  };


  const handleSubmitForm = (formData) => {
    setEvents((prev) => [...prev, { id: prev.length + 1, ...formData }]);
    setSchoolFormOpen(false);
    setUniversityFormOpen(false);
  };

  const safeFetch = async (url, token) => {
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("Network error fetching:", url, err);
      return null;
    }
  };

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
      eventsUrl = `${baseUrl}/faculty/${encodeURIComponent(university_name)}/${encodeURIComponent(
        faculty_name
      )}/events`;
      usersUrl = `${baseUrl}/faculty/${encodeURIComponent(university_name)}/${encodeURIComponent(
        faculty_name
      )}/users`;
    } else {
      eventsUrl = `${baseUrl}/school/${encodeURIComponent(zone)}/${encodeURIComponent(
        school_name
      )}/events`;
      usersUrl = `${baseUrl}/school/${encodeURIComponent(zone)}/${encodeURIComponent(
        school_name
      )}/users`;
    }

    const fetchData = async () => {
      setLoading(true);
      const [eventData, userData] = await Promise.all([
        safeFetch(eventsUrl, token),
        safeFetch(usersUrl, token),
      ]);
      setEvents(eventData?.events || []);
      const allUsers = userData?.users || [];
      setUsersCoordinator(allUsers.filter((u) => u.role === "coordinator"));
      setUsersFacilitator(allUsers.filter((u) => u.role === "facilitator"));
      setUsersStudent(allUsers.filter((u) => u.role === "student"));
      setLoading(false);
    };

    fetchData();
  }, [faculty_name, school_name, university_name, zone]);

  // handleViewUser replaced by dialog-based implementation below
  const handleEditUser = (user) => {
    const openEditor = async () => {
      const token = localStorage.getItem("token");
      const userId = user._id || user.id || user._id_str || null;
      if (!userId) {
        setSelectedUser(user);
        setSelectedUserRole(user.role);
        setUserFormOpen(true);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/users/${userId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (res.ok) {
          const data = await res.json();
          // assume response body is the user object
          setSelectedUser(data);
          setSelectedUserRole(data.role || user.role);
        } else {
          // fallback to row data
          setSelectedUser(user);
          setSelectedUserRole(user.role);
        }
      } catch (err) {
        console.error("Failed to fetch user details:", err);
        setSelectedUser(user);
        setSelectedUserRole(user.role);
      }

      setUserFormOpen(true);
    };

    openEditor();
  };

  const [viewUserOpen, setViewUserOpen] = useState(false);
  const [viewUserId, setViewUserId] = useState(null);

  const handleViewUser = (user) => {
    // user may be minimal row; prefer _id or id
    setViewUserId(user._id || user.id || user._id_str || null);
    setViewUserOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/users/${userId}`, { method: "DELETE", headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (res.ok) {
        setUsersCoordinator((p) => p.filter((u) => String(u.id || u._id) !== String(userId)));
        setUsersFacilitator((p) => p.filter((u) => String(u.id || u._id) !== String(userId)));
        setUsersStudent((p) => p.filter((u) => String(u.id || u._id) !== String(userId)));
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleAddUser = (role) => {
    setSelectedUserRole(role);
    setSelectedUser(null);
    setUserFormOpen(true);
  };

  const handleUserFormSubmit = () => {
    // Refresh users after add/edit
    const token = localStorage.getItem("token");
    const baseUrl = API_BASE;
    const type = unitType;
    let usersUrl = "";

    if (type === "university") {
      usersUrl = `${baseUrl}/faculty/${encodeURIComponent(university_name)}/${encodeURIComponent(
        faculty_name
      )}/users`;
    } else {
      usersUrl = `${baseUrl}/school/${encodeURIComponent(zone)}/${encodeURIComponent(school_name)}/users`;
    }

    fetch(usersUrl, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => r.json())
      .then((data) => {
        const allUsers = data?.users || [];
        setUsersCoordinator(allUsers.filter((u) => u.role === "coordinator"));
        setUsersFacilitator(allUsers.filter((u) => u.role === "facilitator"));
        setUsersStudent(allUsers.filter((u) => u.role === "student"));
      })
      .catch((err) => console.error("Error refreshing users:", err))
      .finally(() => setUserFormOpen(false));
  };

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
    // Include the full event object in the row so the edit dialog receives all fields
    id: e.id || e._id || index,
    ...e,
  }));

  const renderUserSection = (users, roleName, color) => (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h5">{roleName}</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: color,
            "&:hover": { backgroundColor: "dark" + color },
          }}
          onClick={() => handleAddUser(roleName.toLowerCase())}
        >
          Add {roleName}
        </Button>
      </Box>
      {users.length > 0 ? (
        <div style={{ height: 300, width: "100%" }}>
          <DataGrid
            rows={users.map((u, i) => ({
              id: u.id || u._id || i,
              _id: u._id || u.id || null,
              name: u.name || u.fullname || u.fullName,
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
    </Box>
  );

  return (
    <div>
  <CoordinatorHeader title={unitType === 'university' ? `${faculty_name} (${university_name})` : `${school_name} (${zone})`} />
      <main className="pt-[65px] min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />

          <div className="flex-1 p-6">
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h4">{unitTitle}</Typography>
              
            </Box>

            {/* Events */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h5">Events</Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "green",
                  "&:hover": { backgroundColor: "darkgreen" },
                }}
                onClick={() => setUniversityFormOpen(true)}  // directly open dialog
              >
                Add Event
              </Button>
            </Box>

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

            {/* Three separate user sections */}
            {renderUserSection(usersCoordinator, "Coordinator", "teal")}
            {renderUserSection(usersFacilitator, "Facilitator", "blue")}
            {renderUserSection(usersStudent, "Student", "purple")}

            <ViewEventDialog
              open={viewEventOpen}
              onClose={() => setViewEventOpen(false)}
              event={selectedEvent}
              university={university_name}
              faculty={faculty_name}
            />

            <UserForm
              open={userFormOpen}
              onClose={() => setUserFormOpen(false)}
              onSubmit={handleUserFormSubmit}
              initialData={selectedUser}
              role={selectedUserRole}
              university={university_name}
              faculty={faculty_name}
            />

            <ViewUserDialog open={viewUserOpen} onClose={() => setViewUserOpen(false)} userId={viewUserId} />

            <CreateUniversityEvent
              open={universityFormOpen}
              onClose={() => setUniversityFormOpen(false)}
              onSubmit={handleSubmitForm}
              university={university_name}
              faculty={faculty_name}
              initialData={selectedEvent}
            />
            <EditUniversityEvent
              open={universityEditOpen}
              onClose={() => setUniversityEditOpen(false)}
              initialData={selectedEvent}
              onUpdate={() => { }}
              university={university_name}   // ✅ add this
              faculty={faculty_name}         // ✅ add this
            />

          </div>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorUnitView;
