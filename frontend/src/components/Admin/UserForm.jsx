import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";


const UserForm = ({ open, onClose, onSubmit, initialData = null }) => {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    university_name: "",
    faculty_name: "",
    address: "",
    contact: "",
    isVerified: true,
    joinedDate: new Date().toISOString(),
    organization_unit: "university",
    profileImage: "/uploads/default.png",
  });

  const [error, setError] = useState("");

  // Prefill form in edit mode
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        ...initialData,
        password: "", // don’t show password
      });
    }
  }, [initialData, isEditMode]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let isVerified = true;
      if (formData.role === "facilitator") isVerified = false;

      const payload = {
        ...formData,
        isVerified,
        joinedDate: new Date().toISOString(),
      };

      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `http://localhost:5000/users/${initialData._id}`
        : "http://localhost:5000/users";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save user");
      }

      alert(isEditMode ? "User updated successfully!" : "User created successfully!");
      onSubmit?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleReset = () => {
    setFormData({
      fullname: "",
      email: "",
      password: "",
      role: "",
      address: "",
      contact: "",
      isVerified: true,
      joinedDate: new Date().toISOString(),
      organization_unit: "university",
      profileImage: "/uploads/default.png",
    });
    setError("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Full Name"
          name="fullname"
          value={formData.fullname}
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

        {!isEditMode && (
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        )}

        {isEditMode && (
          <TextField
            label="New Password (optional)"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        )}

        <TextField
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Contact"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          fullWidth
          margin="normal"
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
          {isEditMode ? "Update User" : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
