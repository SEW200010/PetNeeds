import Header from '@/components/Admin/header'
import UserSidebar from '@/components/User/UserSidebar'
import React from 'react'
import { Mail } from "lucide-react"; 
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { useState, useEffect } from 'react';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.sub || decoded.user_id;

    axios
      .get(`http://localhost:5000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        // Optionally redirect to login if unauthorized
      });
  }, []);

  if (!user) return <div className="text-center mt-10">Loading...</div>;


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
                          <img
                            src="https://randomuser.me/api/portraits/women/44.jpg"
                            alt="Profile"
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                          />
                          <div>
                            <h2 className="text-xl font-semibold">{user.fullName}</h2>
                            <p className="text-gray-500">{user.email}</p>
                          </div>
                        </div>

                        {/* Edit Button */}
                        <button className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700">
                          Edit
                        </button>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {[
                          { label: 'Full Name', value :user.fullName},
                          { label: 'Email', value: user.email },
                          { label: 'User Type', value: user.role},
                          { label: 'Location', value: user.location },
                          { label: 'School', value: user.school },
                          { label: 'Contact', value: user.contact },
                        ].map((item, index) => (
                          <div key={index}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {item.label}
                            </label>
                            <div className="bg-gray-100 px-4 py-3 rounded-md text-gray-600">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-2xl font-medium text-gray-700 mt-8 mb-3">
                            My email Address
                        </label>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
                            <Mail className="w-4 h-4" />
                          </div>
                            <span className="text-gray-800">{user.email}</span>
                          
                        </div>

                        <div className="space-y-3">
                          <button className="w-full md:w-auto px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition">
                            +Add Email Address
                          </button>
                          <button className="w-full md:w-auto px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition block">
                            Change Password
                          </button>
                        </div>
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

export default Profile