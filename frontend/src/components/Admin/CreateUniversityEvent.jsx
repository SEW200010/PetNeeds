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
  Typography,
} from "@mui/material";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const CreateUniversityEvent = ({ open, onClose, onSubmit, university, faculty }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
    start_time: "",
    end_time: "",
    venue: "",
    status: "Drafted",
    facilitator: [],
    University: university || "",
    faculty: faculty || "",
    participants: { registered_users: [] },
    eventMedia: [],
    modules: [],
  });

  const [facilitators, setFacilitators] = useState([]);
  const [formError, setFormError] = useState({});
  const moduleList = Array.from({ length: 16 }, (_, i) => `Module ${i + 1}`);

  // Load university & faculty dynamically
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      University: university || "",
      faculty: faculty || "",
    }));
  }, [university, faculty]);

  // Fetch facilitators
  useEffect(() => {
    if (!university) return;
    const token = localStorage.getItem("token");

    fetch(`${API}/facilitators/${encodeURIComponent(university)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        const list = data?.facilitators || data || [];
        const normalized = list.map((f) => ({
          _id: f._id || f.id || String(f._id || f.id),
          fullname: f.fullname || f.name || "",
          email: f.email || f.email,
        }));
        setFacilitators(normalized);
      })
      .catch((err) => console.error("Error fetching facilitators:", err));
  }, [university]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormError({ ...formError, [name]: "" }); // clear field error when typing
  };

  // Handle module checkbox
  const handleModuleCheck = (moduleName, checked) => {
    const updatedModules = [...formData.modules];
    if (checked) {
      updatedModules.push({ moduleName, enrollmentKey: "" });
    } else {
      const index = updatedModules.findIndex((m) => m.moduleName === moduleName);
      if (index > -1) updatedModules.splice(index, 1);
    }
    setFormData({ ...formData, modules: updatedModules });
  };

  const handleEnrollmentKeyChange = (moduleName, key) => {
    const updatedModules = formData.modules.map((m) =>
      m.moduleName === moduleName ? { ...m, enrollmentKey: key } : m
    );
    setFormData({ ...formData, modules: updatedModules });
  };

  // Combine date + time
  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const dt = new Date(`${date}T${time}:00Z`);
    return dt.toISOString().replace("Z", "+00:00");
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Event name is required";
    if (!formData.date) errors.date = "Date is required";
    if (!formData.start_time) errors.start_time = "Start time is required";
    if (!formData.end_time) errors.end_time = "End time is required";
    if (!formData.venue.trim()) errors.venue = "Venue is required";
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time)
      errors.end_time = "End time must be later than start time";
    if (formData.facilitator.length === 0)
      errors.facilitator = "At least one facilitator must be selected";

    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      description: "",
      start_time: "",
      end_time: "",
      venue: "",
      status: "Drafted",
      facilitator: [],
      University: university || "",
      faculty: faculty || "",
      participants: { registered_users: [] },
      eventMedia: [],
      modules: [],
    });
    setFormError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...formData,
      facilitator: formData.facilitator.map((f) => f._id),
      participants: { registered: formData.participants.registered_users.length || 0 },
      start_time: combineDateTime(formData.date, formData.start_time),
      end_time: combineDateTime(formData.date, formData.end_time),
    };

    try {
      const res = await fetch(`${API}/events/university`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create event");
      }

      alert("University event created successfully!");
      resetForm();
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create University Event</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Event Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!formError.name}
          helperText={formError.name}
        />

        <TextField
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={!!formError.date}
          helperText={formError.date}
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />

        <TextField
          label="Start Time"
          type="time"
          name="start_time"
          value={formData.start_time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={!!formError.start_time}
          helperText={formError.start_time}
        />

        <TextField
          label="End Time"
          type="time"
          name="end_time"
          value={formData.end_time}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={!!formError.end_time}
          helperText={formError.end_time}
        />

        <TextField
          label="Venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!formError.venue}
          helperText={formError.venue}
        />

        <TextField
          label="University"
          name="University"
          value={formData.University}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Faculty"
          name="faculty"
          value={formData.faculty}
          fullWidth
          margin="normal"
          disabled
        />

        <Autocomplete
          multiple
          options={facilitators}
          getOptionLabel={(option) => option.fullname}
          isOptionEqualToValue={(option, value) =>
            String(option._id || option.id) === String(value._id || value.id)
          }
          value={formData.facilitator}
          onChange={(event, newValue) =>
            setFormData({ ...formData, facilitator: newValue })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Facilitators"
              required
              error={!!formError.facilitator}
              helperText={formError.facilitator}
            />
          )}
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
          Select Modules & Add Enrollment Keys
        </Typography>

        <FormControl component="fieldset" fullWidth margin="normal">
          <FormGroup>
            {moduleList.map((module) => {
              const checked = formData.modules.some((m) => m.moduleName === module);
              const enrollmentKey =
                formData.modules.find((m) => m.moduleName === module)?.enrollmentKey || "";

              return (
                <div
                  key={module}
                  style={{ display: "flex", alignItems: "center", marginBottom: 8 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(e) => handleModuleCheck(module, e.target.checked)}
                      />
                    }
                    label={module}
                  />
                  {checked && (
                    <TextField
                    required
                      label="Enrollment Key"
                      value={enrollmentKey}
                      onChange={(e) =>
                        handleEnrollmentKeyChange(module, e.target.value)
                      }
                      size="small"
                      sx={{ ml: 2, flex: 1 }}
                    />
                  )}
                </div>
              );
            })}
          </FormGroup>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={resetForm} color="secondary">
          Reset
        </Button>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Create Event
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUniversityEvent;