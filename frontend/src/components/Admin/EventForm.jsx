import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const EventForm = ({
  open,
  onClose,
  isEditMode,
  isMinimized,
  setIsMinimized,
  formData,
  speakers,
  handleInputChange,
  handleSubmit,
  setSpeakers,
  handleScheduleChange,
  addScheduleItem,
  removeScheduleItem,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Edit Event" : "Create New Event"}
        <Button
          size="small"
          onClick={() => setIsMinimized(!isMinimized)}
          sx={{ float: "right", minWidth: "auto", padding: "4px 8px" }}
        >
          {isMinimized ? "Maximize" : "Minimize"}
        </Button>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        {!isMinimized && (
          <DialogContent dividers>
            <TextField
              margin="dense"
              label="Event Title"
              name="name"
              fullWidth
              required
              value={formData.name}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              type="date"
              label="Date"
              name="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              type="time"
              label="Time"
              name="time"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.time}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
            />

            <div className="flex gap-4 my-4">
              <TextField
                label="Registered Participants"
                name="registered"
                type="number"
                fullWidth
                required
                value={formData.participants.registered}
                onChange={(e) =>
                  handleInputChange({
                    target: { name: "registered", value: e.target.value },
                  })
                }
              />
              <TextField
                label="Confirmed Participants"
                name="confirmed"
                type="number"
                fullWidth
                required
                value={formData.participants.confirmed}
                onChange={(e) =>
                  handleInputChange({
                    target: { name: "confirmed", value: e.target.value },
                  })
                }
              />
            </div>

            <TextField
              margin="dense"
              label="Venue"
              name="venue"
              fullWidth
              required
              value={formData.venue}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              label="Speakers (comma separated)"
              name="speakers"
              fullWidth
              value={speakers}
              onChange={(e) => setSpeakers(e.target.value)}
            />

            {/* Schedule */}
            <div className="my-4">
              <label className="block font-semibold mb-2">Schedule</label>
              {formData.schedule.map((item, idx) => (
                <div key={idx} className="flex gap-3 mb-2">
                  <TextField
                    label="Start Time"
                    type="time"
                    required
                    value={item.startTime}
                    onChange={(e) => handleScheduleChange(idx, "startTime", e.target.value)}
                  />
                  <TextField
                    label="End Time"
                    type="time"
                    required
                    value={item.endTime}
                    onChange={(e) => handleScheduleChange(idx, "endTime", e.target.value)}
                  />
                  <TextField
                    label="Activity"
                    required
                    value={item.activity}
                    onChange={(e) => handleScheduleChange(idx, "activity", e.target.value)}
                    sx={{ flex: 1 }}
                  />
                  <IconButton onClick={() => removeScheduleItem(idx)}>
                    <Remove />
                  </IconButton>
                </div>
              ))}
              <Button onClick={addScheduleItem} startIcon={<Add />}>
                Add Schedule Item
              </Button>
            </div>

            <FormControl fullWidth margin="dense" required>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <MenuItem value="Drafted">Drafted</MenuItem>
                <MenuItem value="Upcoming">Upcoming</MenuItem>
                <MenuItem value="Ongoing">Ongoing</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
        )}

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#4B9E8B" }}>
            {isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm;
