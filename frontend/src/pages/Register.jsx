import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import zxcvbn from "zxcvbn";
import { BiUser, BiEnvelope, BiLock, BiMap, BiPhone, BiHide, BiShow } from "react-icons/bi";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const universities = [
  "University of Colombo",
  "University of Peradeniya",
  "University of Sri Jayewardenepura",
  "University of Kelaniya",
  "University of Moratuwa",
  "University of Jaffna",
  "University of Ruhuna",
  "Eastern University, Sri Lanka",
  "South Eastern University of Sri Lanka",
  "Rajarata University of Sri Lanka",
  "Sabaragamuwa University of Sri Lanka",
  "Wayamba University of Sri Lanka",
  "Uva Wellassa University of Sri Lanka",
  "University of the Visual and Performing Arts",
  "Gampaha Wickramarachchi University of Indigenous Medicine",
  "University of Vavuniya",
  "other"
];

const faculties = {
  "University of Jaffna": [
    "Faculty of Agriculture",
    "Faculty of Allied Health Sciences",
    "Faculty of Arts",
    "Faculty of Engineering",
    "Faculty of Graduate Studies",
    "Faculty of Hindu Studies",
    "Faculty of Management Studies and Commerce",
    "Faculty of Medicine",
    "Faculty of Science",
    "Faculty of Technology",
    "Sir Ponnambalam Ramanathan Faculty of Performing & Visual Arts",
  ],
  "University of Vavuniya": [
    "Faculty of Applied Science",
    "Faculty of Business Studies",
    "Faculty of Technological Studies",
  ],
  "Eastern University, Sri Lanka": [
    "Faculty of Agriculture",
    "Faculty of Arts and Culture",
    "Faculty of Commerce and Management",
    "Faculty of Health Care Sciences",
    "Faculty of Science",
    "Faculty of Technology",
    "Faculty of Communication and Business Studies (Trincomalee Campus)",
    "Faculty of Applied Sciences (Trincomalee Campus)",
    "Swamy Vipulananda Institute of Aesthetic Studies",
  ],
  "South Eastern University of Sri Lanka": [
    "Faculty of Applied Sciences",
    "Faculty of Arts and Culture",
    "Faculty of Islamic Studies and Arabic Language",
    "Faculty of Management and Commerce",
    "Faculty of Engineering",
    "Faculty of Technology",
  ],
};

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

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);

  const refs = Object.keys(initialFormData).reduce((acc, key) => {
    acc[key] = useRef();
    return acc;
  }, {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "university_name") updated.faculty_name = "";
      return updated;
    });
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
        setFormData(initialFormData);
        setPasswordScore(0);
        setShowPassword(false);
        setErrors({});
        navigate("/login");
      } else {
        setMessage(result.error || result.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  const baseInputClass = `w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 transition duration-300`;
  const getInputClass = (fieldName) =>
    errors[fieldName]
      ? `${baseInputClass} border-2 border-red-500 focus:ring-0 hover:ring-0`
      : `${baseInputClass} focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:ring-2 hover:ring-emerald-500 hover:bg-gray-700 hover:shadow-lg`;

  const TextInput = ({ refProp, name, label, icon, type = "text", placeholder, maxLength }) => (
    <div className="relative">
      <label className="text-lg text-white">{label}</label>
      <div className="flex items-center mt-2">
        {icon}
        <input
          ref={refProp}
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={getInputClass(name)}
          maxLength={maxLength}
        />
      </div>
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  const SelectInput = ({ refProp, name, label, options, disabled }) => (
    <div className="relative">
      <label className="text-lg text-white">{label}</label>
      <select
        ref={refProp}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        disabled={disabled}
        className={getInputClass(name)}
      >
        <option value="">{`Select ${label}`}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

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
          <TextInput refProp={refs.fullname} name="fullname" label="Full Name" placeholder="Enter Full Name" icon={<BiUser className="absolute left-3 text-gray-400" size={20} />} />
          <TextInput refProp={refs.email} name="email" label="Email" placeholder="Enter Email" icon={<BiEnvelope className="absolute left-3 text-gray-400" size={20} />} type="email" />
          
          {/* Password */}
          <div className="relative">
            <label className="text-lg text-white">Password</label>
            <div className="relative mt-2">
              <BiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                ref={refs.password}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className={getInputClass("password")}
              />
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

          <SelectInput refProp={refs.role} name="role" label="Role" options={["student", "facilitator", "coordinator"]} />
          <SelectInput refProp={refs.organization_unit} name="organization_unit" label="Organization" options={["school", "university"]} />

          {/* Conditional School Fields */}
          {formData.organization_unit === "school" && (
            <>
              <TextInput refProp={refs.school_name} name="school_name" label="School Name" placeholder="School Name" />
              <TextInput refProp={refs.zone} name="zone" label="Zone" placeholder="Zone" />
              <TextInput refProp={refs.district} name="district" label="District" placeholder="District" />
            </>
          )}

          {/* Conditional University Fields */}
          {formData.organization_unit === "university" && (
            <>
              <SelectInput refProp={refs.university_name} name="university_name" label="University Name" options={universities} />
              <SelectInput refProp={refs.faculty_name} name="faculty_name" label="Faculty Name" options={faculties[formData.university_name] || []} disabled={!formData.university_name} />
            </>
          )}

          <TextInput refProp={refs.address} name="address" label="Address" placeholder="Enter Address" icon={<BiMap className="absolute left-3 text-gray-400" size={20} />} />
          <TextInput refProp={refs.contact} name="contact" label="Contact" placeholder="10-digit Contact" icon={<BiPhone className="absolute left-3 text-gray-400" size={20} />} maxLength={10} />

          <button type="submit" disabled={loading} className={`w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-lg hover:bg-green-600"}`}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-white text-center mt-3">
            Already have an account? <span onClick={() => navigate("/login")} className="text-emerald-400 cursor-pointer hover:underline hover:text-green-400 transition duration-300">Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;