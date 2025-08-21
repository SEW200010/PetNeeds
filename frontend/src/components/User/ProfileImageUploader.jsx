import React, { useRef, useState } from "react";
import axios from "axios";

function ProfileImageUploader({ user, setUser }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;

  const handleAvatarClick = () => {
    setOpen(true);
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const userId = user._id?.$oid || user._id;

      const res = await axios.post(
        `${API}/api/user/${userId}/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = { ...user, profileImage: res.data.imageUrl };
      setUser(updatedUser);
      setUploading(false);
      setError("");
      setOpen(false);
    } catch (err) {
      console.error("Upload failed", err);
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Small Profile Avatar */}
      <img
        src={`${API}${user.profileImage || "/uploads/default.jpg"}`}
        alt="Profile"
        onClick={handleAvatarClick}
        className="w-20 h-20 rounded-full object-cover cursor-pointer border-2 border-gray-300 hover:border-blue-500"
      />

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 space-y-4">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={`${API}${user.profileImage || "/uploads/default.jpg"}`}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-300"
            />
            {/* Close Button near image */}
            <button
  onClick={() => setOpen(false)}
  className="absolute -top-2 -right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-gray-100"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="black"   // 👈 change this color to whatever you like
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>

          </div>

          {/* Upload Button */}
          <div>
            <button
              onClick={handleFileSelect}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default ProfileImageUploader;
