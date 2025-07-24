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

const menuItems = [
  { icon: User, label: "My Profile", hasChevron: true },
  { icon: Calendar, label: "My Events", hasChevron: true },
  { icon: Settings, label: "Settings", hasChevron: true },
  { icon: Bell, label: "Notification", hasChevron: false, action: "Allow" },
  { icon: LogOut, label: "Log Out", hasChevron: false },
];

export default function TeacherSidebar() {
  return (
    <aside className="w-72 bg-white shadow-lg border-r border-gray-200 rounded-xl p-2 h-88 mx-auto">
      <div className="p-6">
        {/* User Profile Section */}
        <div className="flex items-center space-x-3 mb-8">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`${UserImg}?height=48&width=48`} alt="User" />
            <AvatarFallback>YN</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900"> name</p>
            <p className="text-sm text-gray-500">yourname@gmail.com</p>
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
