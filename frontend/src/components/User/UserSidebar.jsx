import { useEffect, useState, useRef } from "react";
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
  { icon: User, label: "Dashboard", path: "/upcoming-events", hasChevron: true },
  { icon: User, label: "My Profile", hasChevron: true, path: "/profile" },
  { icon: CalendarIcon, label: "My Events", path: "/my-events", hasChevron: true },
  { icon: Settings, label: "Settings", hasChevron: true },
  { icon: Bell, label: "Notification", hasChevron: false, action: "Allow" },
  { icon: LogOut, label: "Log Out", path: "/",hasChevron: false },
];

export default function CoordinatorSidebar({ date = new Date(), setDate = () => { } }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeBtnRef = useRef(null);
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    zone: "",
    organization_unit: "",
    university_name: ""
  });
  const [events, setEvents] = useState([]); // store event objects with title & date
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Fetch user info and events
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.user_id;

      // Fetch user info
      axios.get(`${API}/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUser({
          fullname: res.data.fullname,
          email: res.data.email,
          organization_unit: res.data.organization_unit || "",
          zone: res.data.zone || "",
          university_name: res.data.university_name || ""
        }))
        .catch(err => console.error("Failed to fetch user info", err));

      // Fetch events
      axios.get(`${API}/upcoming-events`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => {
          const eventData = res.data.map(e => ({
            date: new Date(e.date),
            title: e.title || "Event"
          }));
          setEvents(eventData);
        })
        .catch(err => console.error("Failed to fetch events", err));
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }, []);

  // Mobile toggle
  useEffect(() => {
    const onToggle = () => setMobileOpen(v => !v);
    window.addEventListener("toggle-coordinator-sidebar", onToggle);
    return () => window.removeEventListener("toggle-coordinator-sidebar", onToggle);
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setMobileOpen(false); };
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
        <div onClick={() => navigate("/profile")} className="cursor-pointer">
          <Avatar className="h-12 w-12 hover:scale-105 transition-transform">
            <AvatarImage src={UserImg} alt="User" />
            <AvatarFallback>{user.fullname?.slice(0,2).toUpperCase() || "YN"}</AvatarFallback>
          </Avatar>
        </div>

        <div>
          <p className="font-medium text-gray-900">{user.fullname || "User"}</p>
          <p className="text-sm text-gray-500">{user.email || "user@example.com"}</p>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="text-md font-semibold text-gray-800 flex items-center mb-2">
          <MapPin className="h-4 w-4 mr-2" /> Location Info
        </h3>
        <p className="text-sm text-gray-700"><strong>Organization Unit:</strong> {user.organization_unit || "N/A"}</p>
        <p className="text-sm text-gray-700"><strong>Zone:</strong> {user.zone || user.university_name}</p>
      </div>

      {/* Menu */}
      <div className="text-xl font-bold mt-6 mb-6 text-gray-800">User Menu</div>
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-between text-left font-normal text-gray-700 hover:bg-gray-50"
              onClick={() => { item.path && navigate(item.path); setMobileOpen(false); }}
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

      {/* Calendar */}
      <div className="mt-10 border border-gray-200 rounded-lg p-4">
        <h2 className="text-lg  text-gray-800 mb-3"> Upcoming Events</h2>
        <Calendar
          onChange={setDate}
          value={date}
          formatShortWeekday={(locale, date) => {
            const day = date.getDay();
            const shortDays = ["S", "M", "T", "W", "T", "F", "S"];
            return shortDays[day];
          }}
          tileClassName={({ date: day, view }) => {
            if (view === "month") {
              if (day.toDateString() === new Date().toDateString()) return "today-circle";
              if (events.find(e => e.date.toDateString() === day.toDateString())) return "event-circle";
            }
          }}
        />

      </div>

      {/* Calendar styles */}
      <style>{`
        .react-calendar {
          border: none;
          font-family: "Roboto", "Helvetica", "Arial", sans-serif;
          width: 100%;
        }
        .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none !important; /* remove underline */
        }

          /* Today */
  .today-circle {
    background-color: #bbdefb !important; /* light blue */
    color: #0d47a1 !important;           /* dark blue text */
  }

  /* Event date */
  .event-circle {
    background-color: #1976d2 !important; /* primary blue */
    color: white !important;
  }

  /* All day tiles */
  .react-calendar__tile {
    border: none;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    line-height: 40px;
    margin: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    transition: transform 0.2s, background 0.2s;
  }

        .react-calendar__navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .react-calendar__navigation button {
          background: none;
          border: none;
          color: #1976d2;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .react-calendar__navigation button:hover {
          background-color: #e3f2fd;
        }

        /* Weekdays */
        .react-calendar__month-view__weekdays {
          display: flex;
          justify-content: space-around;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 4px;
        }
        .react-calendar__month-view__weekdays__weekday {
          text-align: center;
          text-transform: uppercase;
          font-weight: 500;
          color: #616161;
          width: 40px;
        }

       
        .react-calendar__tile:hover {
          background-color: #e3f2fd;
          cursor: pointer;
          transform: scale(1.05);
        }


        .react-calendar__tile:disabled {
          background-color: #f5f5f5;
          color: #bdbdbd;
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-full md:w-1/4 bg-white shadow-lg border-r border-gray-200 rounded-xl">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-80 max-w-full h-full bg-white shadow-xl overflow-auto">
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <div className="text-lg font-semibold">User Menu</div>
              <button ref={closeBtnRef} className="p-2" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
