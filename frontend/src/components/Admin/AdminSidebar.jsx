// src/components/Admin/AdminSidebar.jsx
import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import {
  User,
  Settings,
  Calendar as CalendarIcon,
  Users,
  GraduationCap,
  Bot,
  DollarSign,
  BarChart3,
  ChevronRight,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import img from "../../assets/Admin/image.png";

// Menu Items for Admin
const menuItems = [
  { icon: User, label: "Dashboard", path: "/admin-dashboard", hasChevron: true },
  { icon: Users, label: "User Management", path: "/user-management", hasChevron: true },
  { icon: CalendarIcon, label: "Event Management", path: "/event-management", hasChevron: true },
  { icon: GraduationCap, label: "Monitor Students", path: "/monitor-students", hasChevron: true },
  { icon: Bot, label: "Explore Model", path: "/explore-model", hasChevron: true },
  { icon: DollarSign, label: "Manage Fundraising", path: "/fundraising", hasChevron: true },
  { icon: BarChart3, label: "Monitor Sessions", path: "/monitor-sessions", hasChevron: true },
  { icon: Settings, label: "Settings", path: "/settings", hasChevron: true },
];

const AdminSidebar = ({ date, setDate, eventDates }) => {
  const navigate = useNavigate();

  return (
    <main className="w-full md:w-1/4 bg-white shadow-lg border-r border-gray-200 rounded-xl">
      <div className="p-6">
        {/* Profile Section */}
        <div className="flex items-center space-x-3 mb-8">
          <Avatar className="h-12 w-12">
            <AvatarImage src={img} alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">Admin</p>
            <p className="text-sm text-gray-500">admin@admin.com</p>
          </div>
        </div>

        {/* Sidebar Title */}
        <div className="text-xl font-bold mt-6 mb-6 text-gray-800">
          Admin Menu
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-between text-left font-normal text-gray-700 hover:bg-gray-50"
                onClick={() => item.path && navigate(item.path)}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.hasChevron && <ChevronRight className="h-4 w-4" />}
              </Button>
            );
          })}
        </nav>

        {/* Calendar Section */}
        <div className="mt-10 border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            📆 Upcoming Events
          </h2>
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
    </main>
  );
};

export default AdminSidebar;
