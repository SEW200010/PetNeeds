import React, { useEffect, useState } from "react";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import Header from "@/components/coordinator/CoordinatorHeader";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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
        const response = await fetch(`${API}/facilitators/${encodeURIComponent(university)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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
    { field: "fullname", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "faculty", headerName: "Faculty", flex: 1 },

    {
      field: "isVerified",
      headerName: "TOT completed",
      flex: 0.6,
      renderCell: (params) => {
        const currentVal = Boolean(params.row.isVerified);
        const id = params.row.id || params.row._id || params.row._id;
        return (
          <FormControl variant="standard" sx={{ minWidth: 150 }}>
            <Select
              value={currentVal ? "true" : "false"}
              input={<Input disableUnderline />}
              IconComponent={() => null}
              onChange={async (e) => {
                const newVal = e.target.value === "true";
                // Optimistic UI
                setFacilitators((prev) => prev.map((f) => (f.id === id ? { ...f, isVerified: newVal } : f)));
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(`${API}/facilitators/${encodeURIComponent(id)}/verify`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: token ? `Bearer ${token}` : "",
                    },
                    body: JSON.stringify({ isVerified: newVal }),
                  });
                  if (!res.ok) throw new Error(`Status ${res.status}`);
                } catch (err) {
                  console.error("Failed to update isVerified", err);
                  // revert UI
                  setFacilitators((prev) => prev.map((f) => (f.id === id ? { ...f, isVerified: !newVal } : f)));
                }
              }}
              sx={{ fontWeight: 700 }}
              renderValue={(selected) => (
                <span style={{ color: selected === "true" ? "#16a34a" : "#dc2626", fontWeight: 700 }}>
                  {selected === "true" ? "Verified" : "Not Verified"}
                </span>
              )}
            >
              <MenuItem value="true">Verified</MenuItem>
              <MenuItem value="false">Not Verified</MenuItem>
            </Select>
          </FormControl>
        );
      },
    },
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
                <DataGrid
                  rows={facilitators.map((f) => ({ ...f, id: f.id || f._id }))}
                  columns={columns}
                  pageSize={8}
                  disableSelectionOnClick
                />
              </div>
            )}
          </div>
        </div>
      </main>
      {/* No global snackbar used; status updates are reflected inline in the table */}
    </div>
  );
};

export default Facilitator;
