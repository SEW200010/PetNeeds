import React, { useEffect, useState } from "react";
import FacilitatorSidebar from "@/components/Facilitator/FacilitatorSidebar";
import Header from "@/components/Facilitator/FacilitatorHeader";
import { useNavigate } from "react-router-dom";

const FacilitatorDashboard = () => {
  const navigate = useNavigate();
  const [facilitatorName, setFacilitatorName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    if (!role || role !== "facilitator") {
      alert("Access denied. Only facilitators can access this page.");
      navigate("/login");
      return;
    }

    setFacilitatorName(name || "Facilitator");
  }, [navigate]);

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <FacilitatorSidebar />
          <div className="w-full md:w-3/4 p-6">
            <div className="text-2xl font-bold pb-10">
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacilitatorDashboard;
