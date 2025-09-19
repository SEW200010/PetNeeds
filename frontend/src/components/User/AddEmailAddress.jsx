import React from 'react';
import { Mail, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddEmailAddress({ user, setUser }) {
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_BASE_URL;

  if (!user) return null;

  const handleDeleteEmail = async (emailToDelete) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(`${API}/api/user/remove-email`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { email: emailToDelete },
      });

      if (res.status === 200) {
        const updatedEmails = user.otherEmails.filter(email => email !== emailToDelete);
        setUser({ ...user, otherEmails: updatedEmails });
      }
    } catch (err) {
      console.error("Failed to delete email:", err);
    }
  };

  return (
    <div>
      <label className="block text-2xl font-medium text-gray-700 mt-8 mb-3">
        My Email Addresses
      </label>

      {/* Primary Email in green */}
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-full">
          <Mail className="w-4 h-4" />
        </div>
        <span className="text-gray-800">{user.email}</span>
      </div>

      {/* Other Emails in gray + Delete */}
      {user.otherEmails?.map((email, index) => (
        <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded mb-2">
          <div className="bg-gray-200 text-gray-600 p-2 rounded-full">
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-gray-700">{email}</span>

          {/* Delete icon closely beside email */}
          <button
            onClick={() => handleDeleteEmail(email)}
            className="text-red-500 hover:text-red-700 ml-1"
            title="Remove"
          >
            <span className="text-lg font-semibold">×</span>
          </button>
        </div>
      ))}


      {/* Add Email Button */}
      <div className="space-y-3 mt-6">
        <button
          onClick={() => navigate('/profile/add-email')}
          className="w-full mb-2 md:w-auto px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
        >
          + Add Email Address
        </button>
      </div>
    </div>
  );
}

export default AddEmailAddress;