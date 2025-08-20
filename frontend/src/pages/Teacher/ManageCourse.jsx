import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Chip,
  Stack,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';


const Teacher = () => {
  const loggedTeacher = "Dr. Smith"; // 🔑 Replace with actual logged-in teacher
  const API_BASE = "http://localhost:5000/courses"; // ✅ Flask backend

  const [attendees, setAttendees] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Email validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Add attendees (comma separated)
  const handleAddAttendees = () => {
    if (!emailInput.trim()) return;

    const emails = emailInput
      .split(',')
      .map((email) => email.trim())
      .filter((email) => email !== '' && isValidEmail(email));

    if (emails.length > 0) {
      setAttendees([...attendees, ...emails]);
    }

    setEmailInput('');
  };

  // Remove attendee
  const handleDeleteAttendee = (emailToDelete) => {
    setAttendees(attendees.filter((email) => email !== emailToDelete));
  };

  // Fetch courses from backend


useEffect(() => {
  const fetchCourses = async () => {
    try {
      const res = await fetch(`http://localhost:5000/courses/teacher/${encodeURIComponent(loggedTeacher)}`);
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchCourses();
}, []);

  // Handle form submit
  // Replace handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const newCourse = {
    courseName: formData.get('courseName'),
    duration: formData.get('duration'),
    courseId: formData.get('courseId'),
    attendeesCount: attendees.length,
    attendees: attendees,
    teacherIncharge: formData.get('teacherIncharge'),
    year: formData.get('year'),
  };

  try {
    const res = await fetch('http://localhost:5000/courses/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse),
    });

    if (!res.ok) throw new Error('Failed to add course');
    const savedCourse = await res.json();

    // Add saved course to state
    setCourses([...courses, savedCourse]);

    // Reset form
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
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Welcome to manage courses!
          </Typography>

          {/* Add new course button */}
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
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 600,
                mb: 4,
              }}
            >
              <TextField required label="Course Name" name="courseName" fullWidth />
              <TextField required label="Duration" name="duration" placeholder="e.g. 3 months" fullWidth />
              <TextField required label="Course ID" name="courseId" fullWidth />

              {/* Year Selection */}
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
                    <Chip
                      key={index}
                      label={email}
                      onDelete={() => handleDeleteAttendee(email)}
                      color="primary"
                    />
                  ))}
                </Stack>
              </Box>

              {/* Teacher Incharge */}
              <TextField select required label="Teacher Incharge" name="teacherIncharge" fullWidth>
                <MenuItem value="Dr. Smith">Dr. Smith</MenuItem>
                <MenuItem value="Prof. Johnson">Prof. Johnson</MenuItem>
                <MenuItem value="Ms. Williams">Ms. Williams</MenuItem>
              </TextField>

              <Button type="submit" variant="contained" color="success">
                Save Course
              </Button>
            </Box>
          )}

          {/* Courses List (filter by logged teacher) */}
          <Typography variant="h6" gutterBottom>
            Your Courses
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 2,
            }}
          >
            {courses
              .filter((course) => course.teacherIncharge === loggedTeacher)
              .map((course, index) => (
                <Card key={index}>
                  <CardActionArea
                    onClick={() => alert(`Go to details of ${course.courseName}`)} // Replace with navigate()
                  >
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
      </main>
    </div>
  );
};

export default Teacher;
