import React, { useEffect, useState } from "react";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import Header from "@/components/coordinator/CoordinatorHeader";

import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CoordinatorReports() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const token = localStorage.getItem("token");
  const university = localStorage.getItem("university_name") || "";

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    if (!university) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/coordinator/reports/${encodeURIComponent(university)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage(err.error || "Failed to load reports");
        setMessageType("error");
        setReports([]);
      } else {
        const data = await res.json();
        setReports(data.items || []);
      }
    } catch (e) {
      setMessage("Network error fetching reports");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setMessage("Please choose a file to upload");
      setMessageType("error");
      return;
    }
    setLoading(true);
    const form = new FormData();
    form.append("title", title);
    form.append("summary", summary);
    if (month) form.append("month", month);
    if (year) form.append("year", year);
    form.append("file", file);
    if (university) form.append("university_name", university);

    try {
      const res = await fetch(`${API}/coordinator/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Upload failed");
        setMessageType("error");
      } else {
        setMessage("Uploaded successfully");
        setMessageType("success");
        setTitle("");
        setSummary("");
        setMonth("");
        setYear("");
        setFile(null);
        fetchReports();
      }
    } catch (err) {
      setMessage("Network error uploading report");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this report?")) return;
    try {
      const res = await fetch(`${API}/coordinator/reports/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage("Deleted");
        setMessageType("success");
        fetchReports();
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || "Failed to delete");
        setMessageType("error");
      }
    } catch (e) {
      setMessage("Network error deleting report");
      setMessageType("error");
    }
  }

  return (
    <Box>
      <Header />
      <Box component="main" sx={{ pt: 8, minHeight: "100vh" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
          <CoordinatorSidebar />
          <Container maxWidth="md" sx={{ py: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Coordinator Reports
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={3}>
              This portal allows you to add monthly summaries.
            </Typography>

            <Box component="form" onSubmit={handleUpload} noValidate mb={4}>
              <Stack spacing={3}>
                <TextField
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="Summary"
                  variant="outlined"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Month"
                    variant="outlined"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Year"
                    variant="outlined"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    fullWidth
                  />
                </Stack>
                <Button variant="outlined" component="label" sx={{ alignSelf: "start" }}>
                  {file ? file.name : "Select File"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files && e.target.files[0])}
                  />
                </Button>

                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    {loading ? "Uploading..." : "Upload Report"}
                  </Button>
                </Box>
              </Stack>
            </Box>

            {message && (
              <Alert severity={messageType} sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}

            <Typography variant="h5" gutterBottom>
              Uploaded Reports
            </Typography>

            {loading && reports.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CircularProgress />
              </Box>
            ) : reports.length === 0 ? (
              <Typography color="text.secondary">No reports uploaded yet.</Typography>
            ) : (
              <Stack spacing={2}>
                {reports.map((r) => (
                  <Paper
                    key={r.id}
                    variant="outlined"
                    sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "start" }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {r.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                        {r.summary}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" mt={1} display="block">
                        Uploaded: {r.uploaded_at ? new Date(r.uploaded_at).toLocaleString() : "-"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        File:{" "}
                        <a
                          href={`${API}/coordinator/reports/files/${encodeURIComponent(r.filename)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#1976d2", textDecoration: "underline" }}
                        >
                          {r.original_filename || r.filename}
                        </a>
                      </Typography>
                    </Box>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => handleDelete(r.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
