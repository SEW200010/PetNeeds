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

const EditUniversityEvent = ({ open, onClose, initialData, onUpdate, university, faculty }) => {
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
    modules: [],
  });

  const [facilitators, setFacilitators] = useState([]);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});

  const moduleList = Array.from({ length: 16 }, (_, i) => `Module ${i + 1}`);

  useEffect(() => {
    if (initialData && open) {
      const startTime = initialData.start_time
        ? new Date(initialData.start_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        : "";
      const endTime = initialData.end_time
        ? new Date(initialData.end_time).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
        : "";

      const facilitatorObjects = (initialData.facilitator || []).map((f) => {
        if (!f) return { _id: "", fullname: "" };
        if (typeof f === "string" || typeof f === "number")
          return { _id: String(f), fullname: "" };
        return { _id: f._id || f.id || "", fullname: f.fullname || f.name || "" };
      });

      setFormData({
        name: initialData.title || initialData.name || "",
        date: initialData.date || "",
        description: initialData.description || "",
        start_time: startTime,
        end_time: endTime,
        venue: initialData.location || initialData.venue || "",
        status: initialData.status || "Drafted",
        facilitator: facilitatorObjects,
        University: university || initialData.University || "",
        faculty: faculty || initialData.faculty || "",
        participants: initialData.participants || { registered_users: [] },
        eventMedia: initialData.eventMedia || [],
        modules: initialData.modules || [],
      });
      setFormError("");
      setErrors({});
    }
  }, [initialData, open, university, faculty]);

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
          email: f.email || "",
        }));
        setFacilitators(normalized);
        setFormData((prev) => ({
          ...prev,
          facilitator: prev.facilitator.map((f) => {
            const match = normalized.find(
              (d) => String(d._id) === String(f._id || f.id || f)
            );
            return match ? match : f;
          }),
        }));
      })
      .catch((err) => console.error("Error fetching facilitators:", err));
  }, [university]);

  // ✅ Validation logic
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    if (!formData.venue.trim()) newErrors.venue = "Venue is required";
    if (formData.facilitator.length === 0)
      newErrors.facilitator = "At least one facilitator must be selected";

    // Optional time validation
    if (formData.start_time && formData.end_time) {
      const start = new Date(`${formData.date}T${formData.start_time}`);
      const end = new Date(`${formData.date}T${formData.end_time}`);
      if (end <= start) newErrors.end_time = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleModuleCheck = (moduleName, checked) => {
    const updatedModules = [...formData.modules];
    if (checked) updatedModules.push({ moduleName, enrollmentKey: "" });
    else {
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

  // Combine date + time: treat inputs as local and convert to UTC ISO
  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const dtLocal = new Date(`${date}T${time}`);
    return dtLocal.toISOString();
  };

  const handleUpdate = async (e) => {
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
      const res = await fetch(
        `${API}/events/university/${initialData.id || initialData._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update event");
      }

      alert("University event updated successfully!");
      if (onUpdate) onUpdate();
      onClose();
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit University Event</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Event Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name}
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
          error={!!errors.date}
          helperText={errors.date}
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
          error={!!errors.start_time}
          helperText={errors.start_time}
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
          error={!!errors.end_time}
          helperText={errors.end_time}
        />

        <TextField
          label="Venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.venue}
          helperText={errors.venue}
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
          onChange={(event, newValue) => {
            setFormData({ ...formData, facilitator: newValue });
            setErrors({ ...errors, facilitator: "" });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Facilitators"
              error={!!errors.facilitator}
              helperText={errors.facilitator}
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

        {formError && <p style={{ color: "red" }}>{formError}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">
          Update Event
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUniversityEvent;
