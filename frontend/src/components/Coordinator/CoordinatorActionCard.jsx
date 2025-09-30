import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";

const CoordinatorActionCard = () => {
  const navigate = useNavigate();
  const [zones, setZones] = useState([]);
  const [coordinator, setCoordinator] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    //const districtId = localStorage.getItem("district_id");
    const name = localStorage.getItem("name");
    const province = localStorage.getItem("province");
    const district = localStorage.getItem("district");

    console.log("===== Coordinator Dashboard Debug =====");
    console.log("Token from localStorage:", token);
  
    console.log("Coordinator Info from localStorage:", { name, province, district });

    if (!token ) {
      console.warn("Missing token or districtId, cannot fetch zones.");
      return;
    }

    setCoordinator({ name, province, district });

    fetch(`http://localhost:5000/coordinator/zones/${district}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        console.log("API Response Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("API Response Data:", data);
        if (!data.error) {
          setZones(data.zones);
        } else {
          console.error("API returned error:", data.error);
        }
      })
      .catch((err) => console.error("Failed to fetch zones:", err));
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Welcome, {coordinator.name} ({coordinator.province} - {coordinator.district})
      </Typography>

      <Box
        sx={{
          width: "95%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))",
          gap: 3,
        }}
      >
        {zones.length > 0 ? (
          zones.map((zone) => (
            <Card key={zone.id}>
              <CardActionArea
                onClick={() => navigate(`/zone/${zone.id}/events`)}
                sx={{
                  height: "100%",
                  "&:hover": { backgroundColor: "action.selectedHover" },
                }}
              >
                <CardContent>
                  <Typography variant="h5">{zone.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage events and activities for this zone
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No zones available for this district.
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default CoordinatorActionCard;
