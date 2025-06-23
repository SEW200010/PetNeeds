// src/components/Admin/AdminSidebar.jsx
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import img from "../../assets/Admin/image.png";

const AdminSidebar = ({ date, setDate, eventDates }) => {
  return (
    <div className="w-full md:w-1/4 bg-white p-4 md:p-6 shadow-md">
      {/* Profile */}
      <div className="bg-gray-100 p-4 rounded-lg shadow mb-6 flex items-center">
        <img
          src={img}
          alt="Profile"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <p className="text-lg font-semibold text-gray-800">John Doe</p>
          <p className="text-sm text-gray-500">Admin</p>
        </div>
      </div>

      {/* Sidebar Menu */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Admin Menu</h2>
      <div className="border border-gray-300 rounded-lg p-4 space-y-2">
        {[
          { label: "🏠 Dashboard", href: "/admin-dashboard" },
          { label: "👤 User Management", href: "/user-management" },
          { label: "📅 Event Management", href: "/event-management" },
          { label: "🎓 Monitor Students", href: "/monitor-students" },
          { label: "🤖 Explore Model", href: "/explore-model" },
          { label: "💰 Manage Fundraising", href: "/fundraising" },
          { label: "📊 Monitor Sessions", href: "/monitor-sessions" },
          { label: "📝 Create Forms", href: "/create-forms" },
          { label: "⚙️ Settings", href: "/settings" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium"
          >
            {item.label}
          </a>
        ))}
      </div>

      {/* Calendar */}
      <div className="mt-6 border border-gray-300 rounded-lg p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3">📆 Upcoming Events</h2>
        <Calendar
          onChange={setDate}
          value={date}
          tileClassName={({ date: day, view }) =>
            view === "month" &&
            Array.isArray(eventDates) &&
            eventDates.find((d) => d.toDateString() === day.toDateString())
              ? "highlighted-day"
              : null
          }
        />
      </div>
    </div>
  );
};

export default AdminSidebar;
