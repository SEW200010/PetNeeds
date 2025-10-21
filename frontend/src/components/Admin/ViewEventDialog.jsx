import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Chip,
  Stack,
  Link,
  Divider,
} from "@mui/material";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const safeTime = (t) => {
  if (!t) return "";
  try {
    // If ISO, show time part else return as-is
    if (t.includes("T")) return new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return t;
  } catch (e) {
    return t;
  }
};

const renderFacilitators = (fac, facMap) => {
  if (!fac) return null;
  if (Array.isArray(fac)) {
    // objects or ids
    return fac
      .map((f) => {
        if (!f) return "";
        const id = String(f._id || f.id || f);
        // prefer mapped name
        if (facMap && facMap[id]) return facMap[id];
        return (f.fullname || f.name || id).toString();
      })
      .filter(Boolean)
      .join(", ");
  }
  // single value
  return String(fac);
};

const renderModules = (mods) => {
  if (!mods) return null;
  if (!Array.isArray(mods)) return String(mods);
  // array of strings or objects
  return mods
    .map((m) => {
      if (!m) return "";
      if (typeof m === "string") return m;
      return m.moduleName ? `${m.moduleName}${m.enrollmentKey ? ` (key: ${m.enrollmentKey})` : ""}` : JSON.stringify(m);
    })
    .filter(Boolean)
    .join(", ");
};

const renderParticipants = (p) => {
  if (!p) return "N/A";
  if (Array.isArray(p)) return `${p.length} participants`;
  if (typeof p === "object") {
    if (p.registered_users) return `${p.registered_users.length} registered`;
    const reg = p.registered || p.registered_users?.length || 0;
    const conf = p.confirmed || 0;
    return `${reg} registered${conf ? `, ${conf} confirmed` : ""}`;
  }
  return String(p);
};

const ViewEventDialog = ({ open, onClose, event, university, faculty }) => {
  if (!event) return null;

  const title = event.title || event.name || "Event";

  const [facMap, setFacMap] = useState({});

  useEffect(() => {
    // Fetch facilitators for the university to map ids -> names
    const fetchFacilitators = async () => {
      try {
        const uni = event?.University || event?.university || university;
        if (!uni) return;
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/facilitators/${encodeURIComponent(uni)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        const list = data?.facilitators || data || [];
        const normalized = list.map((f) => ({
          id: String(f._id || f.id),
          fullname: f.fullname || f.name || "",
        }));
        const map = {};
        normalized.forEach((f) => {
          map[String(f.id)] = f.fullname;
        });
        setFacMap(map);
      } catch (err) {
        console.error("Error fetching facilitators for view dialog:", err);
      }
    };

    if (open) fetchFacilitators();
  }, [open, event, university]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2">Date</Typography>
            <Typography>{event.date || "N/A"}</Typography>
          </Box>

          {(event.start_time || event.end_time) && (
            <Box>
              <Typography variant="subtitle2">Time</Typography>
              <Typography>
                {safeTime(event.start_time) || "N/A"} {event.start_time || event.end_time ? "-" : ""} {safeTime(event.end_time) || ""}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2">Venue</Typography>
            <Typography>{event.location || event.venue || "N/A"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2">University / Faculty</Typography>
            <Typography>
              {(event.University || event.university || university || "") +
                (event.faculty || faculty ? ` / ${event.faculty || faculty}` : "") ||
                "N/A"}
            </Typography>
          </Box>

          {event.description && (
            <Box>
              <Typography variant="subtitle2">Description</Typography>
              <Typography>{event.description}</Typography>
            </Box>
          )}

          <Divider />

          <Box>
            <Typography variant="subtitle2">Facilitators</Typography>
            <Typography>{renderFacilitators(event.facilitator, facMap) || "None"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2">Modules</Typography>
            <Typography>{renderModules(event.modules) || "None"}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2">Participants</Typography>
            <Typography>{renderParticipants(event.participants)}</Typography>
          </Box>

          {event.numberOfSlots !== undefined && (
            <Box>
              <Typography variant="subtitle2">Slots</Typography>
              <Typography>{event.numberOfSlots}</Typography>
            </Box>
          )}

          {event.eventMedia && event.eventMedia.length > 0 && (
            <Box>
              <Typography variant="subtitle2">Media</Typography>
              <List>
                {event.eventMedia.map((m, i) => (
                  <ListItem key={i}>
                    {m.url ? (
                      <Link href={m.url} target="_blank" rel="noopener noreferrer">
                        {m.fileName || m.url}
                      </Link>
                    ) : (
                      <Typography>{m.fileName || JSON.stringify(m)}</Typography>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {event.status && (
            <Box>
              <Typography variant="subtitle2">Status</Typography>
              <Chip label={event.status} color={event.status.toLowerCase() === 'drafted' ? 'default' : 'primary'} />
            </Box>
          )}

        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewEventDialog;
