import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { BiUser, BiEnvelope, BiLock, BiMap, BiPhone, BiHide, BiShow } from "react-icons/bi";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const navigate = useNavigate();

  const initialFormData = {
    fullname: "",
    email: "",
    password: "",
    role: "",
    organization_unit: "",
    district: "",
    zone: "",
    school_name: "",
    university_name: "",
    faculty_name: "",
    address: "",
    contact: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  // Refs
  const refs = {
    fullname: useRef(),
    email: useRef(),
    password: useRef(),
    role: useRef(),
    organization_unit: useRef(),
    district: useRef(),
    zone: useRef(),
    school_name: useRef(),
    university_name: useRef(),
    faculty_name: useRef(),
    address: useRef(),
    contact: useRef(),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "password") setPasswordScore(zxcvbn(value).score);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullname) newErrors.fullname = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (passwordScore < 2) newErrors.password = "Password too weak";

    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.organization_unit) newErrors.organization_unit = "Organization unit is required";

    if (formData.organization_unit === "school") {
      if (!formData.school_name) newErrors.school_name = "School name is required";
      if (!formData.zone) newErrors.zone = "Educational zone is required";
      if (!formData.district) newErrors.district = "District is required";
    }

    if (formData.organization_unit === "university") {
      if (!formData.university_name) newErrors.university_name = "University name is required";
      if (!formData.faculty_name) newErrors.faculty_name = "Faculty name is required";
    }

    if (formData.contact && !/^\d{10}$/.test(formData.contact)) newErrors.contact = "Enter valid 10-digit number";

    setErrors(newErrors);

    // Scroll & focus first error
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.keys(newErrors)[0];
      const ref = refs[firstError];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        ref.current.focus();
      }
    }

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
        alert(result.message || "Registration successful! Please check your email.");
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

  const inputClass = `w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300`;

  return (
    <div className="relative h-screen flex flex-col lg:flex-row items-center justify-center px-4" style={{ backgroundImage: "url('/Home_images/image2copy.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="relative z-10 lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 px-6">
        <h1 className="text-5xl font-bold text-white">Join Us!</h1>
        <p className="text-lg text-emerald-600 mt-4">Create your account to access amazing features.</p>
      </div>

      <div className="relative z-10 lg:w-1/2 bg-gray-900/70 border-[5px] border-white rounded-2xl shadow-lg p-8 max-h-[90vh] overflow-y-auto transition transform duration-300">
        <h2 className="text-white text-center text-5xl font-semibold mb-6">Register</h2>
        {message && <p className={`${message.toLowerCase().includes("success") ? "text-green-400" : "text-red-500"} mb-4 text-center`}>{message}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Fullname */}
          <div className="relative">
            <label className="text-lg text-white">Full Name</label>
            <div className="flex items-center mt-2">
              <BiUser className="absolute left-3 text-gray-400" size={20} />
              <input ref={refs.fullname} type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="Enter Full Name" className={`${inputClass} ${errors.fullname ? "border-2 border-red-500" : ""}`} />
            </div>
            {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <label className="text-lg text-white">Email</label>
            <div className="flex items-center mt-2">
              <BiEnvelope className="absolute left-3 text-gray-400" size={20} />
              <input ref={refs.email} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" className={`${inputClass} ${errors.email ? "border-2 border-red-500" : ""}`} />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-lg text-white">Password</label>
            <div className="relative mt-2">
              <BiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input ref={refs.password} type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" className={`${inputClass} ${errors.password ? "border-2 border-red-500" : ""}`} />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition duration-300" onClick={() => setShowPassword(!showPassword)}>
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

          {/* Role */}
          <div className="relative">
            <label className="text-lg text-white">Role</label>
            <select ref={refs.role} name="role" value={formData.role} onChange={handleChange} className={`${inputClass} ${errors.role ? "border-2 border-red-500" : ""}`}>
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="facilitator">Facilitator</option>
              <option value="coordinator">Coordinator</option>
            </select>
          </div>

          {/* Organization */}
          <div className="relative">
            <label className="text-lg text-white">Organization</label>
            <select ref={refs.organization_unit} name="organization_unit" value={formData.organization_unit} onChange={handleChange} className={`${inputClass} ${errors.organization_unit ? "border-2 border-red-500" : ""}`}>
              <option value="">Select Organization</option>
              <option value="school">School</option>
              <option value="university">University</option>
            </select>
          </div>

          {/* Conditional School */}
          {formData.organization_unit === "school" && (
            <>
              <input ref={refs.school_name} type="text" name="school_name" value={formData.school_name} onChange={handleChange} placeholder="School Name" className={`${inputClass} ${errors.school_name ? "border-2 border-red-500" : ""}`} />
              <input ref={refs.zone} type="text" name="zone" value={formData.zone} onChange={handleChange} placeholder="Zone" className={`${inputClass} ${errors.zone ? "border-2 border-red-500" : ""}`} />
              <input ref={refs.district} type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District" className={`${inputClass} ${errors.district ? "border-2 border-red-500" : ""}`} />
            </>
          )}

          {/* Conditional University */}
          {formData.organization_unit === "university" && (
            <>
              <input ref={refs.university_name} type="text" name="university_name" value={formData.university_name} onChange={handleChange} placeholder="University Name" className={`${inputClass} ${errors.university_name ? "border-2 border-red-500" : ""}`} />
              <input ref={refs.faculty_name} type="text" name="faculty_name" value={formData.faculty_name} onChange={handleChange} placeholder="Faculty Name" className={`${inputClass} ${errors.faculty_name ? "border-2 border-red-500" : ""}`} />
            </>
          )}

          {/* Address */}
          <div className="relative">
            <label className="text-lg text-white">Address</label>
            <div className="flex items-center mt-2">
              <BiMap className="absolute left-3 text-gray-400" size={20} />
              <input ref={refs.address} type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address" className={inputClass} />
            </div>
          </div>

          {/* Contact */}
          <div className="relative">
            <label className="text-lg text-white">Contact</label>
            <div className="flex items-center mt-2">
              <BiPhone className="absolute left-3 text-gray-400" size={20} />
              <input ref={refs.contact} type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="10-digit Contact" maxLength={10} className={`${inputClass} ${errors.contact ? "border-2 border-red-500" : ""}`} />
            </div>
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className={`w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg hover:bg-green-600"}`}>
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Login Link */}
          <p className="text-white text-center mt-3">
            Already have an account? <span onClick={() => navigate("/login")} className="text-emerald-400 cursor-pointer hover:underline hover:text-green-400 transition duration-300">Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
