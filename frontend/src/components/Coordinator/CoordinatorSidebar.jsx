import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import {
  User,
  Calendar as CalendarIcon,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserImg from "@/assets/User/DefaultUser.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


const menuItems = [
  { icon: User, label: "Dashboard", path: "/coordinator-dashboard", hasChevron: true },
  { icon: User, label: "My Profile", path: "/profile", hasChevron: true },

  { icon: CalendarIcon, label: "Facilitator Verification", path: "/facilitator-verification", hasChevron: true },
  { icon: CalendarIcon, label: "Module Management", path: "/reports", hasChevron: true },
  { icon: CalendarIcon, label: "Faculty Information", path: "/reports", hasChevron: true },
  { icon: CalendarIcon, label: "Coordinator Reports", path: "/reports", hasChevron: true },
  { icon: Settings, label: "Settings", hasChevron: true },
  { icon: Bell, label: "Notification", hasChevron: false, action: "Allow" },
  { icon: LogOut, label: "Log Out", hasChevron: false },
];

export default function CoordinatorSidebar({ date, setDate, eventDates }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    zone: "",
    organization_unit: "",
    university_name:""
  });

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.user_id;

      axios
        .get(`${API}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) =>
          setUser({
            fullName: res.data.fullName,
            email: res.data.email,
            organization_unit: res.data.organization_unit || "",
            zone: res.data.zone || "",
            university_name: res.data.university_name || "" 
          })
        )
        .catch((err) => console.error("Failed to fetch user info", err));
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }, []);

  return (
    <main className="w-full md:w-1/4 bg-white shadow-lg border-r border-gray-200 rounded-xl">
      <div className="p-6">
        {/* User Profile */}
        <div className="flex items-center space-x-3 mb-8">
          <Avatar className="h-12 w-12">
            <AvatarImage src={UserImg} alt="User" />
            <AvatarFallback>
              {user.fullName ? user.fullName.slice(0, 2).toUpperCase() : "YN"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{user.fullName || "User"}</p>
            <p className="text-sm text-gray-500">{user.email || "user@example.com"}</p>
          </div>
        </div>

        {/* Coordinator Location Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-md font-semibold text-gray-800 flex items-center mb-2">
            <MapPin className="h-4 w-4 mr-2" /> Location Info
          </h3>
          <p className="text-sm text-gray-700"><strong>Organization Unit:</strong> {user.organization_unit || "N/A"}</p>
          <p className="text-sm text-gray-700"><strong>Zone:</strong> {user.zone ||user.university_name}</p>
        </div>

        {/* Sidebar Title */}
        <div className="text-xl font-bold mt-6 mb-6 text-gray-800">
          Coordinator Menu
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
                {item.action && (
                  <span className="text-sm text-gray-500">{item.action}</span>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Calendar Section */}
        {setDate && (
          <div className="mt-10 border border-gray-200 rounded-lg p-4">
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
        )}
      </div>
    </main>
  );
}
