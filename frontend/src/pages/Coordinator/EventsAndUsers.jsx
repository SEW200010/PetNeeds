import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CoordinatorSidebar from "@/components/Coordinator/CoordinatorSidebar";
import Header from "@/components/Admin/Header";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";

const CoordinatorUnitView = () => {
  const navigate = useNavigate();
  const { faculty_name, university_name, school_name, zone } = useParams();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unitType, setUnitType] = useState(""); // 'faculty' or 'school'
    
  const eventColumns = [
  { field: "title", headerName: "Event Title", flex: 2 },
  { field: "date", headerName: "Date", flex: 1 },
  { field: "location", headerName: "Venue", flex: 2 },
];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const organizationUnit = localStorage.getItem("organization_unit");

    console.log("===== EventsAndUsers Debug =====");
    console.log("Token:", token);
    console.log("Organization Unit:", organizationUnit);
    console.log("Params:", { faculty_name, university_name, school_name, zone });
    if (!token || !organizationUnit) {
      console.warn("Missing token or organization unit.");
      return;
    }

    const type = organizationUnit.toLowerCase();
    setUnitType(type);

    const baseUrl = "http://localhost:5000";

    let eventsUrl = "";
    let usersUrl = "";

    if (type === "university") {
      // Faculty route
      eventsUrl = `${baseUrl}/faculty/${encodeURIComponent(
        university_name
      )}/${encodeURIComponent(faculty_name)}/events`;
      usersUrl = `${baseUrl}/faculty/${encodeURIComponent(
        university_name
      )}/${encodeURIComponent(faculty_name)}/users`;
    } else {
      // School route
      eventsUrl = `${baseUrl}/school/${encodeURIComponent(
        zone
      )}/${encodeURIComponent(school_name)}/events`;
      usersUrl = `${baseUrl}/school/${encodeURIComponent(
        zone
      )}/${encodeURIComponent(school_name)}/users`;
    }

    Promise.all([
      fetch(eventsUrl, { headers: { Authorization: `Bearer ${token}` } }).then(
        (res) => res.json()
      ),
      fetch(usersUrl, { headers: { Authorization: `Bearer ${token}` } }).then(
        (res) => res.json()
      ),
    ])
      .then(([eventData, userData]) => {
        setEvents(eventData.events || []);
        setUsers(userData.users || []);
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
      console.log("Fetched Events:", events);
      console.log("Fetched Users:", users); 
  }, [faculty_name, school_name, university_name, zone]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );

  const unitTitle =
    unitType === "university"
      ? `${faculty_name} (${university_name})`
      : `${school_name} (${zone})`;


      const eventRows = events.map((e, index) => ({
  id: index,  // DataGrid needs a unique `id`
  title: e.title,
  date: e.date,
  location: e.location || "",
}));

  return (
    <div>
      <Header />
      <main className="pt-[65px] min-h-screen bg-gray-50">
        <div className="flex flex-col md:flex-row">
          <CoordinatorSidebar />

          <div className="flex-1 p-6">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h4">Events — {unitTitle}</Typography>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Back
              </Button>
            </Box>

            {/* Events Section */}
            <Typography variant="h5" sx={{ mb: 2 }}>
              Events
            </Typography>

            {events.length > 0 ? (
              events.map((event, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.date}{" "}
                      {event.location ? `— ${event.location}` : ""}
                    </Typography>
                  </CardContent>
                </Card>

                
              ))
            ) : (
              <Typography color="text.secondary">No events found.</Typography>
            )}

{events.length > 0 ? (
  <div style={{ height: 400, width: "100%" }}>
    <DataGrid
      rows={eventRows}
      columns={eventColumns}
      pageSize={5}
      rowsPerPageOptions={[5, 10]}
      disableSelectionOnClick
    />
  </div>
) : (
  <Typography color="text.secondary">No events found.</Typography>
)}

            <Divider sx={{ my: 3 }} />

            {/* Users Section */}
            <Typography variant="h5" sx={{ mb: 2 }}>
              Registered Users
            </Typography>

            {users.length > 0 ? (
              users.map((user, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography color="text.secondary">
                No registered users found.
              </Typography>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoordinatorUnitView;
