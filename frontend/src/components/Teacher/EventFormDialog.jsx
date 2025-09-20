import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";

export default function EventForm({
  isEditMode = false,
  initialData = {},
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    event_id: "",
    name: "",
    date: "",
    time: "",
    description: "",
    venue: "",
    schedule: [{ startTime: "", endTime: "", activity: "" }],
    status: "Drafted",
    speakers: [],
    participants: { registered: "", confirmed: "" },
    numberOfSlots: "",
    eventMedia: [],
  });
  const [speakers, setSpeakers] = useState("");
  const [formError, setFormError] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        schedule: initialData.schedule || [{ startTime: "", endTime: "", activity: "" }],
        participants: initialData.participants || { registered: "", confirmed: "" },
      });
      setSpeakers((initialData.speakers || []).join(", "));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["registered", "confirmed"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        participants: { ...prev.participants, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData((prev) => ({ ...prev, schedule: updatedSchedule }));
  };

  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { startTime: "", endTime: "", activity: "" }],
    }));
  };

  const removeScheduleItem = (index) => {
    const updatedSchedule = [...formData.schedule];
    if (updatedSchedule.length > 1) {
      updatedSchedule.splice(index, 1);
      setFormData((prev) => ({ ...prev, schedule: updatedSchedule }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const speakersArray = speakers.split(",").map((s) => s.trim()).filter((s) => s);

    const jsonData = {
      event_id: formData.event_id || uuidv4(),
      ...formData,
      speakers: speakersArray,
      numberOfSlots: Number(formData.numberOfSlots) || 0,
      participants: {
        registered: Number(formData.participants.registered) || 0,
        confirmed: Number(formData.participants.confirmed) || 0,
      },
    };

    try {
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `http://localhost:5000/events/${formData.event_id}`
        : "http://localhost:5000/events";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save event");
      }

      onSuccess && onSuccess();
      alert("Event saved successfully!"); // optional feedback
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{isEditMode ? "Edit Event" : "Create New Event"}</h2>
        <Button size="small" onClick={() => setIsMinimized(!isMinimized)}>
          {isMinimized ? "Maximize" : "Minimize"}
        </Button>
      </div>

      {!isMinimized && (
        <form onSubmit={handleSubmit}>
          {formError && <div className="mb-4 text-red-600 font-semibold">{formError}</div>}

          <TextField label="Event Title" name="name" fullWidth required margin="dense" value={formData.name} onChange={handleInputChange} />
          <TextField label="Date" name="date" type="date" fullWidth required margin="dense" InputLabelProps={{ shrink: true }} value={formData.date} onChange={handleInputChange} />
          <TextField label="Time" name="time" type="time" fullWidth required margin="dense" InputLabelProps={{ shrink: true }} value={formData.time} onChange={handleInputChange} />
          <TextField label="Description" name="description" fullWidth required multiline rows={3} margin="dense" value={formData.description} onChange={handleInputChange} />
          <TextField label="Number of Slots" name="numberOfSlots" type="number" fullWidth margin="dense" value={formData.numberOfSlots} onChange={handleInputChange} />

          <div className="flex gap-4 my-4">
            <TextField label="Registered Participants" name="registered" type="number" fullWidth required margin="dense" value={formData.participants.registered} onChange={handleInputChange} />
            <TextField label="Confirmed Participants" name="confirmed" type="number" fullWidth required margin="dense" value={formData.participants.confirmed} onChange={handleInputChange} />
          </div>

          <TextField label="Venue" name="venue" fullWidth required margin="dense" value={formData.venue} onChange={handleInputChange} />
          <TextField label="Speakers (comma separated)" name="speakers" fullWidth margin="dense" value={speakers} onChange={(e) => setSpeakers(e.target.value)} />

          <div className="my-4">
            <label className="block font-semibold mb-2">Schedule</label>
            {formData.schedule.map((item, idx) => (
              <div key={idx} className="flex gap-3 mb-2">
                <TextField label="Start Time" type="time" required value={item.startTime} onChange={(e) => handleScheduleChange(idx, "startTime", e.target.value)} />
                <TextField label="End Time" type="time" required value={item.endTime} onChange={(e) => handleScheduleChange(idx, "endTime", e.target.value)} />
                <TextField label="Activity" required value={item.activity} onChange={(e) => handleScheduleChange(idx, "activity", e.target.value)} sx={{ flex: 1 }} />
                <IconButton onClick={() => removeScheduleItem(idx)}><Remove /></IconButton>
              </div>
            ))}
            <Button onClick={addScheduleItem} startIcon={<Add />}>Add Schedule Item</Button>
          </div>

          <FormControl fullWidth margin="dense" required>
            <InputLabel>Status</InputLabel>
            <Select label="Status" name="status" value={formData.status} onChange={handleInputChange}>
              <MenuItem value="Drafted">Drafted</MenuItem>
              <MenuItem value="Upcoming">Upcoming</MenuItem>
              <MenuItem value="Ongoing">Ongoing</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <div className="flex justify-end mt-4 gap-2">
            <Button variant="outlined" onClick={() => setFormData(initialData)}>Reset</Button>
            <Button type="submit" variant="contained" sx={{ backgroundColor: "#4B9E8B" }}>
              {isEditMode ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
