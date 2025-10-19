import React, { useEffect, useState } from "react";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import Header from "@/components/coordinator/CoordinatorHeader";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { Edit, Delete } from "@mui/icons-material";
import ModuleForm from "@/components/Coordinator/ModuleForm";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ModuleInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  // ✅ Fetch modules
  const fetchModules = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/modules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.error && data.items) setModules(data.items);
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleAdd = () => {
    setSelectedModule(null);
    setOpenForm(true);
  };
  const handleEdit = (module) => {
    setSelectedModule(module);
    setOpenForm(true);
  };
  const handleDelete = async (moduleId) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/modules/${moduleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) fetchModules();
      else throw new Error(data.error || "Failed to delete module");
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { field: "module_name", headerName: "Module Name", flex: 1 },
    {
      field: "documents",
      headerName: "Documents",
      flex: 2,
      renderCell: (params) => (
        <ul>
          {params.value?.map((doc, i) => (
            <li key={i}>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                {doc.name || `Document ${i + 1}`}
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="secondary" size="small" onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const rows = modules.map((mod, idx) => ({
    id: mod.id || idx + 1,
    module_name: mod.module_name,
    documents: mod.documents || [],
  }));

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />
          <div className="w-full md:w-3/4 p-6">
            <h2 className="text-2xl font-bold mb-4">Modules</h2>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
              </Box>
            ) : (
              <div style={{ height: 450, width: "100%" }}>
                <Button variant="contained" onClick={handleAdd} sx={{ mb: 2 }}>
                  Add Module
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
          <ModuleForm
            open={openForm}
            onClose={() => setOpenForm(false)}
            onSubmit={fetchModules}
            initialData={selectedModule}
          />
        </div>
      </main>
    </div>
  );
};

export default ModuleInfo;
