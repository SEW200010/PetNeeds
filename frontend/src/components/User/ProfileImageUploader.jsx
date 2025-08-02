import React, { useRef, useState } from 'react';
import axios from 'axios';

function ProfileImageUploader({ user, setUser }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const API = import.meta.env.VITE_API_BASE_URL;

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');

      const userId = user._id?.$oid || user._id;

      const res = await axios.post(
        `${API}/api/user/${userId}/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedUser = { ...user, profileImage: res.data.imageUrl };
      setUser(updatedUser);
      setUploading(false);
      setError('');
    } catch (err) {
      console.error('Upload failed', err);
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block text-center">
      <img
        src={`${API}${user.profileImage || '/uploads/default.jpg'}`}
        alt="Profile"
        onClick={handleImageClick}
        className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 border-gray-300 hover:border-blue-500"
      />
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm text-gray-700 rounded-full">
          Uploading...
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
}

export default ProfileImageUploader;
