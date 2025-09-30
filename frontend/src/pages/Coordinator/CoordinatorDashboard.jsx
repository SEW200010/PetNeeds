import React, { useEffect, useState } from "react";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import CoordinatorActionCards from "@/components/Coordinator/CoordinatorActionCard";
import Header from "@/components/Admin/Header";
import { useNavigate } from "react-router-dom";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [coordinatorName, setCoordinatorName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (!role || role !== "coordination") {
      alert("Access denied. Only coordinators can access this page.");
      navigate("/login");
      return;
    }

    setCoordinatorName(name || "Coordinator");
  }, [navigate]);

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />
          <div className="w-full md:w-3/4 p-6">
            <div className="text-2xl font-bold pb-10">
              Welcome, {coordinatorName}!
            </div>
           <CoordinatorActionCards/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorDashboard;
