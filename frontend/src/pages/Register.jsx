import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { BiUser,BiMailSend, BiLock, BiHide, BiShow, BiPhone, BiMap, BiBuilding, BiBook } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthBar from 'react-password-strength-bar';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const universities = [
  'University of Colombo',
  'University of Peradeniya',
  'University of Sri Jayewardenepura',
  'University of Kelaniya',
  'University of Moratuwa',
  'University of Jaffna',
  'University of Ruhuna',
  'Eastern University, Sri Lanka',
  'South Eastern University of Sri Lanka',
  'Rajarata University of Sri Lanka',
  'Sabaragamuwa University of Sri Lanka',
  'Wayamba University of Sri Lanka',
  'Uva Wellassa University of Sri Lanka',
  'University of the Visual and Performing Arts',
  'Gampaha Wickramarachchi University of Indigenous Medicine',
  'University of Vavuniya',
  'Other',
];

const faculties = {
  'University of Jaffna': [
    'Faculty of Agriculture',
    'Faculty of Allied Health Sciences',
    'Faculty of Arts',
    'Faculty of Engineering',
    'Faculty of Graduate Studies',
    'Faculty of Hindu Studies',
    'Faculty of Management Studies and Commerce',
    'Faculty of Medicine',
    'Faculty of Science',
    'Faculty of Technology',
    'Sir Ponnambalam Ramanathan Faculty of Performing & Visual Arts',
  ],
  'University of Vavuniya': ['Faculty of Applied Science', 'Faculty of Business Studies', 'Faculty of Technological Studies'],
  'Eastern University, Sri Lanka': [
    'Faculty of Agriculture',
    'Faculty of Arts and Culture',
    'Faculty of Commerce and Management',
    'Faculty of Health Care Sciences',
    'Faculty of Science',
    'Faculty of Technology',
    'Faculty of Communication and Business Studies (Trincomalee Campus)',
    'Faculty of Applied Sciences (Trincomalee Campus)',
    'Swamy Vipulananda Institute of Aesthetic Studies',
  ],
  'South Eastern University of Sri Lanka': [
    'Faculty of Applied Sciences',
    'Faculty of Arts and Culture',
    'Faculty of Islamic Studies and Arabic Language',
    'Faculty of Management and Commerce',
    'Faculty of Engineering',
    'Faculty of Technology',
  ],
};

