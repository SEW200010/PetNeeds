import { useState } from "react";
import Header from "../../../components/Header";
import UserSidebar from "../../../components/User/UserSidebar";
import { Button } from "../../../components/ui/button";

export default function ModulesPage() {
  const [enrolledModules, setEnrolledModules] = useState([]);

  // Create 16 modules dynamically
  const modules = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    name: `Module ${i + 1}`,
    key: `key${i + 1}`, // ✅ Example enrollment key, replace with backend check later
  }));

  const handleEnroll = (module) => {
    const enteredKey = prompt(`Enter enrollment key for ${module.name}:`);
    if (enteredKey === module.key) {
      setEnrolledModules((prev) => [...prev, module.id]);
      alert(`✅ Successfully enrolled in ${module.name}`);
    } else {
      alert("❌ Invalid enrollment key");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <UserSidebar />
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold text-purple-700 mb-6">Modules</h2>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white shadow-md rounded-xl p-4 text-center border border-purple-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {module.name}
                  </h3>

                  {enrolledModules.includes(module.id) ? (
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
          </div>
        </div>
      </main>
    </div>
  );
}
