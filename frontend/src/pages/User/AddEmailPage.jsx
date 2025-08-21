import React from 'react'
import Header from '@/components/Admin/header'
import UserSidebar from '@/components/User/UserSidebar'
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddEmailAddress from '@/components/User/AddEmailAddress';
import ProfileImageUploader from '@/components/User/ProfileImageUploader';

const AddEmailPage = () => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) return;
  
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.user_id;
  
      axios
        .get(`${API}/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error(err);
          // Optionally redirect to login if unauthorized
        });
    }, []);
  
    if (!user) return <div className="text-center mt-10">Loading...</div>;

    const handleAddEmail = async () => {
        const token = localStorage.getItem("token");
        if (!token || !newEmail) return;

        const decoded = jwtDecode(token);
        const userId = decoded.sub || decoded.user_id;

        try {
        const res = await axios.post(
            `http://localhost:5000/api/user/${userId}/add-email`,
            { email: newEmail },
            {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            }
        );
        setUser(res.data); // update local user data with new email added
        setNewEmail("");   // clear input field
        alert('email verfied');
        } catch (error) {
        console.error("Error adding email:", error);
        alert("Failed to add email. Try a different one.");
        }
    };

  return (
    <div>
        <Header/>
            <main className="bg-gray-100 pt-[65px] min-h-screen">
                <div className="flex flex-col md:flex-row">
                    <UserSidebar />
                    <div className="w-full md:w-3/4 px-2 py-4">
                        <div className="max-w-10xl mx-auto">
                            {/* Welcome */}
                            <h2 className="text-lg text-gray-700 font-semibold mb-1">
                                Welcome, {user.fullName}
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Joined: {user.joinedDate || "Unknown"}
                            </p>

                        {/* Profile Card */}
                        <div className="max-w-5.5xl mx-auto mt-6 " >
                            {/* Gradient Header */}
                            <div className="h-32 rounded-t-xl bg-gradient-to-r from-blue-200 via-purple-100 to-yellow-100" />
                            {/* White card */}
                            <div className="bg-white rounded-b-xl -mt-10 shadow-lg p-8">
                                <div className="flex justify-between items-center">
                                    {/* Profile Info */}
                                    <div className="flex items-center space-x-4">
                                        <ProfileImageUploader user={user} setUser={setUser} />
                                        <div>
                                            <h2 className="text-xl font-semibold">{user.fullName}</h2>
                                            <p className="text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className=' mt-8'>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Email</h2>

                                    {/* Add Email Form */}
                                    <div className="mb-6">
                                        <label className="block text-lg font-medium text-gray-700 mb-2">Enter New Email</label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="w-full md:w-1/2 px-4 py-2 border rounded-md focus:outline-none mt-2"
                                            placeholder="your@email.com"
                                        />
                                        <div className="flex gap-4 mt-6">
                                            <button
                                                onClick={handleAddEmail}
                                                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
                                                >
                                                Verify Email
                                            </button>
                                            <button
                                                onClick={() => navigate("/profile")}
                                                className="bg-gray-300 text-gray-800 px-5 py-2 rounded hover:bg-gray-400"
                                                >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <AddEmailAddress user={user} setUser={setUser}/>
                                </div>

                                       
                                
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
    </div>
  )
}

export default AddEmailPage
