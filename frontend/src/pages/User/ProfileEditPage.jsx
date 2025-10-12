import Header from '@/components/Admin/header'
import UserSidebar from '@/components/User/UserSidebar'
import React from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import AddEmailAddress from '@/components/User/AddEmailAddress';
import ProfileImageUploader from '@/components/User/ProfileImageUploader';

// ...import statements remain the same

function ProfileEditPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.sub || decoded.user_id;

    axios.get(`${API}/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setUser(res.data);
      setFormData(res.data); // initialize form with current values
    })
    .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const userId = user._id?.$oid || user._id;

    try {
      await axios.put(`${API}/api/user/${userId}/update`, formData, {
        headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'application/json',
        },
        withCredentials: true 
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Something went wrong while updating your profile.");
    }
  };

  if (!user) return <div className="text-center mt-10">Loading...</div>;

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
                Joined: {user.joinedDate ? new Date(user.joinedDate.$date).toLocaleDateString() : "Unknown"}
              </p>

              <div className="max-w-5.5xl mx-auto mt-6">
                <div className="h-32 rounded-t-xl bg-gradient-to-r from-blue-200 via-purple-100 to-yellow-100" />
                <div className="bg-white rounded-b-xl -mt-10 shadow-lg p-8">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <ProfileImageUploader user={user} setUser={setUser} />
                      <div>
                        <h2 className="text-xl font-semibold">{user.fullName}</h2>
                        <p className="text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {[
                      { name: 'fullName', label: 'Full Name' },
                      { name: 'email', label: 'Email' },
                      { name: 'location', label: 'Location' },
                      { name: 'school', label: 'School' },
                      { name: 'contact', label: 'Contact' },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-300"
                        />
                      </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            User Type
                        </label>
                        <select
                            name="role"
                            value={formData.role || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-md border border-gray-300"
                        >
                            <option value="">Select user type</option>
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <AddEmailAddress user={user} setUser={setUser} />
                    <button
                      onClick={() => navigate('/profile/change-password')}
                      className="w-full md:w-auto mt-3 px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
                    >
                      Change Password
                    </button>
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

export default ProfileEditPage;