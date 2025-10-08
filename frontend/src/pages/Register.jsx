import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { BiUser, BiEnvelope, BiLock, BiMap, BiPhone, BiHide, BiShow } from "react-icons/bi";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();

  const initialFormData = {
    name: "",
    email: "",
    password: "",
    user_type: "",
    location: "",
    organization: "",
    school_name: "",
    educational_zone: "",
    district: "",
    university_name: "",
    faculty: "",
    contact: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "password") setPasswordScore(zxcvbn(value).score);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (passwordScore < 2) newErrors.password = "Password too weak";

    if (!formData.user_type) newErrors.user_type = "User type is required";
    if (!formData.organization) newErrors.organization = "Organization type is required";

    if (formData.organization === "school") {
      if (!formData.school_name) newErrors.school_name = "School name is required";
      if (!formData.educational_zone) newErrors.educational_zone = "Educational zone is required";
      if (!formData.district) newErrors.district = "District is required";
    }

    if (formData.organization === "university") {
      if (!formData.university_name) newErrors.university_name = "University name is required";
      if (!formData.faculty) newErrors.faculty = "Faculty is required";
    }

    if (formData.contact && !/^\d{10}$/.test(formData.contact)) newErrors.contact = "Enter valid 10-digit number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordStrength = () => {
    switch (passwordScore) {
      case 0: return { label: "Very Weak", color: "bg-red-500", width: "20%" };
      case 1: return { label: "Weak", color: "bg-orange-500", width: "40%" };
      case 2: return { label: "Fair", color: "bg-yellow-400", width: "60%" };
      case 3: return { label: "Good", color: "bg-emerald-400", width: "80%" };
      case 4: return { label: "Strong", color: "bg-green-600", width: "100%" };
      default: return { label: "", color: "", width: "0%" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message || "Registration successful! Please check your email for confirmation.");
        navigate("/login");
      } else {
        setMessage(result.error || result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred");
    } finally {
      setFormData(initialFormData);
      setErrors({});
      setPasswordScore(0);
      setShowPassword(false);
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="relative h-screen flex flex-col lg:flex-row items-center justify-center px-4"
      style={{ backgroundImage: "url('/Home_images/image2copy.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="relative z-10 lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 px-6">
        <h1 className="text-5xl font-bold text-white">Join Us!</h1>
        <p className="text-lg text-emerald-600 mt-4">
          Create your account to access amazing features.
        </p>
      </div>

      <div className="relative z-10 lg:w-1/2 bg-gray-900/70 border-[5px] border-white rounded-2xl shadow-lg p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-white text-center text-5xl font-semibold mb-6">Register</h2>
        {message && <p className={`${message.toLowerCase().includes("success") ? "text-green-400" : "text-red-500"} mb-4 text-center`}>{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="relative">
            <label className="text-lg text-white">Name</label>
            <div className="flex items-center mt-2">
              <BiUser className="absolute left-3 text-gray-400" size={20} />
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name"
                className={`w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.name ? "border-2 border-red-500" : ""}`} />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <label className="text-lg text-white">Email</label>
            <div className="flex items-center mt-2">
              <BiEnvelope className="absolute left-3 text-gray-400" size={20} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email"
                className={`w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.email ? "border-2 border-red-500" : ""}`} />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-lg text-white">Password</label>
            <div className="relative mt-2">
              <BiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password"
                className={`w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.password ? "border-2 border-red-500" : ""}`} />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
              </button>
            </div>
            {formData.password && (
              <div className="mt-1">
                <div className="relative h-3 w-full bg-gray-600 rounded">
                  <div className={`${passwordStrength.color} h-3 rounded`} style={{ width: passwordStrength.width }} />
                </div>
                <p className="text-white text-sm mt-1">{passwordStrength.label}</p>
              </div>
            )}
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* User Type */}
          <div className="relative">
            <label className="text-lg text-white">User Type</label>
            <select name="user_type" value={formData.user_type} onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.user_type ? "border-2 border-red-500" : ""}`}>
              <option value="">Select User Type</option>
              <option value="student">Student</option>
              <option value="facilitator">Facilitator</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </div>

          {/* Organization */}
          <div className="relative">
            <label className="text-lg text-white">Organization</label>
            <select name="organization" value={formData.organization} onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.organization ? "border-2 border-red-500" : ""}`}>
              <option value="">Select Organization</option>
              <option value="school">School</option>
              <option value="university">University</option>
            </select>
            {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
          </div>

          {/* Conditional School */}
          {formData.organization === "school" && (
            <>
              <input type="text" name="school_name" value={formData.school_name} onChange={handleChange} placeholder="School Name"
                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.school_name ? "border-2 border-red-500" : ""}`} />
              <input type="text" name="educational_zone" value={formData.educational_zone} onChange={handleChange} placeholder="Educational Zone"
                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.educational_zone ? "border-2 border-red-500" : ""}`} />
              <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District"
                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.district ? "border-2 border-red-500" : ""}`} />
            </>
          )}

          {/* Conditional University */}
          {formData.organization === "university" && (
            <>
              <input type="text" name="faculty" value={formData.faculty} onChange={handleChange} placeholder="Faculty"
                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.faculty ? "border-2 border-red-500" : ""}`} />
              <input type="text" name="university_name" value={formData.university_name} onChange={handleChange} placeholder="University Name"
                className={`w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.university_name ? "border-2 border-red-500" : ""}`} />
            </>
          )}

          {/* Location */}
          <div className="relative">
            <label className="text-lg text-white">Location</label>
            <div className="flex items-center mt-2">
              <BiMap className="absolute left-3 text-gray-400" size={20} />
              <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter Location"
                className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>

          {/* Contact */}
          <div className="relative">
            <label className="text-lg text-white">Contact</label>
            <div className="flex items-center mt-2">
              <BiPhone className="absolute left-3 text-gray-400" size={20} />
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="10-digit Contact"
                maxLength={10} className={`w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.contact ? "border-2 border-red-500" : ""}`} />
            </div>
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className={`w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold transition duration-300 mt-4 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600 hover:scale-105"}`}>
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login Link */}
          <p className="text-white text-center mt-3">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="text-emerald-400 cursor-pointer hover:underline">
              Login here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
