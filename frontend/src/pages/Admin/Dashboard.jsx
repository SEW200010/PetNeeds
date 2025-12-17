import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { BiShoppingBag } from "react-icons/bi";
import { AiOutlineDollar } from "react-icons/ai";
import { FiPackage } from "react-icons/fi";
import { MdOutlineMedicalServices } from "react-icons/md";

const stats = [
  {
    id: 1,
    title: "Total Orders",
    value: "237",
    subtitle: "+12% from last week",
    icon: <BiShoppingBag size={48} className="text-white" />,
    bg: "from-blue-400 to-blue-600",
  },
  {
    id: 2,
    title: "Total Revenue",
    value: "$11.9K",
    subtitle: "+18% from last week",
    icon: <AiOutlineDollar size={48} className="text-white" />,
    bg: "from-green-400 to-green-600",
  },
  {
    id: 3,
    title: "Pending Prescriptions",
    value: "8",
    subtitle: "Review Now",
    icon: <MdOutlineMedicalServices size={48} className="text-white" />,
    bg: "from-orange-400 to-orange-500",
  },
  {
    id: 4,
    title: "Low Stock Alerts",
    value: "12",
    subtitle: "Manage Stock",
    icon: <FiPackage size={48} className="text-white" />,
    bg: "from-purple-400 to-purple-600",
  },
];

const weeklyOrders = [
  { day: "Mon", orders: 20 },
  { day: "Tue", orders: 15 },
  { day: "Wed", orders: 30 },
  { day: "Thu", orders: 25 },
  { day: "Fri", orders: 45 },
  { day: "Sat", orders: 55 },
  { day: "Sun", orders: 35 },
];

const revenueTrend = [
  { day: "Mon", revenue: 1300 },
  { day: "Tue", revenue: 900 },
  { day: "Wed", revenue: 1600 },
  { day: "Thu", revenue: 1400 },
  { day: "Fri", revenue: 2200 },
  { day: "Sat", revenue: 2600 },
  { day: "Sun", revenue: 2000 },
];

const topProducts = [
  { rank: 1, name: "Premium Dog Food 5kg", sales: "145 units", revenue: "$7245.55" },
  { rank: 2, name: "Cat Scratching Post", sales: "98 units", revenue: "$4405.02" },
  { rank: 3, name: "Interactive Cat Toys", sales: "87 units", revenue: "$1739.13" },
];

export default function AdminDashboard() {
  return (
    <div>
      <Header />
      <div className="bg-gradient-to-b min-h-screen from-pink-50 to-white p-6">
        <div className="max-w-7xl mx-auto mt-12">
          {/* Statistic cards */}
          <h1 className="text-3xl font-bold text-purple-700 mb-8">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((s) => (
              <div
                key={s.id}
                className={`rounded-xl h-[280px] w-full p-6 bg-gradient-to-r ${s.bg} shadow-lg text-white flex flex-col justify-between hover:scale-90`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-4xl opacity-90">{s.title}</div>
                  <div className="opacity-80">{s.icon}</div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div className="text-3xl font-bold">{s.value}</div>
                  <div className="text-2s bg-white/20 px-3 py-1 rounded-full">{s.subtitle}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/10 rounded-xl shadow p-6">
              <h3 className="text-xl font-medium text-purple-800 mb-4">Weekly Orders</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyOrders}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl shadow p-6 bg-black/10">
              <h3 className="text-xl font-medium text-purple-800 mb-4">Revenue Trend</h3>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#E11D48"
                      dot={{ r: 4 }}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top selling products */}
          <div className="w-full flex justify-center mb-8">
            <div className="md:w-[100%] bg-black/10 p-14 rounded-xl shadow">
              <h3 className="text-xl font-medium text-purple-800">Top Selling Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="text-lg text-gray-500 border-b">
                      <th className="py-3">Rank</th>
                      <th className="py-3">Product Name</th>
                      <th className="py-3">Sales</th>
                      <th className="py-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((p) => (
                      <tr key={p.rank} className="hover:bg-gray-50">
                        <td className="py-4 text-lg">{p.rank}</td>
                        <td className="py-4 text-lg">{p.name}</td>
                        <td className="py-4 text-lg">{p.sales}</td>
                        <td className="py-4 text-lg text-green-600">{p.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
