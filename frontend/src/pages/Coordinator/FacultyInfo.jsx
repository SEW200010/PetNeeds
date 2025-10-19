import React, { useEffect, useState } from "react";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import Header from "@/components/coordinator/CoordinatorHeader";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FacultyForm from "@/components/Admin/FacultyForm";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { Visibility, Edit, Delete } from "@mui/icons-material";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FacultyInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [faculties, setFaculties] = useState([]);
  const [university, setUniversity] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const handleAdd = () => {
    setSelectedFaculty(null);
    setOpenForm(true);
  };

  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setOpenForm(true);
  };

  const handleEditEvent = (facultyId) => {
    // Find the full faculty object by id
    const faculty = faculties.find(f => f.id === facultyId);
    if (faculty) {
      setSelectedFaculty(faculty); // Pass full object including contact
      setOpenForm(true);
    }
  };


  // ✅ Role check
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


  // ✅ Fetch faculty list
  /*
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const token = localStorage.getItem("token");
        const organizationUnit = localStorage.getItem("organization_unit");
        const universityName = localStorage.getItem("university_name");
        const zone = localStorage.getItem("zone");

        if (!token || !organizationUnit) {
          console.warn("Missing token or organization unit, cannot fetch data.");
          setLoading(false);
          return;
        }

        let apiUrl = "";
        if (organizationUnit.toLowerCase() === "university") {
          apiUrl = `${API}/faculties/${encodeURIComponent(universityName)}`;
        } else if (organizationUnit.toLowerCase() === "school") {
          apiUrl = `${API}/schools/${encodeURIComponent(zone)}`;
        }

        const res = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        console.log("API Response:", data);

        if (!data.error && data.items) {
          setFaculties(data.items);
          setUniversity(data.university || "");
        } else {
          console.error("API returned error:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch faculties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

*/

  const fetchFaculties = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const organizationUnit = localStorage.getItem("organization_unit");
      const universityName = localStorage.getItem("university_name");
      const zone = localStorage.getItem("zone");

      if (!token || !organizationUnit) return;

      let apiUrl = "";
      if (organizationUnit.toLowerCase() === "university") {
        apiUrl = `${API}/faculties/${encodeURIComponent(universityName)}`;
      } else if (organizationUnit.toLowerCase() === "school") {
        apiUrl = `${API}/schools/${encodeURIComponent(zone)}`;
      }

      const res = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.error && data.items) {
        setFaculties(data.items);
        setUniversity(data.university || "");
      }
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
    } finally {
      setLoading(false);
    }
  };

  // call it on mount
  useEffect(() => {
    fetchFaculties();
  }, []);



  const handleDeleteEvent = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/faculties/${facultyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Faculty deleted successfully!");
        fetchFaculties(); // refresh table
      } else {
        throw new Error(data.error || "Failed to delete faculty");
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };


  // ✅ Define columns for MUI DataGrid
  const columns = [
    { field: "faculty_name", headerName: "Faculty Name", flex: 1 },
    { field: "dean", headerName: "Dean", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" size="small" onClick={() => handleViewEvent(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton
            color="secondary"
            size="small"
            onClick={() => handleEditEvent(params.row.id)} // pass id
          >
            <Edit />
          </IconButton>

          <IconButton color="error" size="small" onClick={() => handleDeleteEvent(params.row.id)}>
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // ✅ Prepare rows
  const rows = faculties.map((faculty, index) => ({
    id: faculty.id || index + 1,
    faculty_name: faculty.faculty_name || "N/A",
    dean: faculty.dean || "N/A",
    email: faculty.contact?.email || "N/A",
    phone: faculty.contact?.phone || "N/A",
  }));



  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />
          <div className="w-full md:w-3/4 p-6">
            <h2 className="text-2xl font-bold mb-4">
              Faculties — {university || "Loading..."}
            </h2>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
              </Box>
            ) : (
              <div style={{ height: 450, width: "100%" }}>
                <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
                  Add Faculty
                </Button>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10]}
                  disableRowSelectionOnClick
                />
              </div>
            )}
          </div>
          <FacultyForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            onSubmit={() => fetchFaculties()} // re-fetch after add/edit
            initialData={selectedFaculty}
            universityName={university}
          />

        </div>
      </main>
    </div>
  );
};

export default FacultyInfo;