const Register = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      role: '',
      organization_unit: '',
      school_name: '',
      zone: '',
      district: '',
      university_name: '',
      faculty_name: '',
      address: '',
      contact: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const password = watch('password');
  const organization_unit = watch('organization_unit');
  const university_name = watch('university_name');

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        alert('Registration successful! Please check your email.');
        navigate('/login');
      } else {
        setMessage(result.error || result.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (

     <div
      className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center bg-fixed py-4 sm:py-6 md:py-8 lg:py-8"
      style={{
        backgroundImage: "url('/Home_images/image2copy.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

     {/* Left Section */}
<div className="relative text-center lg:text-left px-6 sm:px-10 lg:px-16 z-10 mb-8 lg:mb-0 hidden lg:block">
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
    Join Our Community!
  </h1>
  <p className="text-md sm:text-lg text-emerald-400 mt-3">
    Create your account today and unlock amazing features.
  </p>
</div>


      {/* Right Section (Register Form) */}
      <div className="relative border-[3px] sm:border-[4px] lg:border-[5px] border-white bg-gray-900/80 p-6 sm:p-8 rounded-2xl shadow-xl w-full sm:w-11/12 md:w-3/4 lg:max-w-md z-10 mx-4 my-4 sm:mx-6 sm:my-6 md:mx-8 md:my-8 lg:mx-8 lg:my-8 max-h-screen overflow-y-auto">
        <h2 className="text-white text-center text-3xl sm:text-4xl font-semibold mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="mb-4 relative">
            <label htmlFor="fullname" className="text-white text-lg">Full Name</label>
            <div className="flex items-center mt-2">
              <BiUser className="absolute left-3 text-gray-400" size={20} />
              <Controller
                name="fullname"
                control={control}
                rules={{ required: 'Full name is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="fullname"
                    placeholder="Enter Full Name"
                    required
                    className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                  />
                )}
              />
            </div>
            {errors.fullname && <p className="text-red-400 text-sm mt-1">{errors.fullname.message}</p>}
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <label htmlFor="email" className="text-white text-lg">Email</label>
            <div className="flex items-center mt-2">
              <BiMailSend className="absolute left-3 text-gray-400" size={20} />
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    required
                    className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                  />
                )}
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="text-white text-lg">Password</label>
            <div className="relative mt-2">
              <BiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password too short' } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter Password"
                    required
                    className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                  />
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
            <PasswordStrengthBar password={password} />
          </div>

          {/* Role */}
          <div className="mb-4 relative">
            <label htmlFor="role" className="text-white text-lg">Role</label>
            <div className="flex items-center mt-2">
              <BiBook className="absolute left-3 text-gray-400" size={20} />
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="role"
                    required
                    className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                  >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="facilitator">Facilitator</option>
                    <option value="coordinator">Coordinator</option>
                  </select>
                )}
              />
            </div>
            {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>}
          </div>

          {/* Organization Unit */}
          <div className="mb-4 relative">
            <label htmlFor="organization_unit" className="text-white text-lg">Organization Unit</label>
            <div className="flex items-center mt-2">
              <BiBuilding className="absolute left-3 text-gray-400" size={20} />
              <Controller
                name="organization_unit"
                control={control}
                rules={{ required: 'Organization unit is required' }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="organization_unit"
                    required
                    className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                  >
                    <option value="">Select Organization Unit</option>
                    <option value="school">School</option>
                    <option value="university">University</option>
                  </select>
                )}
              />
            </div>
            {errors.organization_unit && <p className="text-red-400 text-sm mt-1">{errors.organization_unit.message}</p>}
          </div>

          {/* Conditional School Fields */}
          {organization_unit === 'school' && (
            <>
              <div className="mb-4 relative">
                <label htmlFor="school_name" className="text-white text-lg">School Name</label>
                <div className="flex items-center mt-2">
                  <BiBuilding className="absolute left-3 text-gray-400" size={20} />
                  <Controller
                    name="school_name"
                    control={control}
                    rules={{ required: 'School name is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="school_name"
                        placeholder="Enter School Name"
                        required
                        className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                      />
                    )}
                  />
                </div>
                {errors.school_name && <p className="text-red-400 text-sm mt-1">{errors.school_name.message}</p>}
              </div>
              <div className="mb-4 relative">
                <label htmlFor="zone" className="text-white text-lg">Zone</label>
                <div className="flex items-center mt-2">
                  <BiMap className="absolute left-3 text-gray-400" size={20} />
                  <Controller
                    name="zone"
                    control={control}
                    rules={{ required: 'Zone is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="zone"
                        placeholder="Enter Zone"
                        required
                        className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                      />
                    )}
                  />
                </div>
                {errors.zone && <p className="text-red-400 text-sm mt-1">{errors.zone.message}</p>}
              </div>
              <div className="mb-4 relative">
                <label htmlFor="district" className="text-white text-lg">District</label>
                <div className="flex items-center mt-2">
                  <BiMap className="absolute left-3 text-gray-400" size={20} />
                  <Controller
                    name="district"
                    control={control}
                    rules={{ required: 'District is required' }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="district"
                        placeholder="Enter District"
                        required
                        className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                      />
                    )}
                  />
                </div>
                {errors.district && <p className="text-red-400 text-sm mt-1">{errors.district.message}</p>}
              </div>
            </>
          )}

          {/* Conditional University Fields */}
          {organization_unit === 'university' && (
            <>
              <div className="mb-4 relative">
                <label htmlFor="university_name" className="text-white text-lg">University Name</label>
                <div className="flex items-center mt-2">
                  <BiBuilding className="absolute left-3 text-gray-400" size={20} />
                  <Controller
                    name="university_name"
                    control={control}
                    rules={{ required: 'University name is required' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="university_name"
                        required
                        className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                      >
                        <option value="">Select University</option>
                        {universities.map((uni) => <option key={uni} value={uni}>{uni}</option>)}
                      </select>
                    )}
                  />
                </div>
                {errors.university_name && <p className="text-red-400 text-sm mt-1">{errors.university_name.message}</p>}
              </div>
              <div className="mb-4 relative">
                <label htmlFor="faculty_name" className="text-white text-lg">Faculty Name</label>
                <div className="flex items-center mt-2">
                  <BiBook className="absolute left-3 text-gray-400" size={20} />
                  <Controller
                    name="faculty_name"
                    control={control}
                    rules={{ required: 'Faculty name is required' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="faculty_name"
                        required
                        disabled={!university_name}
                        className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                      >
                        <option value="">Select Faculty</option>
                        {(faculties[university_name] || []).map((fac) => <option key={fac} value={fac}>{fac}</option>)}
                      </select>
                    )}
                  />
                </div>
                {errors.faculty_name && <p className="text-red-400 text-sm mt-1">{errors.faculty_name.message}</p>}
              </div>
            </>
          )}

          {/* Address */}
          <div className="mb-4 relative">
            <label htmlFor="address" className="text-white text-lg">Address</label>
            <div className="flex items-center mt-2">
              <BiMap className="absolute left-3 text-gray-400" size={20} />
              <Controller
                name="address"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="address"
                    placeholder="Enter Address"
                    required
                    className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                  />
                )}
              />
            </div>
            {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>}
          </div>

          {/* Contact */}
          <div className="mb-6 relative">
            <label htmlFor="contact" className="text-white text-lg">Contact</label>
            <div className="flex items-center mt-2">
              <BiPhone className="absolute left-3 text-gray-400" size={20} />
              <Controller
                name="contact"
                control={control}
                rules={{ required: 'Contact is required', pattern: { value: /^[0-9]{10}$/, message: 'Contact must be 10 digits' } }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="contact"
                    placeholder="Enter Contact"
                    required
                    className="w-full p-3 pl-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 hover:bg-gray-700 hover:ring-2 hover:ring-emerald-500 hover:shadow-lg transition duration-300"
                  />
                )}
              />
            </div>
            {errors.contact && <p className="text-red-400 text-sm mt-1">{errors.contact.message}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 hover:shadow-lg"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>

          {/* Message */}
          {message && <p className={`text-center mt-4 ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}

          {/* Login link */}
          <p className="text-white text-center text-sm sm:text-md mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 font-semibold hover:underline transition"
            >
              Sign in here
            </Link>
          </p>
        </form>
      </div>

    </div>
  );
};

export default Register;
