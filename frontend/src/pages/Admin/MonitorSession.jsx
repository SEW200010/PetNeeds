import React, { useEffect, useState } from "react";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";

import {
  Box,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
} from "@mui/material";

import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const API = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

// 🔹 Dummy data
const DUMMY_SESSIONS = [
  {
    _id: "1",
    title: "TOT Introduction Workshop",
    date: "2025-02-10",
    time: "09:00",
    coordinator: "Dr. P. Sutharsan",
    status: "Completed",
  },
  {
    _id: "2",
    title: "Communication Skills TOT",
    date: "2025-02-14",
    time: "10:30",
    coordinator: "Ms. Tharsini",
    status: "Upcoming",
  },
  {
    _id: "3",
    title: "Team Building TOT Session",
    date: "2025-02-20",
    time: "14:00",
    coordinator: "Mr. Rajeev",
    status: "Ongoing",
  },
  {
    _id: "4",
    title: "Conflict Management TOT",
    date: "2025-03-01",
    time: "11:00",
    coordinator: "Dr. Kavitha",
    status: "Upcoming",
  },
];

export default function TotSessions() {
  const [sessions, setSessions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    coordinator: "",
    status: "",
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${API}/api/tot-sessions`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      // If backend fails, use dummy data
      if (!response.ok) {
        console.warn("API not available. Using dummy data.");
        setSessions(DUMMY_SESSIONS);
        setFiltered(DUMMY_SESSIONS);
        return;
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setSessions(data);
        setFiltered(data);
      } else {
        console.warn("Empty API response. Using dummy data.");
        setSessions(DUMMY_SESSIONS);
        setFiltered(DUMMY_SESSIONS);
      }
    } catch (err) {
      console.error("API error:", err);
      setSessions(DUMMY_SESSIONS);
      setFiltered(DUMMY_SESSIONS);
    }
  };

  // Search filter
  useEffect(() => {
    const f = sessions.filter((x) =>
      x.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFiltered(f);
  }, [searchQuery, sessions]);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setEditingSession(null);
    setForm({
      title: "",
      date: "",
      time: "",
      coordinator: "",
      status: "",
    });
    setOpenForm(true);
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setForm(session);
    setOpenForm(true);
  };

  const handleSave = () => {
    if (editingSession) {
      // Update dummy
      const updated = sessions.map((s) =>
        s._id === editingSession._id ? form : s
      );
      setSessions(updated);
      setFiltered(updated);
    } else {
      // Add new dummy
      const newSession = { ...form, _id: Date.now().toString() };
      const updated = [...sessions, newSession];

      setSessions(updated);
      setFiltered(updated);
    }

    setOpenForm(false);
  };

  const handleDelete = () => {
    const updated = sessions.filter((s) => s._id !== deleteTarget._id);
    setSessions(updated);
    setFiltered(updated);
    setDeleteTarget(null);
  };

  const columns = [
    { field: "title", headerName: "Session Title", flex: 1 },
    { field: "date", headerName: "Date", width: 140 },
    { field: "time", headerName: "Time", width: 120 },
    { field: "coordinator", headerName: "Coordinator", flex: 1 },
    { field: "status", headerName: "Status", width: 140 },

    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon color="primary" />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Delete"
          onClick={() => setDeleteTarget(params.row)}
        />,
      ],
    },
  ];

  return (
    <div>
      <Header />

      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex">
          <AdminSidebar />

          <div className="w-full p-6">

            <Typography variant="h4" fontWeight="bold" mb={1}>
              TOT Sessions
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Manage all Training of Trainers (TOT) sessions.
            </Typography>

            {/* Search + Add */}
            <Box display="flex" justifyContent="space-between" mb={3}>
              <TextField
                placeholder="Search sessions..."
                variant="outlined"
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: "300px", background: "white" }}
              />

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                Add New Session
              </Button>
            </Box>

            {/* DataGrid */}
            <Paper sx={{ height: 500, width: "100%" }}>
              <DataGrid
                rows={filtered}
                columns={columns}
                getRowId={(row) => row._id}
                pageSize={10}
              />
            </Paper>
          </div>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingSession ? "Edit Session" : "Add New TOT Session"}
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>

            <Grid item xs={12}>
              <TextField fullWidth label="Session Title" name="title" value={form.title} onChange={handleChange} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Date" type="date" name="date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={6}>
              <TextField fullWidth label="Time" type="time" name="time" value={form.time} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Coordinator" name="coordinator" value={form.coordinator} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Status" name="status" value={form.status} onChange={handleChange} />
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete Session?</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete <strong>{deleteTarget?.title}</strong>?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
