import React, { useEffect, useState } from "react";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import CoordinatorActionCards from "@/components/Coordinator/CoordinatorActionCard";
import Header from "@/components/Coordinator/CoordinatorHeader";
import { useNavigate } from "react-router-dom";

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const [coordinatorName, setCoordinatorName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (!role || role !== "coordinator") {
      alert("Access denied. Only coordinators can access this page.");
      navigate("/login");
      return;
    }

    setCoordinatorName(name || "Coordinator");
  }, [navigate]);

  return (
    <div>
      <Header />
      <main className="bg-gray-50 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />
          <div className="w-full md:w-3/4 p-6">

            <h2 className="text-2xl font-bold mb-6">Welcome, {coordinatorName} </h2>

            <CoordinatorActionCards />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorDashboard;
