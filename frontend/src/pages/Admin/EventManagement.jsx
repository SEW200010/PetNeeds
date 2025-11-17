
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Admin/header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import CreateUniversityEvent from "../../components/Admin/CreateUniversityEvent";
import { Search, ArrowLeft, Plus } from "lucide-react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button as MUIButton,
  Chip,
  Typography,
  MenuItem,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date(2021, 2, 22));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editEventData, setEditEventData] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewEventData, setViewEventData] = useState(null);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/events");
      if (!response.ok) {
        console.error(`Failed to fetch events: ${response.status}`);
        setEvents([]);
        return;
      }
      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading events:", err);
      setEvents([]);
    }
  };

  const handleDeleteEvent = (eventId) => {
    setSelectedEventId(eventId);
    setShowDeleteDialog(true);

  };

  const handleViewEvent = (event) => {
    setViewEventData(event);
    setShowViewModal(true);
  };

  const handleEditEvent = (eventId) => {
    const event = events.find((e) => e._id === eventId || e.id === eventId);
    if (event) {
      setEditEventData(event);
      setShowEditForm(true);
    }
  };

  const confirmDeleteEvent = () => {
    const eventId = selectedEventId;
    fetch(`http://127.0.0.1:5000/events/${eventId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setEvents((prev) => prev.filter((e) => (e._id || e.id) !== eventId));
          console.log("Deleted event:", eventId);
        } else {
          console.error("Failed to delete event");
        }
        setShowDeleteDialog(false);
      })
      .catch((err) => {
        console.error("Error deleting event:", err);
        setShowDeleteDialog(false);
      });
  };

  const filteredEvents = (Array.isArray(events) ? events : []).filter((event) => {
    const q = (searchQuery || "").toLowerCase();
    const name = (event.name || "").toLowerCase();
    const venue = (event.venue || "").toLowerCase();
    const status = (event.status || "").toLowerCase();
    return name.includes(q) || venue.includes(q) || status.includes(q);
  });

  const statusColorMap = {
    Upcoming: { bg: "#E8F5E9", color: "#2E7D32", label: "Upcoming" },
    Ongoing: { bg: "#E3F2FD", color: "#1565C0", label: "Ongoing" },
    Completed: { bg: "#F5F5F5", color: "#616161", label: "Completed" },
    Drafted: { bg: "#FFF3E0", color: "#E65100", label: "Drafted" },
  };

  const columns = [
    { field: "name", headerName: "Event Name", flex: 2, minWidth: 200 },
    { field: "date", headerName: "Date", flex: 1, minWidth: 120 },
    { field: "time", headerName: "Time", flex: 1, minWidth: 100 },
    { field: "venue", headerName: "Venue", flex: 2, minWidth: 150 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => {
        const config =
          statusColorMap[params.value] ||
          statusColorMap["Drafted"];
        return (
          <Box
            sx={{
              display: "inline-block",
              backgroundColor: config.bg,
              color: config.color,
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {config.label}
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            color="info"
            size="small"
            onClick={() => handleViewEvent(params.row)}
            title="View"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditEvent(params.row._id || params.row.id)}
            title="Edit"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteEvent(params.row._id || params.row.id)}
            title="Delete"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />

      <div className="pt-16 flex">
        <AdminSidebar date={date} setDate={setDate} eventDates={[]} />

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <MUIButton variant="text" size="small">
                <ArrowLeft className="h-4 w-4" />
              </MUIButton>
              <h2 className="text-2xl font-semibold text-gray-900">
                Event Management
              </h2>
            </div>
            <MUIButton
              variant="contained"
              color="primary"
              onClick={() => setShowAddEventForm(true)}
              startIcon={<Plus size={20} />}
            >
              Add New Event
            </MUIButton>
          </div>

          <div className="mb-6 flex justify-center w-full">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <TextField
                placeholder="Search events"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
              />
            </div>
          </div>

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredEvents.map((event, i) => ({
                id: event._id || event.id || i,
                _id: event._id,
                ...event,
              }))}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
            />
          </div>
        </main>
      </div>

      {/* View Event Modal */}
      {showViewModal && viewEventData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Event Details
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Event Name
                </p>
                <p className="text-gray-700 mt-1 text-lg font-semibold">
                  {viewEventData.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </p>
                  <p className="text-gray-700 mt-1">{viewEventData.date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Time
                  </p>
                  <p className="text-gray-700 mt-1">{viewEventData.time}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Venue
                </p>
                <p className="text-gray-700 mt-1">{viewEventData.venue}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Status
                </p>
                <Box
                  sx={{
                    display: "inline-block",
                    backgroundColor:
                      statusColorMap[viewEventData.status]?.bg || "#F5F5F5",
                    color:
                      statusColorMap[viewEventData.status]?.color || "#616161",
                    padding: "4px 12px",
                    borderRadius: "16px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    marginTop: "4px",
                  }}
                >
                  {viewEventData.status}
                </Box>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  Description
                </p>
                <p className="text-gray-700 mt-1">
                  {viewEventData.description || "N/A"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <MUIButton variant="outlined" onClick={() => setShowViewModal(false)}>
                Close
              </MUIButton>
              <MUIButton
                variant="contained"
                color="primary"
                onClick={() => {
                  handleEditEvent(viewEventData._id || viewEventData.id);
                  setShowViewModal(false);
                }}
              >
                Edit
              </MUIButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg w-[400px]">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Are you sure you want to delete this event?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action will permanently remove the event from the system.
            </p>
            <div className="flex justify-end space-x-3">
              <MUIButton
                variant="outlined"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </MUIButton>
              <MUIButton
                variant="contained"
                color="error"
                onClick={confirmDeleteEvent}
              >
                Delete
              </MUIButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Form */}
      {showEditForm && editEventData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Edit Event
            </h2>
            <p className="text-sm text-gray-600 mb-6">Update event details.</p>

            <div className="space-y-4">
              <TextField
                label="Event Name"
                value={editEventData.name || ""}
                fullWidth
                size="small"
                onChange={(e) =>
                  setEditEventData({ ...editEventData, name: e.target.value })
                }
              />
              <TextField
                label="Date"
                type="date"
                value={editEventData.date || ""}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, date: e.target.value })
                }
              />
              <TextField
                label="Time"
                type="time"
                value={editEventData.time || ""}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, time: e.target.value })
                }
              />
              <TextField
                label="Venue"
                value={editEventData.venue || ""}
                fullWidth
                size="small"
                onChange={(e) =>
                  setEditEventData({ ...editEventData, venue: e.target.value })
                }
              />
              <TextField
                label="Description"
                value={editEventData.description || ""}
                fullWidth
                size="small"
                multiline
                rows={3}
                onChange={(e) =>
                  setEditEventData({
                    ...editEventData,
                    description: e.target.value,
                  })
                }
              />
              <TextField
                select
                label="Status"
                value={editEventData.status || "Drafted"}
                onChange={(e) =>
                  setEditEventData({ ...editEventData, status: e.target.value })
                }
                fullWidth
                size="small"
              >
                <MenuItem value="Drafted">Drafted</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </TextField>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <MUIButton
                variant="outlined"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </MUIButton>
              <MUIButton
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `http://127.0.0.1:5000/events/${
                        editEventData._id || editEventData.id
                      }`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(editEventData),
                      }
                    );

                    if (res.ok) {
                      setEvents((prevEvents) =>
                        prevEvents.map((event) =>
                          (event._id || event.id) ===
                          (editEventData._id || editEventData.id)
                            ? editEventData
                            : event
                        )
                      );
                      console.log("Updated event:", editEventData);
                      setShowEditForm(false);
                    } else {
                      console.error("Failed to update event");
                    }
                  } catch (error) {
                    console.error("Error updating event:", error);
                  }
                }}
              >
                Save
              </MUIButton>
            </div>
          </div>
        </div>
      )}

      {/* Add University Event Form */}
      <CreateUniversityEvent
        open={showAddEventForm}
        onClose={() => setShowAddEventForm(false)}
        onSubmit={() => {
          setShowAddEventForm(false);
          fetchEvents();
        }}
      />
    </div>
  );
};

export default EventManagement;
