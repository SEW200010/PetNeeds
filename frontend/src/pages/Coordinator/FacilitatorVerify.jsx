import React, { useEffect, useState } from "react";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import Header from "@/components/coordinator/CoordinatorHeader";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Facilitator = () => {
  const navigate = useNavigate();
  const [facilitators, setFacilitators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coordinatorName, setCoordinatorName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");
    const university = localStorage.getItem("university_name");

    if (!role || role !== "coordinator") {
      alert("Access denied. Only coordinators can access this page.");
      navigate("/login");
      return;
    }

    setCoordinatorName(name || "Coordinator");

    // 🧠 API Call
    const fetchFacilitators = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/facilitators/${encodeURIComponent(university)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("API error:", response.status);
          return;
        }

        const data = await response.json();
        console.log("Fetched facilitators:", data);
        setFacilitators(data.facilitators || []);
      } catch (error) {
        console.error("Error fetching facilitators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilitators();
  }, [navigate]);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "faculty", headerName: "Faculty", flex: 1 },
    { field: "verify", headerName: "Verified", flex: 1 },
  ];

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />
          <div className="w-full md:w-3/4 p-6">
            <h2 className="text-2xl font-bold mb-6">Facilitators</h2>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
              </Box>
            ) : (
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid rows={facilitators} columns={columns} pageSize={5} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Facilitator;
