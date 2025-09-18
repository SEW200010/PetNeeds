import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    user_type: 'student'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const result = await res.json();
        alert(result.message);
        // Redirect based on user type
        if (formData.user_type === 'admin') {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };*/

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      const result = await res.json();
      alert(result.message);
      // Redirect user to login page after successful registration
      navigate("/login");
    } else {
      alert("Registration failed");
    }
  } catch (err) {
    console.error("Error:", err);
  }
};

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen pt-28 px-4 flex justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-[#27987A] mb-6">Register</h2>

          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border rounded"
          />

          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border rounded"
          />

          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border rounded"
          />

          <label className="block mb-2 font-medium">User Type</label>
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-6 border rounded"
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full py-2 bg-[#27987A] text-white rounded hover:bg-[#1d6f5b] transition"
          >
            Register
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;
