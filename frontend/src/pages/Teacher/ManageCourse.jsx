import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  CardActionArea,
  MenuItem,   // ✅ add this
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import TeacherSidebar from "../../components/Teacher/TeacherSidebar";


const ManageCourse = () => {
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/courses";

  const [teacherName, setTeacherName] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // ✅ Get logged-in teacher info from localStorage
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

      setTeacherName(decoded.name);  // name from token payload
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login");
    }
  }, [navigate]);

  // Email validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Add attendees
  const handleAddAttendees = () => {
    if (!emailInput.trim()) return;

    const emails = emailInput
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email !== '' && isValidEmail(email));

    if (emails.length > 0) setAttendees([...attendees, ...emails]);

    setEmailInput('');
  };

  // Remove attendee
  const handleDeleteAttendee = (emailToDelete) => {
    setAttendees(attendees.filter((email) => email !== emailToDelete));
  };

  // Fetch courses for logged-in teacher
  useEffect(() => {
    if (!teacherName) return;

    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/teacher/${encodeURIComponent(teacherName)}`);
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, [teacherName]);

  // Handle course form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newCourse = {
      courseName: formData.get('courseName'),
      duration: formData.get('duration'),
      courseId: formData.get('courseId'),
      attendeesCount: attendees.length,
      attendees,
      teacherIncharge: teacherName, // ✅ always use logged-in teacher
      year: formData.get('year'),
    };

    try {
      const res = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse),
      });

      if (!res.ok) throw new Error('Failed to add course');
      const savedCourse = await res.json();

      setCourses([...courses, savedCourse]);
      setAttendees([]);
      setEmailInput('');
      e.target.reset();
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert('Error adding course');
    }
  };

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <TeacherSidebar />
          <div className="w-full md:w-3/4 p-6">
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Welcome, {teacherName}!
              </Typography>

              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 3 }}
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Cancel" : "Add New Course"}
              </Button>

              {/* Course Form */}
              {showForm && (
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, mb: 4 }}
                >
                  <TextField required label="Course Name" name="courseName" fullWidth />
                  <TextField required label="Duration" name="duration" fullWidth placeholder="e.g. 3 months" />
                  <TextField required label="Course ID" name="courseId" fullWidth />

                  <TextField select required label="Year" name="year" fullWidth>
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2026">2026</MenuItem>
                    <MenuItem value="2027">2027</MenuItem>
                  </TextField>

                  {/* Attendees emails */}
                  <Box>
                    <TextField
                      label="Add Attendees (comma separated emails)"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      fullWidth
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddAttendees();
                        }
                      }}
                    />
                    <Button sx={{ mt: 1 }} variant="contained" onClick={handleAddAttendees}>
                      Add Emails
                    </Button>

                    <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                      {attendees.map((email, index) => (
                        <Chip key={index} label={email} onDelete={() => handleDeleteAttendee(email)} color="primary" />
                      ))}
                    </Stack>
                  </Box>

                  {/* Teacher Incharge */}
                  <TextField
                    label="Teacher Incharge"
                    name="teacherIncharge"
                    fullWidth
                    value={teacherName}
                    InputProps={{ readOnly: true }}
                  />

                  <Button type="submit" variant="contained" color="success">
                    Save Course
                  </Button>
                </Box>
              )}

              {/* Courses List */}
              <Typography variant="h6" gutterBottom>
                Your Courses
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 2 }}>
                {courses.map((course, index) => (
                  <Card key={index}>
                    <CardActionArea onClick={() => alert(`Go to details of ${course.courseName}`)}>
                      <CardContent>
                        <Typography variant="h6">{course.courseName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Year: {course.year}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            </Box>
          </div>
        </div>
      </main>
    </div>


  );
};

export default ManageCourse;
