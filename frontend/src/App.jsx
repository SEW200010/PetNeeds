import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Login from "./pages/login";
import Home from "./pages/User/Home";
import Register from "./pages/register";
import Product from "./pages/User/Product";
import Profile from "./pages/User/Profile";
import MyOrder from "./pages/User/MyOrder";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";

// Admin pages
import Dashboard from "./pages/Admin/Dashboard";
import AdminProduct from "./pages/Admin/AdminProduct";
import AdminOrder from "./pages/Admin/AdminOrder";
import AdminUser from "./pages/Admin/AdminUser";
import AdminPerception from "./pages/Admin/AdminPerception";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myorder" element={<MyOrder />} />
        <Route path="/product" element={<Product />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-product" element={<AdminProduct />} />
        <Route path="/admin-order" element={<AdminOrder />} />
        <Route path="/admin-user" element={<AdminUser />} />
        <Route path="/admin-perception" element={<AdminPerception />} />
      </Routes>
    </Router>
  );
};

export default App;
