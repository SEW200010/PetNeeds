import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Logo from "../assets/logoNew.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const location = useLocation(); // <== Detect current active route

  const menuLinks = [
    { title: "Home", path: "/" },
    { title: "About Us", path: "/Aboutus" },
    { title: "Services", path: "/services" },
    { title: "Team", path: "/team" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={hasScrolled ? 6 : 0}
        sx={{
          backgroundColor: hasScrolled ? "#083636" : "#083636",
          transition: "0.3s",
          paddingY: "3px"
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* Logo + Title */}
          <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: 1, textDecoration: "none" }}>
            <img src={Logo} alt="Logo" style={{ height: 40 }} />
            <Typography color="white" fontWeight={600}>
              Varppu Life Skill Development
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, alignItems: "center" }}>
            {menuLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive ? "#25d6a4" : "white",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderBottom: isActive ? "2px solid #25d6a4" : "2px solid transparent",
                    borderRadius: 0,
                    "&:hover": { color: "#25d6a4" }
                  }}
                >
                  {item.title}
                </Button>
              );
            })}

            {/* Login Button */}
            <Button
              component={Link}
              to="/Login"
              sx={{
                backgroundColor: "#27987A",
                color: "white",
                paddingX: 3,
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": { backgroundColor: "green", transform: "scale(1.1)" }
              }}
            >
              Login
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "block", md: "none" }, color: "white" }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 220, background: "#083636", height: "100%", paddingTop: 2 }}>
          <List>
            {menuLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.title} disablePadding>
                  <ListItemButton component={Link} to={item.path} onClick={() => setMobileOpen(false)}>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        color: isActive ? "#25d6a4" : "white",
                        fontWeight: isActive ? "bold" : "normal",
                        textAlign: "center"
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}

            {/* Login for Mobile */}
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/Login" onClick={() => setMobileOpen(false)}>
                <ListItemText
                  primary="Login"
                  primaryTypographyProps={{ color: "#25d6a4", textAlign: "center", fontWeight: "bold" }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Prevent content jump */}
      <Toolbar />
    </>
  );
};

export default Header;
