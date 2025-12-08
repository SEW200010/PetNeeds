import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const [isAdminView, setIsAdminView] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const menuLinks = isAdminView
    ? [
        { title: "Dashboard", path: "/dashboard" },
        { title: "Product", path: "/admin-product" },
        { title: "Order", path: "/admin-order" },
        { title: "User", path: "/admin-user" },
        { title: "Perception", path: "/admin-perception" },
      ]
    : [
        { title: "Home", path: "/" },
        { title: "Product", path: "/Product" },
        { title: "MyOrder", path: "/MyOrder" },
        { title: "Profile", path: "/Profile" },
      ];

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const adminPaths = ['/dashboard', '/admin-product', '/admin-order', '/admin-user', '/admin-perception'];
    setIsAdminView(adminPaths.includes(location.pathname));
  }, [location.pathname]);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={hasScrolled ? 6 : 0}
        sx={{
          backgroundColor: "#100f0fff",
          transition: "0.3s",
          paddingY: "20px"
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >     
          {/* LEFT SECTION: LOGO + BRAND NAME */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,   // << Adds space between logo and brand text
            textDecoration: "none",
            width: { xs: "auto", md: "200px" }
          }}
        >

          {/* Logo Circle */}
          <Box
            sx={{
              width: 78,
              height: 78,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              boxShadow: "0 0 8px rgba(0,0,0,0.3)"
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          {/* Brand Name */}
          <Typography
            color="white"
            fontWeight={900}
            sx={{ fontSize: { xs: "20px", md: "26px" }, letterSpacing: "2px" }}
          >
            PetCare
          </Typography>
        </Box>

          {/* CENTER SECTION: MENU LINKS */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              justifyContent: "center",
              flexGrow: 1
            }}
          >
            {menuLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.title}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: isActive ? "#fcfdfcff" : "white",
                    fontWeight: "bold",
                     fontSize: "26px",  
                    textTransform: "none",
                    borderBottom: isActive
                      ? "2px solid #f2f7f6ff"
                      : "2px solid transparent",
                    borderRadius: 0,
                    "&:hover": { color: "#b2b7b5ff", transform: "scale(1.1)" }

                  }}
                >
                  {item.title}
                </Button>
              );
            })}
          </Box>

          {/* RIGHT SECTION: LOGIN + MOBILE MENU */}
          <Box
            sx={{
              width: { xs: "auto", md: "200px" },   // balance with left section
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2
            }}
          >
            {/* Desktop View Toggle */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <Button
                onClick={() => {
                  setIsAdminView(true);
                  navigate("/dashboard");
                }}
                sx={{
                  backgroundColor: isAdminView ? "#25d6a4" : "#fbfcfcff",
                  color: isAdminView ? "black" : "black",
                  paddingX: 2,
                  fontSize: "20px",
                  fontWeight: "700",
                  borderRadius: "20px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: isAdminView ? "#37a391ff" : "white", transform: "scale(1.05)" }
                }}
              >
                AdminView
              </Button>
              <Button
                onClick={() => {
                  setIsAdminView(false);
                  navigate("/");
                }}
                sx={{
                  backgroundColor: !isAdminView ? "#2fc39eff" : "#fbfcfcff",
                  color: !isAdminView ? "black" : "black",
                  paddingX: 2,
                  fontSize: "20px",
                  fontWeight: "700",
                  borderRadius: "20px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: !isAdminView ? "#1ca285ff" : "white", transform: "scale(1.05)" }
                }}
              >
                UserView
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              sx={{ display: { xs: "block", md: "none" }, color: "black" }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 220, background: "#e8f2f2ff", height: "100%", paddingTop: 2 }}>
          <List>
            {menuLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.title} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                  >
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        color: isActive ? "#eef5f3ff" : "white",
                        fontWeight: isActive ? "bold" : "normal",
                        textAlign: "center"
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}

            {/* Mobile Login */}
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/login" onClick={() => setMobileOpen(false)}>
                <ListItemText
                  primary="Login"
                  primaryTypographyProps={{
                    color: "#25d6a4",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Prevent layout shift */}
      <Toolbar />
    </>
  );
};

export default Header;
