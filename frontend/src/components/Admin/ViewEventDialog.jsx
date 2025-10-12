import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const ViewEventDialog = ({ open, onClose, event }) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Date:</Typography>
          <Typography>{event.date || "N/A"}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Location:</Typography>
          <Typography>{event.location || "N/A"}</Typography>
        </Box>
        {event.description && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Description:</Typography>
            <Typography>{event.description}</Typography>
          </Box>
        )}
        {event.start_time && event.end_time && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Time:</Typography>
            <Typography>
              {event.start_time} - {event.end_time}
            </Typography>
          </Box>
        )}
        {event.facilitator && event.facilitator.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Facilitators:</Typography>
            <Typography>{event.facilitator.join(", ")}</Typography>
          </Box>
        )}
        {event.modules && event.modules.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Modules:</Typography>
            <Typography>{event.modules.join(", ")}</Typography>
          </Box>
        )}
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
