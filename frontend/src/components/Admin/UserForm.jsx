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


const UserForm = ({ open, onClose, onSubmit, initialData = null, role: presetRole = "", university , faculty }) => {
  const isEditMode = Boolean(initialData);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "",
    organization_unit: localStorage.getItem("organization_unit") ||"university", // or "school"
    university_name: localStorage.getItem("university_name") || "",
    faculty_name: localStorage.getItem("faculty_name") || "",
    district: "",
    zone: "",
    school_name: "",
    address: "",
    contact: "",
    
    //joinedDate: new Date().toISOString(),
    //organization_unit: "university",
    //profileImage: "/uploads/default.png",
  });

  const [error, setError] = useState("");

  // Prefill form in edit mode
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        ...initialData,
        password: "", // don’t show password
      });
    } else if (presetRole) {
      // when adding, preset the role (coordinator/facilitator/student)
      setFormData((prev) => ({ ...prev, role: presetRole }));
    }
    // Read organization_unit and related values from localStorage whenever the form opens
    try {
      const orgUnit = localStorage.getItem("organization_unit");
      if (orgUnit) {
        if (orgUnit === "school") {
          const district = localStorage.getItem("district") || "";
          const zone = localStorage.getItem("zone") || "";
          const school_name = localStorage.getItem("school_name") || "";
          setFormData((prev) => ({ ...prev, organization_unit: "school", district, zone, school_name }));
        } else if (orgUnit === "university") {
          const university_name = localStorage.getItem("university_name") || "";
          const faculty_name = localStorage.getItem("faculty_name") || "";
          setFormData((prev) => ({ ...prev, organization_unit: "university", university_name, faculty_name }));
        }
      }
    } catch (err) {
      // ignore localStorage errors in non-browser environments
    }

    // Prefer props passed from parent (e.g. EventsAndUsers) for university/faculty when not editing
    if (!isEditMode) {
      const updates = {};
      if (university) {
        updates.organization_unit = "university";
        updates.university_name = university;
      }
      if (faculty) updates.faculty_name = faculty;
      if (Object.keys(updates).length) setFormData((prev) => ({ ...prev, ...updates }));
    }
  }, [initialData, isEditMode, presetRole, open]);
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

      const token = localStorage.getItem("token");
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `http://localhost:5000/users/${initialData._id}/edit`
        : `http://localhost:5000/users/add`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          fullname: payload.fullname,
          email: payload.email,
          password: payload.password || undefined,
          role: payload.role,
          // organization fields: always include organization unit and university/faculty
          organization_unit: payload.organization_unit,
          university_name: payload.university_name,
          faculty_name: payload.faculty_name,
          address: payload.address,
          contact: payload.contact,
          isVerified: payload.isVerified,
        }),
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
      organization_unit: localStorage.getItem("organization_unit") || "university",
      district: localStorage.getItem("district") || "",
      zone: localStorage.getItem("zone") || "",
      school_name: localStorage.getItem("school_name") || "",
      university_name: university || localStorage.getItem("university_name") || "",
      faculty_name: faculty || localStorage.getItem("faculty_name") || "",
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
          select
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="coordinator">Coordinator</MenuItem>
          <MenuItem value="facilitator">Facilitator</MenuItem>
          <MenuItem value="student">Student</MenuItem>
        </TextField>

        {/* Organization unit fields (read-only) */}
        {formData.organization_unit === "school" ? (
          <>
            <TextField
              label="District"
              name="district"
              value={formData.district}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Zone"
              name="zone"
              value={formData.zone}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="School Name"
              name="school_name"
              value={formData.school_name}
              fullWidth
              margin="normal"
              disabled
            />
          </>
        ) : (
          <>
            <TextField
              label="University"
              name="university_name"
              value={formData.university_name}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Faculty"
              name="faculty_name"
              value={formData.faculty_name}
              fullWidth
              margin="normal"
              disabled
            />
          </>
        )}

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
