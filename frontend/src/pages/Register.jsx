// Register.jsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PasswordStrengthBar from 'react-password-strength-bar';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const universities = [
  'University of Colombo',
  'University of Peradeniya',
  'University of Sri Jayewardenepura',
  'University of Kelaniya',
  'University of Moratuwa',
  'University of Jaffna',
  'University of Ruhuna',
  'Eastern University, Sri Lanka',
  'South Eastern University of Sri Lanka',
  'Rajarata University of Sri Lanka',
  'Sabaragamuwa University of Sri Lanka',
  'Wayamba University of Sri Lanka',
  'Uva Wellassa University of Sri Lanka',
  'University of the Visual and Performing Arts',
  'Gampaha Wickramarachchi University of Indigenous Medicine',
  'University of Vavuniya',
  'Other',
];

const faculties = {
  'University of Jaffna': [
    'Faculty of Agriculture',
    'Faculty of Allied Health Sciences',
    'Faculty of Arts',
    'Faculty of Engineering',
    'Faculty of Graduate Studies',
    'Faculty of Hindu Studies',
    'Faculty of Management Studies and Commerce',
    'Faculty of Medicine',
    'Faculty of Science',
    'Faculty of Technology',
    'Sir Ponnambalam Ramanathan Faculty of Performing & Visual Arts',
  ],
  'University of Vavuniya': ['Faculty of Applied Science', 'Faculty of Business Studies', 'Faculty of Technological Studies'],
  'Eastern University, Sri Lanka': [
    'Faculty of Agriculture',
    'Faculty of Arts and Culture',
    'Faculty of Commerce and Management',
    'Faculty of Health Care Sciences',
    'Faculty of Science',
    'Faculty of Technology',
    'Faculty of Communication and Business Studies (Trincomalee Campus)',
    'Faculty of Applied Sciences (Trincomalee Campus)',
    'Swamy Vipulananda Institute of Aesthetic Studies',
  ],
  'South Eastern University of Sri Lanka': [
    'Faculty of Applied Sciences',
    'Faculty of Arts and Culture',
    'Faculty of Islamic Studies and Arabic Language',
    'Faculty of Management and Commerce',
    'Faculty of Engineering',
    'Faculty of Technology',
  ],
};

const Register = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      fullname: '',
      email: '',
      password: '',
      role: '',
      organization_unit: '',
      school_name: '',
      zone: '',
      district: '',
      university_name: '',
      faculty_name: '',
      address: '',
      contact: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const password = watch('password');
  const organization_unit = watch('organization_unit');
  const university_name = watch('university_name');

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        alert('Registration successful! Please check your email.');
        navigate('/login');
      } else {
        setMessage(result.error || result.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (

     <div
      className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/Home_images/image2copy.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

     {/* Left Section */}
<div className="relative text-center lg:text-left px-6 sm:px-10 lg:px-16 z-10 mb-8 lg:mb-0">
  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
    Join Our Community!
  </h1>
  <p className="text-md sm:text-lg text-emerald-400 mt-3">
    Create your account today and unlock amazing features.
  </p>
</div>


<div className="relative  p-6 sm:p-8  z-10">
    <Box sx={{ maxWidth: 600, margin: '0 auto', mt: 5, px: 2, bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3, position: 'relative', zIndex: 1 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <Controller
          name="fullname"
          control={control}
          rules={{ required: 'Full name is required' }}
          render={({ field }) => <TextField {...field} label="Full Name" fullWidth margin="normal" error={!!errors.fullname} helperText={errors.fullname?.message} />}
        />

        {/* Email */}
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: 'Invalid email' },
          }}
          render={({ field }) => <TextField {...field} label="Email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message} />}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password too short' } }}
          render={({ field }) => (
            <>
              <TextField
                {...field}
                type={showPassword ? 'text' : 'password'}
                label="Password"
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <PasswordStrengthBar password={field.value} />
            </>
          )}
        />

        {/* Role */}
        <Controller
          name="role"
          control={control}
          rules={{ required: 'Role is required' }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select {...field} label="Role">
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="facilitator">Facilitator</MenuItem>
                <MenuItem value="coordinator">Coordinator</MenuItem>
              </Select>
              <FormHelperText>{errors.role?.message}</FormHelperText>
            </FormControl>
          )}
        />

        {/* Organization Unit */}
        <Controller
          name="organization_unit"
          control={control}
          rules={{ required: 'Organization unit is required' }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal" error={!!errors.organization_unit}>
              <InputLabel>Organization Unit</InputLabel>
              <Select {...field} label="Organization Unit">
                <MenuItem value="school">School</MenuItem>
                <MenuItem value="university">University</MenuItem>
              </Select>
              <FormHelperText>{errors.organization_unit?.message}</FormHelperText>
            </FormControl>
          )}
        />

        {/* Conditional School Fields */}
        {organization_unit === 'school' && (
          <>
            <Controller name="school_name" control={control} rules={{ required: 'School name is required' }} render={({ field }) => <TextField {...field} label="School Name" fullWidth margin="normal" error={!!errors.school_name} helperText={errors.school_name?.message} />} />
            <Controller name="zone" control={control} rules={{ required: 'Zone is required' }} render={({ field }) => <TextField {...field} label="Zone" fullWidth margin="normal" error={!!errors.zone} helperText={errors.zone?.message} />} />
            <Controller name="district" control={control} rules={{ required: 'District is required' }} render={({ field }) => <TextField {...field} label="District" fullWidth margin="normal" error={!!errors.district} helperText={errors.district?.message} />} />
          </>
        )}

        {/* Conditional University Fields */}
        {organization_unit === 'university' && (
          <>
            <Controller
              name="university_name"
              control={control}
              rules={{ required: 'University name is required' }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.university_name}>
                  <InputLabel>University Name</InputLabel>
                  <Select {...field} label="University Name">
                    {universities.map((uni) => <MenuItem key={uni} value={uni}>{uni}</MenuItem>)}
                  </Select>
                  <FormHelperText>{errors.university_name?.message}</FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="faculty_name"
              control={control}
              rules={{ required: 'Faculty name is required' }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.faculty_name}>
                  <InputLabel>Faculty Name</InputLabel>
                  <Select {...field} label="Faculty Name" disabled={!university_name}>
                    {(faculties[university_name] || []).map((fac) => <MenuItem key={fac} value={fac}>{fac}</MenuItem>)}
                  </Select>
                  <FormHelperText>{errors.faculty_name?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </>
        )}

        {/* Address */}
        <Controller name="address" control={control} rules={{ required: 'Address is required' }} render={({ field }) => <TextField {...field} label="Address" fullWidth margin="normal" error={!!errors.address} helperText={errors.address?.message} />} />

        {/* Contact */}
        <Controller name="contact" control={control} rules={{ required: 'Contact is required', pattern: { value: /^[0-9]{10}$/, message: 'Contact must be 10 digits' } }} render={({ field }) => <TextField {...field} label="Contact" fullWidth margin="normal" error={!!errors.contact} helperText={errors.contact?.message} />} />

        {/* Submit */}
        <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>

        {/* Message */}
        {message && <Box sx={{ mt: 2, color: message.includes('successful') ? 'green' : 'red' }}>{message}</Box>}
      </form>
    </Box>
    </div>

    </div>
  );
};

export default Register;
