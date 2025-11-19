
import { useEffect, useState, useRef } from "react";
import { logout } from "@/lib/utils";
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
  CheckSquare,
  BookOpen,
  FileText,
  Home,
  University,Users,
  GraduationCap,
  Bot,
  DollarSign,
  BarChart3,
  
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserImg from "@/assets/User/DefaultUser.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


// Menu Items for Admin
const menuItems = [
  { icon: User, label: "Dashboard", path: "/admin-dashboard", hasChevron: true },
  { icon: Users, label: "User Management", path: "/user-management", hasChevron: true },
  { icon: CalendarIcon, label: "Event Management", path: "/event-management", hasChevron: true },
  { icon: GraduationCap, label: "Reports", path: "/monitor-students", hasChevron: true },
  { icon: Bot, label: "Explore Model", path: "/explore-model", hasChevron: true },
  { icon: DollarSign, label: "Manage Fundraising", path: "/fundraising", hasChevron: true },
  { icon: BarChart3, label: "TOT Sessions", path: "/monitor-sessions", hasChevron: true },
  { icon: Settings, label: "Settings", path: "/settings", hasChevron: true },
  { icon: LogOut, label: "Log Out", action: "logout", hasChevron: false },
];

export default function AdminSidebar({ date, setDate, eventDates }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeBtnRef = useRef(null);
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
            fullName: res.data.fullname,
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

  // Listen for header toggle to open/close sidebar on mobile
  useEffect(() => {
    const onToggle = () => setMobileOpen((v) => !v);
    window.addEventListener("toggle-coordinator-sidebar", onToggle);
    return () => window.removeEventListener("toggle-coordinator-sidebar", onToggle);
  }, []);

  // close on escape and lock scroll when open
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false); };
    if (mobileOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      setTimeout(() => closeBtnRef.current?.focus(), 50);
    } else {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    }
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const SidebarContent = () => (
    <div className="p-6 w-full">
      {/* User Profile */}
      <div className="flex items-center space-x-3 mb-8">
        <Avatar className="h-12 w-12">
          <AvatarImage src={UserImg} alt="User" />
          <AvatarFallback>
            {user.fullName ? user.fullName.slice(0, 2).toUpperCase() : "YN"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-900">{user.fullName || "Admin"}</p>
          <p className="text-sm text-gray-500">{user.email || "admin@admin.com"}</p>
        </div>
      </div>

     

      {/* Sidebar Title */}
      <div className="text-xl font-bold mt-6 mb-6 text-gray-800">Admin Menu</div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between text-left font-normal text-gray-700 hover:bg-gray-50"
              onClick={() => {
                if (item.action === "logout") {
                  logout();
                } else if (item.path) {
                  navigate(item.path);
                  setMobileOpen(false);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
              {item.hasChevron && <ChevronRight className="h-4 w-4" />}
              {item.action && <span className="text-sm text-gray-500">{item.action}</span>}
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
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-full md:w-1/4 bg-white shadow-lg border-r border-gray-200 rounded-xl">
        <SidebarContent />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-80 max-w-full h-full bg-white shadow-xl overflow-auto">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <div className="text-lg font-semibold">Admin Menu</div>
              <button ref={closeBtnRef} className="p-2" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
