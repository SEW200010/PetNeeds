"use client";

import { useEffect, useState } from "react";
import Header from "../../../components/Admin/header";
import AdminSidebar from "../../../components/Admin/AdminSidebar";
import StickyHeadTable from "../../../components/Admin/StickyHeadTable";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Search, ArrowLeft } from "lucide-react";

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);

  const [date, setDate] = useState(new Date(2021, 2, 22));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
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

  const handleVerifyUser = (userId) => {
    setSelectedUserId(userId);
    setShowVerifyDialog(true);
  };

  const handleDeleteUser = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteDialog(true);
  };

  const confirmVerifyUser = () => {
    fetch(`http://127.0.0.1:5000/api/users/verify/${selectedUserId}`, {
      method: "PUT",
    })
      .then((res) => {
        if (res.ok) {
          setUsers((prev) =>
            prev.map((user) =>
              user.id === selectedUserId ? { ...user, status: "Active" } : user
            )
          );
          console.log("Verified user:", selectedUserId);
        } else {
          console.error("Failed to verify user");
        }
        setShowVerifyDialog(false);
      })
      .catch((err) => {
        console.error("Error verifying user:", err);
        setShowVerifyDialog(false);
      });
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
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { id: "id", label: "#", minWidth: 50, align: "center" },
    { id: "fullName", label: "Full Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 200 },
    {
      id: "role",
      label: "Role",
      minWidth: 120,
      format: (value) => {
        const colors = {
          "teacher-in-charge": "bg-blue-100 text-blue-800",
          student: "bg-green-100 text-green-800",
          parent: "bg-purple-100 text-purple-800",
        };
        return (
          <Badge className={colors[value] || "bg-gray-100 text-gray-800"}>
            {value}
          </Badge>
        );
      },
    },
    {
      id: "status",
      label: "Status",
      minWidth: 100,
      format: (value) => {
        const colors = {
          Active: "bg-green-100 text-green-800",
          Inactive: "bg-red-100 text-red-800",
          Pending: "bg-yellow-100 text-yellow-800",
        };
        return (
          <Badge className={colors[value] || "bg-gray-100 text-gray-800"}>
            {value}
          </Badge>
        );
      },
    },
    { id: "joinDate", label: "Join Date", minWidth: 120 },
    {
      id: "actions",
      label: "Actions",
      minWidth: 200,
      format: (value, row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-700 text-white text-xs"
            onClick={() => handleDeleteUser(row.id)}
          >
            Delete
          </Button>
          <Button
            size="sm"
            className="bg-blue-400 hover:bg-blue-600 text-white text-xs"
            onClick={() => handleEditUser(row.id)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            className="bg-green-400 hover:bg-green-600 text-white text-xs"
            onClick={() => handleVerifyUser(row.id)}
          >
            Verify
          </Button>
        </div>
      ),
    },
  ];

  const processedRows = filteredUsers.map((user) => ({
    ...user,
    role:
      columns.find((col) => col.id === "role").format?.(user.role) || user.role,
    status:
      columns.find((col) => col.id === "status").format?.(user.status) ||
      user.status,
    actions: columns.find((col) => col.id === "actions").format(null, user),
  }));

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />

      <div className="pt-16 flex">
        <AdminSidebar date={date} setDate={setDate} eventDates={[]} />

        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-semibold text-gray-900">
                User Management
              </h2>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleAddNewUser}
            >
              Add New User
            </Button>
          </div>

          <div className="mb-6 flex justify-center w-full">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4">
              <StickyHeadTable columns={columns} rows={processedRows} />
            </div>
          </div>
        </main>
      </div>

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
              <Button
                variant="outline"
                className="bg-gray-200 text-gray-700"
                onClick={() => setShowVerifyDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={confirmVerifyUser}
              >
                Verify
              </Button>
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
              <Button
                variant="outline"
                className="bg-gray-200 text-gray-700 font-medium"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white font-medium"
                onClick={confirmDeleteUser}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {showEditForm && editUserData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg w-[500px]">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              User Details
            </h2>
            <p className="text-sm text-gray-600 mb-6">Fill the all fields.</p>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editUserData.fullName}
                  className="w-full border rounded-md px-3 py-2"
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      fullName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editUserData.location || ""}
                  className="w-full border rounded-md px-3 py-2"
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">School</label>
                <input
                  type="text"
                  value={editUserData.school || ""}
                  className="w-full border rounded-md px-3 py-2"
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, school: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact No
                </label>
                <input
                  type="text"
                  value={editUserData.contact || ""}
                  className="w-full border rounded-md px-3 py-2"
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      contact: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={editUserData.email || ""}
                  className="w-full border rounded-md px-3 py-2"
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline"
                className="bg-gray-200 text-gray-700"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `http://127.0.0.1:5000/api/users/${editUserData.id}`,
                      {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(editUserData),
                      }
                    );

                    if (res.ok) {
                      // Update local state
                      setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                          user.id === editUserData.id ? editUserData : user
                        )
                      );
                      console.log("Updated user:", editUserData);
                      setShowEditForm(false);
                    } else {
                      console.error("Failed to update user");
                    }
                  } catch (error) {
                    console.error("Error updating user:", error);
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      {showAddUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl border border-gray-300 p-6 shadow-lg w-[500px]">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Add New User
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill all fields to add user.
            </p>

            <div className="space-y-4">
              {["fullName", "email", "location", "school", "contact"].map(
                (field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1 capitalize">
                      {field}
                    </label>
                    <input
                      type="text"
                      value={newUserData[field]}
                      className="w-full border rounded-md px-3 py-2"
                      onChange={(e) =>
                        setNewUserData({
                          ...newUserData,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                )
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, role: e.target.value })
                  }
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="teacher-in-charge">Teacher in Charge</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline"
                className="bg-gray-200 text-gray-700"
                onClick={() => setShowAddUserForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      "http://127.0.0.1:5000/api/users/",

                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newUserData),
                      }
                    );
                    if (res.ok) {
                      const { user } = await res.json();
                      setUsers((prev) => [...prev, user]);
                      setShowAddUserForm(false);
                      setNewUserData({
                        fullName: "",
                        email: "",
                        role: "student",
                        location: "",
                        school: "",
                        contact: "",
                        joinDate: "2025-01-01",
                      });
                    } else {
                      console.error("Failed to add user");
                    }
                  } catch (error) {
                    console.error("Error adding user:", error);
                  }
                }}
              >
                Add User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementDashboard;
