import {
  User,
  Calendar,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import UserImg from "@/assets/User/DefaultUser.png"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";


const menuItems = [
  { icon: User, label: "My Profile", hasChevron: true ,path:"/profile"},
  { icon: Calendar, label: "My Events", hasChevron: true },
  { icon: Settings, label: "Settings", hasChevron: true },
  { icon: Bell, label: "Notification", hasChevron: false, action: "Allow" },
  { icon: LogOut, label: "Log Out", hasChevron: false },
];

export default function UserSidebar() {

  const navigate = useNavigate();

  const [user, setUser] = useState({ fullName: "", email: "" });
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.user_id;

      // Fetch user info from backend
      axios
        .get(`${API}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) =>
          setUser({ fullName: res.data.fullName, email: res.data.email })
        )
        .catch((err) => console.error("Failed to fetch user info", err));
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }, []);

  return (
    <aside className="w-72 bg-white shadow-lg border-r border-gray-200 rounded-xl p-2 h-88 mx-auto">
      <div className="p-6">
        {/* User Profile Section */}
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 mb-8">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`${UserImg}?height=48&width=48`} alt="User" />
            <AvatarFallback>
              {user.fullName ? user.fullName.slice(0, 2).toUpperCase() : "YN"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
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
      </div>
    </aside>
  );
}