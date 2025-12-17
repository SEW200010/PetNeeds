import React, { useState, useEffect } from "react";
import { FiEye } from "react-icons/fi";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function OrdersManagement() {
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      if (response.ok) {
        const data = await response.json();
        const formattedOrders = data.orders.map(order => ({
          id: order.id,
          date: order.date,
          items: `${order.items.length} item${order.items.length > 1 ? 's' : ''}`,
          total: `Rs. ${order.total.toFixed(2)}`,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          subscription: order.subscription,
          prescription: order.prescription,
        }));
        setOrders(formattedOrders);
      } else {
        console.error('Failed to fetch orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
    setLoading(false);
  };

  const statuses = ["Pending", "Confirmed", "Shipped", "Delivered"];

  // Filter orders based on search and status
  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "All Orders" || o.status === statusFilter)
  );

  return (
    <div>
      <Header />
      <div className="bg-gradient-to-b min-h-screen from-pink-50 to-white p-6">
        <div className="max-w-7xl mx-auto mt-12">
          <h1 className="text-3xl font-bold text-purple-700 mb-6">
            Orders Management
          </h1>

          {/* Search + Filter */}
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border rounded-xl shadow focus:ring focus:ring-purple-200"
            />

            <select
              className="p-3 border rounded-xl shadow"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Orders</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>

          {/* Orders Table */}
          <table className="w-full bg-white shadow rounded-xl overflow-hidden">
            <thead className="bg-black/20 text-left">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4">Subscription</th>
                <th className="p-4">Prescription</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((o, i) => (
                <tr key={i} className="border-b hover:bg-purple-50">
                  <td className="p-4">{o.id}</td>
                  <td className="p-4">{o.date}</td>
                  <td className="p-4">{o.items}</td>
                  <td className="p-4 font-semibold text-green-600">{o.total}</td>

                  {/* STATUS DROPDOWN */}
                  <td className="p-4">
                    <select
                      className="p-2 border rounded-lg bg-white shadow-sm"
                      defaultValue={o.status}
                    >
                      {statuses.map((s, idx) => (
                        <option key={idx}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Subscription */}
                  <td className="p-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {o.subscription}
                    </span>
                  </td>

                  {/* Prescription */}
                  <td className="p-4">{o.prescription}</td>

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
            Showing {filteredOrders.length} orders
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
