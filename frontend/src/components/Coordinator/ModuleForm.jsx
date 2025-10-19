import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ModuleForm = ({ open, onClose, onSubmit, initialData = null }) => {
  const isEditMode = Boolean(initialData);

  const [moduleName, setModuleName] = useState("");
  const [documents, setDocuments] = useState([]); // newly selected files
  const [existingDocs, setExistingDocs] = useState([]); // already uploaded docs
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode && initialData) {
      setModuleName(initialData.module_name || "");
      setExistingDocs(initialData.documents || []);
      setDocuments([]); // clear new uploads
    } else {
      setModuleName("");
      setExistingDocs([]);
      setDocuments([]);
    }
    setError("");
  }, [initialData, open]);

  const handleFileChange = (e) => {
    setDocuments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!moduleName.trim()) {
      setError("Module name is required");
      return;
    }

    const formData = new FormData();
    formData.append("module_name", moduleName);
    documents.forEach((file) => formData.append("documents", file));

    console.log("📦 FormData to send:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const token = localStorage.getItem("token");
      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode
        ? `${API}/modules/${initialData._id || initialData.id}`
        : `${API}/modules/add`;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save module");

      alert(data.message || "Module saved successfully");

      // ✅ Trigger re-fetch in parent + refresh
      onSubmit?.();
      onClose();

      // ✅ Auto reload to reflect new module instantly
      window.location.reload();
    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? "Edit Module" : "Add Module"}</DialogTitle>

      <DialogContent dividers>
        <TextField
          label="Module Name"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Typography sx={{ mt: 2, fontWeight: "bold" }}>Upload Files:</Typography>
        <input type="file" multiple onChange={handleFileChange} />

        {/* Existing Documents (edit mode) */}
        {isEditMode && existingDocs.length > 0 && (
          <>
            <Typography sx={{ mt: 2, fontWeight: "bold" }}>
              Existing Documents:
            </Typography>
            <ul>
              {existingDocs.map((doc, i) => (
                <li key={i}>
                  <a
                    href={`${API}${doc.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Newly selected files */}
        {documents.length > 0 && (
          <>
            <Typography sx={{ mt: 2, fontWeight: "bold" }}>
              Files to Upload:
            </Typography>
            <ul>
              {documents.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          </>
        )}

        {error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditMode ? "Update Module" : "Add Module"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModuleForm;
