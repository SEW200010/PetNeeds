import React, { useState } from "react";
import { FiEye } from "react-icons/fi";
import Footer from "../../components/Footer";
import Header from "../../components/Header"; 

export default function OrdersManagement() {
  const [statusFilter, setStatusFilter] = useState("All Orders");

  const orders = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      pets: "Dog",
      role: "User",
    },  
  ];


  return (
    <div>
    <Header />
      <div className="bg-gradient-to-b min-h-screen from-pink-50 to-white p-6">
      <div className="max-w-7xl mx-auto mt-12">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
        User Management
      </h1>
      <div className="flex justify-between items-center mb-18"></div>

  <div className="mb-6 mt-8">
        <input
          type="text"
          placeholder="Search products by name,or pet type..."
          className="w-full p-3 border rounded-xl shadow focus:ring focus:ring-purple-200"
        />
      </div>

      {/* Orders Table */}
      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-black/20 text-left">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Pets</th>
            <th className="p-4">Role</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((u, i) => (
            <tr key={i} className="border-b hover:bg-purple-50">
              <td className="p-4">{u.name}</td>
              <td className="p-4">{u.email}</td>
              <td className="p-4">{u.phone}</td>
              <td className="p-4">{u.pets}</td>
              <td className="p-4">{u.role}</td>
              {/* Actions */}
              <td className="p-4">
                <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                  <FiEye className="text-gray-700" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-center mt-4 text-gray-500">
        Showing {orders.length} orders
      </p>
      </div>
      </div>
      <Footer />
    </div>
  );
}
