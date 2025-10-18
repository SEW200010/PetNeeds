import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FacultyForm = ({ open, onClose, onSubmit, initialData = null, universityName }) => {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    faculty_name: "",
    dean: "",
    email: "",
    phone: "",
    university: universityName || "",
  });

  const [error, setError] = useState("");

  // Prefill data when editing or reset when adding
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        faculty_name: initialData.faculty_name || "",
        dean: initialData.dean || "",
        email: initialData.contact?.email || "",
        phone: initialData.contact?.phone || "",
        university: initialData.university || universityName || "",
      });
    } else {
      setFormData({
        faculty_name: "",
        dean: "",
        email: "",
        phone: "",
        university: universityName || "",
      });
    }
    setError("");
  }, [initialData, isEditMode, open, universityName]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token missing.");

      const method = isEditMode ? "PUT" : "POST";
      const facultyId = isEditMode ? initialData.id : null;
    console.log("Faculty form submit:", { isEditMode, facultyId, formData });
      const url = isEditMode
        ? `${API}/faculties/${facultyId}`
        : `${API}/faculties/add`;

      const payload = {
        faculty_name: formData.faculty_name,
        dean: formData.dean,
        contact: {
          email: formData.email,
          phone: formData.phone,
        },
        university: formData.university,
      };

      console.log("Submitting faculty data:", payload);

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save faculty");
      }

      alert(isEditMode ? "Faculty updated successfully!" : "Faculty added successfully!");
      onSubmit?.(); // refresh parent table
      onClose(); // close dialog
    } catch (err) {
      console.error("Faculty form error:", err);
      setError(err.message);
    }
  };

  const handleReset = () => {
    setFormData({
      faculty_name: "",
      dean: "",
      email: "",
      phone: "",
      university: universityName || "",
    });
    setError("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Faculty" : "Add New Faculty"}</DialogTitle>

      <DialogContent dividers>
        <TextField
          label="Faculty Name"
          name="faculty_name"
          value={formData.faculty_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Dean"
          name="dean"
          value={formData.dean}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="University"
          name="university"
          value={formData.university}
          fullWidth
          margin="normal"
          disabled
        />

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReset} color="secondary">
          Reset
        </Button>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditMode ? "Update Faculty" : "Add Faculty"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FacultyForm;
