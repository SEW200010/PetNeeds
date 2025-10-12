import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Header from "@/components/Admin/header";
import UserSidebar from "@/components/User/UserSidebar";
import AddEmailAddress from "@/components/User/AddEmailAddress";
import ProfileImageUploader from "@/components/User/ProfileImageUploader";

function ChangePasswordPage() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.sub || decoded.user_id;

    axios
      .get(`http://localhost:5000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const parsed =
          typeof res.data === "string" ? JSON.parse(res.data) : res.data;
        setUser(parsed);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!user) return <div className="text-center mt-10">Loading...</div>;

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setMessage("Password should be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = user._id?.$oid || user._id;

      await axios.put(
        `http://localhost:5000/api/user/${userId}/change-password`,
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Password changed successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.message || "Failed to change password.";
      setMessage(errMsg);
    }
  };

  const formatJoinDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Unknown";
    }
  };

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <UserSidebar />
          <div className="w-full md:w-3/4 px-2 py-4">
            <div className="max-w-10xl mx-auto">
              <h2 className="text-lg text-gray-700 font-semibold mb-1">
                Welcome, {user.fullName}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Joined:{" "}
                {user.joinedDate
                  ? new Date(user.joinedDate.$date).toLocaleDateString()
                  : "Unknown"}
              </p>

              <div className="max-w-5.5xl mx-auto mt-6">
                <div className="h-32 rounded-t-xl bg-gradient-to-r from-blue-200 via-purple-100 to-yellow-100" />
                <div className="bg-white rounded-b-xl -mt-10 shadow-lg p-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                      <ProfileImageUploader user={user} setUser={setUser} />
                      <div>
                        <h2 className="text-xl font-semibold">
                          {user.fullName}
                        </h2>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mt-6 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full md:w-1/2 px-4 py-2 mb-2 mt-2 border rounded-md focus:outline-none"
                      placeholder="Enter new password"
                    />

                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Retype New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full md:w-1/2 px-4 py-2 mb-4 mt-2 border rounded-md focus:outline-none"
                      placeholder="Confirm new password"
                    />

                    <button
                      onClick={handleChangePassword}
                      className="block bg-green-600 text-white px-5 py-2 mt-3 rounded hover:bg-green-700"
                    >
                      Save
                    </button>

                    {message && (
                      <p
                        className={`mt-2 text-sm ${
                          message.includes("success")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {message}
                      </p>
                    )}
                  </div>

                  <div className="mt-10">
                    <AddEmailAddress user={user} setUser={setUser} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChangePasswordPage;
