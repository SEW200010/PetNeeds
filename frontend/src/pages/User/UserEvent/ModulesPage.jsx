import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../components/User/UserHeader";
import UserSidebar from "../../../components/User/UserSidebar";
import { Button } from "../../../components/ui/button";
import { jwtDecode } from "jwt-decode";

export default function ModulesPage() {
  const { eventId } = useParams(); // from /modules/:event_id
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // Get token and userId
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = localStorage.getItem("userId") || decoded?.sub;

  if (!userId) console.error("User ID not found. Please log in.");

  // Fetch modules with enrollment status
  useEffect(() => {
    const fetchModules = async () => {
      if (!userId) return;

      try {
        // Backend already marks modules as enrolled
        const res = await axios.get(`${API}/get-modules/${eventId}`, {
          params: { user_id: userId },
        });

        setModules(res.data.modules || []);
      } catch (err) {
        console.error("Failed to fetch modules:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [eventId, userId]);

  // Handle enrollment
  const handleEnroll = async (module) => {
    const enteredKey = prompt(`Enter enrollment key for ${module.moduleName}:`);
    if (!enteredKey) return;

    try {
      const res = await axios.post(`${API}/enroll-module`, {
        user_id: userId,
        event_id: eventId,
        moduleName: module.moduleName,
        enrollmentKey: enteredKey,
      });

      if (res.data.message === "Enrolled successfully") {
        // Update module's enrolled status locally
        setModules((prevModules) =>
          prevModules.map((m) =>
            m.moduleName === module.moduleName ? { ...m, enrolled: true } : m
          )
        );
        alert(`✅ Successfully enrolled in ${module.moduleName}`);
      } else {
        alert(res.data.message || "❌ Invalid enrollment key");
      }
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Enrollment failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading modules...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <UserSidebar />
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">
              Modules for Event
            </h2>

            {modules.length === 0 ? (
              <p className="text-gray-500">No modules available for this event.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {modules.map((module) => (
                  <div
                    key={module._id || module.moduleName}
                    className="bg-white shadow-md rounded-xl p-4 text-center border border-purple-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {module.moduleName}
                    </h3>

                    {module.enrolled ? (
                      <Button
                        size="sm"
                        className="bg-purple-600 text-white w-full cursor-not-allowed"
                        disabled
                      >
                        ✅ Enrolled
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-purple-500 hover:bg-purple-600 text-white w-full"
                        onClick={() => handleEnroll(module)}
                      >
                        Enroll
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
