import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const MonitorStudentPage = () => {
  const navigate = useNavigate();
  const [supervisor, setSupervisor] = useState('');
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [unid, setUnid] = useState('');
  const [email, setEmail] = useState('');
  const [progress, setProgress] = useState(0);

  // ✅ Get logged-in teacher from JWT
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

  // Fetch students on page load
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

  // Handle form submit
 const handleSubmit = async (e) => {
  e.preventDefault();

  const newStudent = {
    name,        // use state directly
    unid,
    email,
    progress: Number(progress),
    supervisor,  // read from state
  };

  console.log("Submitting student:", newStudent);

  try {
    const res = await fetch(`http://localhost:5000/api/monitoringstudents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
console.log(res);
      if (!res.ok) throw new Error('Failed to add course');

    const savedStudent = await res.json();
    setStudents([...students, savedStudent]);

    // reset form
    setName('');
    setUnid('');
    setEmail('');
    setProgress(0);
    setShowForm(false);
  } catch (err) {
    console.error(err);
    alert('Error adding student');
  }
};


  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Monitored Students (Supervisor: {supervisor})
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 3 }}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add New Student"}
          </Button>

          {showForm && (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 600,
                mb: 4,
              }}
            >
              <TextField
                label="Full Name"
                value={name}
                 name="name" 
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="University ID"
                value={unid}
                 name="unid"
                onChange={(e) => setUnid(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Email"
                value={email}
                 name="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Progress (%)"
                type="number"
                 name="progress"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                fullWidth
              />
              <TextField
                label="Supervisor"
                 name="supervisor"
                value={supervisor}
                InputProps={{ readOnly: true }}
                fullWidth
              />
              <Button type="submit" variant="contained" color="success">
                Save Student
              </Button>
            </Box>
          )}

          <Typography variant="h6" gutterBottom>
            Your Monitored Students
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 2,
            }}
          >
            {students
              .filter((s) => s.supervisor === supervisor)
              .map((student) => (
                <Card key={student._id}>
                  <CardActionArea
                    onClick={() =>
                      alert(`Student: ${student.name}\nProgress: ${student.progress}%`)
                    }
                  >
                    <CardContent>
                      <Typography variant="h6">{student.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        UNID: {student.unid}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Progress: {student.progress}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {student.email}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}
          </Box>
        </Box>
      </main>
    </div>
  );
};

export default MonitorStudentPage;
