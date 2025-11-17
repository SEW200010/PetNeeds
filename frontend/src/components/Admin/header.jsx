import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logoNew.png";
import { Menu as MenuIcon, LogOut as LogOutIcon } from "lucide-react";
import { logout } from "../../lib/utils";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";

const CoordinatorHeader = ({ title = "Admin" }) => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example: 3 unread notifications

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Example: handle notifications click
  const handleNotificationsClick = () => {
    alert("Opening notifications panel...");
    // You can open a dropdown or side panel here
    setNotifications(0); // Reset after viewing
  };

  return (
    <header
      className={`shadow-md fixed top-0 left-0 w-full z-50 ${hasScrolled ? "bg-white/90 backdrop-blur-md" : "bg-white"}`}
    >
      <div className="container mx-auto flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-md bg-gray-100"
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-coordinator-sidebar'))}
            aria-label="Open sidebar"
          >
            <MenuIcon className="h-5 w-5 text-gray-700" />
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8" />
            <span className="text-lg font-semibold text-gray-800">{title}</span>
          </Link>
        </div>

         <div className="hidden md:flex items-center gap-4">
          {/* 🔔 Notification Icon with Badge */}
          <button
            onClick={handleNotificationsClick}
            className="relative p-2 rounded-md hover:bg-gray-100"
            aria-label="Notifications"
          >
            <Badge
              badgeContent={notifications}
              color="error"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.7rem",
                  height: 18,
                  minWidth: 18,
                },
              }}
            >
              <NotificationsIcon className="text-gray-700" />
            </Badge>
          </button>
          

        <div className="hidden md:flex items-center gap-3">
          {/* Logout button */}
          <button
            className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100"
            onClick={() => logout('/')}
            aria-label="Logout"
            title="Logout"
          >
            <LogOutIcon className="h-4 w-4 text-gray-700" />
            <span className="text-sm text-gray-700">Logout</span>
          </button>
        </div>
</div>
      </div>
    </header>
  );
};

export default CoordinatorHeader;
