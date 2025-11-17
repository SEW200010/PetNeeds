"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Admin/header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import UserForm from "../../components/Admin/UserForm";
import { Search, ArrowLeft } from "lucide-react";
import {
  Container,
  Paper,
  Box,
  TextField,
  Button as MUIButton,
  Chip,
  Typography,
  MenuItem,
  Stack,
  IconButton,
  Avatar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, Visibility } from "@mui/icons-material";

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);

  const [date, setDate] = useState(new Date(2021, 2, 22));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewUserData, setViewUserData] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    fullName: "",
    email: "",
    role: "student",
    location: "",
    school: "",
    contact: "",
    joinDate: "2025-01-01",
  });

    useEffect(() => {
      fetch("http://127.0.0.1:5000/api/users/")
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("Error loading users:", err));
    }, []);

  

  const handleDeleteUser = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteDialog(true);
  };

  const handleViewUser = (user) => {
    setViewUserData(user);
    setShowViewModal(true);
  };

 
  
  const confirmDeleteUser = () => {
    fetch(`http://127.0.0.1:5000/api/users/${selectedUserId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
          console.log("Deleted user:", selectedUserId);
        } else {
          console.error("Failed to delete user");
        }
        setShowDeleteDialog(false);
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        setShowDeleteDialog(false);
      });
  };

  const handleEditUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    setEditUserData(user);
    setShowEditForm(true);
  };

  const handleAddNewUser = () => {
    setShowAddUserForm(true);
  };

  const filteredUsers = users.filter(
    (user) => {
      const q = (searchQuery || "").toLowerCase();
      const name = (user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const role = (user.role || "").toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    }
  );

  const columns = [
    { field: "fullname", headerName: "Full Name", flex: 2, minWidth: 170 },
    { field: "email", headerName: "Email", flex: 2, minWidth: 200 },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const roleConfig = {
          "teacher-in-charge": {  color: "#1565C0", label: "Teacher" },
          student: {  color: "#2E7D32", label: "Student" },
          parent: {  color: "#6A1B9A", label: "Parent" },
          coordinator: { color: "#C2185B", label: "Coordinator" },
          facilitator: {  color: "#E65100", label: "Facilitator" },
          admin: { color: "#B71C1C", label: "Admin" },
        };
        const config = roleConfig[params.value] || { bg: "#F5F5F5", color: "#616161", label: params.value };
        return (
          <Box
            sx={{
              display: "inline-block",
              backgroundColor: config.bg,
              color: config.color,
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {config.label}
          </Box>
        );
      },
    },
    
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.8,
      minWidth: 220,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton color="info" size="small" onClick={() => handleViewUser(params.row)} title="View">
            <Visibility fontSize="small" />
          </IconButton>
          <IconButton color="primary" size="small" onClick={() => handleEditUser(params.row.id)} title="Edit">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDeleteUser(params.row.id)} title="Delete">
            <Delete fontSize="small" />
          </IconButton>
          
        </Stack>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />

      <div className="pt-16 flex">
        <AdminSidebar date={date} setDate={setDate} eventDates={[]} />

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <MUIButton variant="text" size="small">
                <ArrowLeft className="h-4 w-4" />
              </MUIButton>
              <h2 className="text-2xl font-semibold text-gray-900">
                User Management
              </h2>
            </div>
            <MUIButton variant="contained" color="primary" onClick={handleAddNewUser}>
              Add New User
            </MUIButton>
          </div>

          <div className="mb-6 flex justify-center w-full">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <TextField
                placeholder="Search users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
              />
            </div>
          </div>

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={filteredUsers.map((user, i) => ({
                id: user.id || i,
                ...user,
              }))}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
            />
          </div>
        </main>
      </div>

      {/* View User Modal */}
      {showViewModal && viewUserData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg w-[500px]">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Profile</h2>
            
            {/* User Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                <Avatar sx={{ width: 60, height: 60, backgroundColor: "#1565C0" }}>
                  {viewUserData.fullName?.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{viewUserData.fullName}</h3>
                  <p className="text-sm text-gray-600">{viewUserData.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Role</p>
                  <Box
                    sx={{
                      display: "inline-block",
                      backgroundColor: "#E3F2FD",
                      color: "#1565C0",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      marginTop: "4px",
                    }}
                  >
                    {viewUserData.role}
                  </Box>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                  <Chip label={viewUserData.status || "Pending"} color="success" size="small" sx={{ marginTop: "4px" }} />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">School</p>
                <p className="text-gray-700 mt-1">{viewUserData.school || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Location</p>
                <p className="text-gray-700 mt-1">{viewUserData.location || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Contact</p>
                <p className="text-gray-700 mt-1">{viewUserData.contact || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Join Date</p>
                <p className="text-gray-700 mt-1">{viewUserData.joinDate || "N/A"}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <MUIButton variant="outlined" onClick={() => setShowViewModal(false)}>
                Close
              </MUIButton>
              <MUIButton variant="contained" color="primary" onClick={() => {
                handleEditUser(viewUserData.id);
                setShowViewModal(false);
              }}>
                Edit
              </MUIButton>
            </div>
          </div>
        </div>
      )}

      {/* Verify Confirmation Modal */}
      {showVerifyDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Are you sure you want to verify this user?
            </h2>
            <p className="text-gray-600 mb-6">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <MUIButton variant="outlined" onClick={() => setShowVerifyDialog(false)}>
                Cancel
              </MUIButton>
              <MUIButton variant="contained" color="primary" onClick={confirmVerifyUser}>
                Verify
              </MUIButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-lg w-[400px]">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Are you sure you want to delete this user?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This action will permanently remove the user from the system.
            </p>
            <div className="flex justify-end space-x-3">
              <MUIButton variant="outlined" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </MUIButton>
              <MUIButton variant="contained" color="error" onClick={confirmDeleteUser}>
                Delete
              </MUIButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Add User Form */}
      <UserForm
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={() => {
          setShowEditForm(false);
          fetchEvents();
        }}
        initialData={editUserData}
      />

      {/* Add User Form */}
      <UserForm
        open={showAddUserForm}
        onClose={() => setShowAddUserForm(false)}
        onSubmit={() => {
          setShowAddUserForm(false);
          fetchEvents();
        }}
      />
    </div>
  );
};

export default UserManagementDashboard;
