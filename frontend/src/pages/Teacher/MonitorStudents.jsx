import React, { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import TeacherSidebar from "../../components/Teacher/TeacherSidebar";
import StickyHeadTable from "../../components/Admin/StickyHeadTable";
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

/* tiny helper to draw progress bar */
const ProgressBar = ({ pct }) => (
  <Box display="flex" alignItems="center" gap={1} minWidth={150}>
    <Typography sx={{ minWidth: 30, fontWeight: 500 }}>{pct}%</Typography>
    <Box sx={{ flex: 1, height: 10, backgroundColor: "#e0e0e0", borderRadius: 5 }}>
      <Box
        sx={{
          width: `${pct}%`,
          height: "100%",
          backgroundColor: "#4caf50",
          borderRadius: 5,
        }}
      />
    </Box>
  </Box>
);

const MonitorStudentPage = () => {
  const navigate = useNavigate();
  const [supervisor, setSupervisor] = useState('');
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // form state
  const [name, setName] = useState('');
  const [unid, setUnid] = useState('');
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(0);

  // get logged-in teacher
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "teacher-in-charge") {
        alert("Access denied. Only teachers in charge can access this page.");
        navigate("/login");
        return;
      }
      setSupervisor(decoded.name || decoded.username || decoded.email);
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login");
    }
  }, [navigate]);

  // fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/monitoringstudents');
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudents();
  }, []);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStudent = { name, unid, email, progress: Number(progress), supervisor };

    try {
      const res = await fetch('http://localhost:5000/api/monitoringstudents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });

      if (!res.ok) throw new Error('Failed to add student');

      const savedStudent = await res.json();
      setStudents([...students, savedStudent]);

      // reset form
      setName(''); setUnid(''); setEmail(''); setProgress(0); setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Error adding student');
    }
  };

  // prepare rows for table
  const filteredRows = useMemo(() => 
    students
      .filter(s => s.supervisor === supervisor)
      .map((s, idx) => ({
        id: s._id || idx,
        count: idx + 1,
        name: s.name,
        unid: s.unid,
        email: s.email,
        progress: s.progress,
        supervisor: s.supervisor
      }))
  , [students, supervisor]);

  // columns for StickyHeadTable
  const columns = [
    { id: 'count', label: '#', align: 'center' },
    { id: 'name', label: 'Name' },
    { id: 'unid', label: 'University ID' },
    { id: 'email', label: 'Email' },
    { id: 'progress', label: 'Progress', align: 'center', render: (v) => <ProgressBar pct={v} /> },
    { id: 'supervisor', label: 'Supervisor' },
  ];

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <TeacherSidebar />

          <div className="w-full md:w-3/4 p-6">
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Monitored Students (Supervisor: {supervisor})
              </Typography>

              <Button variant="contained" color="primary" sx={{ mb: 3 }}
                onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Add New Student"}
              </Button>

              {showForm && (
                <Box component="form" onSubmit={handleSubmit} sx={{ display:'flex', flexDirection:'column', gap:2, maxWidth:600, mb:4 }}>
                  <TextField label="Full Name" value={name} onChange={e=>setName(e.target.value)} required fullWidth />
                  <TextField label="University ID" value={unid} onChange={e=>setUnid(e.target.value)} required fullWidth />
                  <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} required fullWidth />
                  <TextField label="Progress (%)" type="number" value={progress} onChange={e=>setProgress(e.target.value)} fullWidth />
                  <TextField label="Supervisor" value={supervisor} InputProps={{ readOnly:true }} fullWidth />
                  <Button type="submit" variant="contained" color="success">Save Student</Button>
                </Box>
              )}

              {/* table */}
              <StickyHeadTable rows={filteredRows} columns={columns} />
            </Box>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MonitorStudentPage;
