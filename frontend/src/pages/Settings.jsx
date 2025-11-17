import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
} from "@mui/material";

import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import Header from "@/components/coordinator/CoordinatorHeader";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");

  const handleReset = () => {
    setDarkMode(false);
    setNotifications(true);
    setLanguage("English");
    setItemsPerPage(10);
    setDateFormat("YYYY-MM-DD");
  };

  return (


    <div>
      <Header />
      <main className="pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />

<div className="w-full md:w-3/4 p-6">
            <h2 className="text-2xl font-bold mb-4">
            
                Settings
            </h2>

            <Stack spacing={3}>
                {/* Dark Mode */}
                <Card variant="outlined">
                <CardContent
                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                    <Box>
                    <Typography variant="h6">Dark Mode</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Use a dark color theme across the app.
                    </Typography>
                    </Box>
                    <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
                </CardContent>
                </Card>

                {/* Language */}
                <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" mb={1}>
                    Language
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                    Select application language.
                    </Typography>

                    <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select label="Language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <MenuItem value="English">English</MenuItem>
                        <MenuItem value="Sinhala">සිංහල (Sinhala)</MenuItem>
                        <MenuItem value="Tamil">தமிழ் (Tamil)</MenuItem>
                    </Select>
                    </FormControl>
                </CardContent>
                </Card>

                {/* Notifications */}
                <Card variant="outlined">
                <CardContent
                    sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                    <Box>
                    <Typography variant="h6">Notifications</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Enable or disable app notifications.
                    </Typography>
                    </Box>
                    <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    />
                </CardContent>
                </Card>

                {/* Items Per Page */}
                <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" mb={1}>
                    Items Per Page
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                    Adjust default list page size.
                    </Typography>

                    <FormControl fullWidth>
                    <InputLabel>Items Per Page</InputLabel>
                    <Select
                        label="Items Per Page"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(e.target.value)}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                    </FormControl>
                </CardContent>
                </Card>

                {/* Date Format */}
                <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" mb={1}>
                    Date Format
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                    Select how dates are displayed in the UI.
                    </Typography>

                    <FormControl fullWidth>
                    <InputLabel>Date Format</InputLabel>
                    <Select
                        label="Date Format"
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                    >
                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD (2025-11-17)</MenuItem>
                        <MenuItem value="DD-MM-YYYY">DD-MM-YYYY (17-11-2025)</MenuItem>
                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY (11/17/2025)</MenuItem>
                    </Select>
                    </FormControl>
                </CardContent>
                </Card>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary">
                    Save
                </Button>
                <Button variant="outlined" onClick={handleReset}>
                    Reset
                </Button>
                </Stack>
            </Stack>
            </div>

            </div>
            </main>

    </div>
  );
}
