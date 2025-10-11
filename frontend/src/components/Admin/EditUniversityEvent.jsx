import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Autocomplete,
  Typography
} from "@mui/material";

const EditUniversityEvent = ({ open, onClose, initialData, onUpdate ,university, faculty,}) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
    start_time: "",
    end_time: "",
    venue: "",
    status: "Drafted",
    facilitator: [],
    University: "",
    faculty: "",
    participants: { registered_users: [] },
    eventMedia: [],
    modules: []
  });

  const [facilitators, setFacilitators] = useState([]);
  const [formError, setFormError] = useState("");

  const moduleList = Array.from({ length: 16 }, (_, i) => `Module ${i + 1}`);

  // Populate form with initialData whenever the dialog opens or initialData changes
  useEffect(() => {
    if (initialData && open) {
      setFormData({
        name: initialData.title  || "",
        date: initialData.date || "",
        description: initialData.description || "",
        start_time:  initialData.start_time ?initialData.start_time.split("T")[1].slice(0,5) : "",
        end_time: initialData.end_time ? initialData.end_time.split("T")[1].slice(0,5) : "",
        venue: initialData.location || "",
        status: initialData.status || "Drafted",
        facilitator: initialData.facilitator || [],
        University: initialData.University || "",
        faculty: initialData.faculty || "",
        participants: initialData.participants || { registered_users: [] },
        eventMedia: initialData.eventMedia || [],
        modules: initialData.modules || []
      });
      setFormError("");
    }
  }, [initialData, open]);

  // Fetch facilitators
  useEffect(() => {
    fetch("http://localhost:5000/facilitators")
      .then(res => res.json())
      .then(data => setFacilitators(data))
      .catch(err => console.error("Error fetching facilitators:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "facilitator" || name === "eventMedia") {
      setFormData({ ...formData, [name]: value.split(",").map(v => v.trim()) });
    } else if (name === "participants") {
      setFormData({ ...formData, participants: { registered_users: value.split(",").map(v => v.trim()) } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleModuleCheck = (moduleName, checked) => {
    const updatedModules = [...formData.modules];
    if (checked) {
      updatedModules.push({ moduleName, enrollmentKey: "" });
    } else {
      const index = updatedModules.findIndex(m => m.moduleName === moduleName);
      if (index > -1) updatedModules.splice(index, 1);
    }
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleEnrollmentKeyChange = (moduleName, key) => {
    const updatedModules = formData.modules.map(m => m.moduleName === moduleName ? { ...m, enrollmentKey: key } : m);
    setFormData({ ...formData, modules: updatedModules });
  };

  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const dt = new Date(`${date}T${time}:00Z`);
    return dt.toISOString().replace('Z', '+00:00');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      facilitator: formData.facilitator.map(f => f._id),
      participants: { registered: formData.participants.registered_users.length || 0 },
      start_time: combineDateTime(formData.date, formData.start_time),
      end_time: combineDateTime(formData.date, formData.end_time),
    };

    try {
      const res = await fetch(`http://localhost:5000/events/university/${initialData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update event");
      }

      alert("University event updated successfully!");
      if (onUpdate) onUpdate(); // callback to refresh list
      onClose();
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit University Event</DialogTitle>
      <DialogContent dividers>
        <TextField label="Event Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Date" type="date" name="date" value={formData.date} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} margin="normal" />
        <TextField label="Start Time" type="time" name="start_time" value={formData.start_time} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="End Time" type="time" name="end_time" value={formData.end_time} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
        <TextField label="Venue" name="venue" value={formData.venue} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="University" name="University" value={formData.University} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Faculty" name="faculty" value={formData.faculty} onChange={handleChange} fullWidth margin="normal" />

        <Autocomplete
          multiple
          options={facilitators}
          getOptionLabel={(option) => option.fullname}
          value={formData.facilitator}
          onChange={(event, newValue) => setFormData({ ...formData, facilitator: newValue })}
          renderInput={(params) => <TextField {...params} label="Facilitators" />}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
          Select Modules & Add Enrollment Keys
        </Typography>

        <FormControl component="fieldset" fullWidth margin="normal">
          <FormGroup>
            {moduleList.map((module) => {
              const checked = formData.modules.some(m => m.moduleName === module);
              const enrollmentKey = formData.modules.find(m => m.moduleName === module)?.enrollmentKey || "";
              return (
                <div key={module} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <FormControlLabel
                    control={<Checkbox checked={checked} onChange={(e) => handleModuleCheck(module, e.target.checked)} />}
                    label={module}
                  />
                  {checked && <TextField label="Enrollment Key" value={enrollmentKey} onChange={(e) => handleEnrollmentKeyChange(module, e.target.value)} size="small" sx={{ ml: 2, flex: 1 }} />}
                </div>
              );
            })}
          </FormGroup>
        </FormControl>

        {formError && <p style={{ color: "red" }}>{formError}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">Update Event</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUniversityEvent;
