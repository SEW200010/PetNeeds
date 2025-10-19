import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { useNavigate } from "react-router-dom";

const CoordinatorActionCard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]); // Faculties or Schools
  const [coordinator, setCoordinator] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    
    const organizationUnit = localStorage.getItem("organization_unit");
    const universityName = localStorage.getItem("university_name");
    const zone = localStorage.getItem("zone");

    console.log("===== Coordinator Dashboard Debug =====");
    console.log("Coordinator Info:", {
      token,
      name,
      organizationUnit,
      universityName,
      zone,
    });

    if (!token || !organizationUnit) {
      console.warn("Missing token or organization unit, cannot fetch data.");
      return;
    }

    setCoordinator({ name, organizationUnit , universityName, zone });

    let apiUrl = "";
    if (organizationUnit.toLowerCase() === "university") {
      apiUrl = `http://localhost:5000/faculties/${encodeURIComponent(universityName)}`;
    } else if (organizationUnit.toLowerCase() === "school") {
      apiUrl = `http://localhost:5000/schools/${encodeURIComponent(zone)}`;
    }

    if (!apiUrl) return;

    fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        console.log("API Response Status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("API Response Data:", data);
        if (!data.error) {
          setItems(data.items || []); // Backend should return { items: [...] }
        } else {
          console.error("API returned error:", data.error);
        }
      })
      .catch((err) => console.error("Failed to fetch items:", err));
  }, []);

  return (
    <div>
      
      <Box
        sx={{
          width: "95%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(220px, 100%), 1fr))",
          gap: 3,
        }}
      >
        {items.length > 0 ? (
          items.map((item, idx) => (
            <Card key={idx}>
              <CardActionArea
                onClick={() => {
                  if (coordinator.organizationUnit === "university") {
                    navigate( `/faculty/${encodeURIComponent(coordinator.universityName)}/${encodeURIComponent(item.faculty_name)}/events`);
                    
                  } else {
                    navigate(`/school/${encodeURIComponent(coordinator.zone)}/${encodeURIComponent(item.school_name)}/events`);
                  }
                }}
                sx={{
                  height: "100%",
                  "&:hover": { backgroundColor: "action.selectedHover" },
                }}
              >
                <CardContent>
                  <Typography variant="h5">
                    {coordinator.organizationUnit === "university"
                      ? item.faculty_name
                      : item.school_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {coordinator.organizationUnit === "university"
                      ? "Manage events and activities for this faculty"
                      : "Manage events and activities for this school"}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            No {coordinator.organizationUnit === "university" ? "faculties" : "schools"} available.
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default CoordinatorActionCard;
