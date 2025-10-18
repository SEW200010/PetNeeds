import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";

const ViewUserDialog = ({ open, onClose, userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!open || !userId) return;
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/users/${userId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, [open, userId]);

  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user.fullname || user.name || "User"}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Email</Typography>
          <Typography>{user.email}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Role</Typography>
          <Typography>{user.role}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">University / Faculty</Typography>
          <Typography>{(user.university_name || user.University || "") + (user.faculty_name ? ` / ${user.faculty_name}` : "")}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Contact</Typography>
          <Typography>{user.contact || "N/A"}</Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Address</Typography>
          <Typography>{user.address || "N/A"}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUserDialog;
