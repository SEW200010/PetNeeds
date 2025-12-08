import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import MyOrder from "./pages/MyOrder";
import ScrollToTop from "./components/ScrollToTop";

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
        <Route path="/Register" element={<Register />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/MyOrder" element={<MyOrder />} />
        <Route path="/Product" element={<Product />} />

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
