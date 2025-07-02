import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Login from "./pages/login";
import Aboutus from "./pages/Aboutus";
import Team from "./pages/Team";
import Services from "./pages/Services";
import Register from "./pages/Register";
import User from "./pages/User/User";
import Admin from "./pages/Admin/Admin";
import FundRaising from "./pages/Admin/FundRaising";
import MonitoreSession from "./pages/Admin/MonitorSession";
import EventManagement from "./pages/Admin/EventManagement";
import ViewEvent from "./pages/Admin/ViewEvent";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Team" element={<Team />}/>
        <Route path="/Services" element={<Services />}/>
        <Route path="/Aboutus" element={<Aboutus />}/>
        <Route path="/Register" element={<Register />}/>
        <Route path="/user-dashboard" element={<User />}/>
        <Route path="/admin-dashboard" element={<Admin />}/>
        <Route path="/FundRaising" element={<FundRaising />}/>
        <Route path="/monitor-sessions" element={<MonitoreSession />}/>
        <Route path="/event-management" element={<EventManagement />} />
        <Route path="/admin/EventManagement" element={<EventManagement />} />
        <Route path="/admin/ViewEvent/:id" element={<ViewEvent />} />
        {/* Add more routes here for About, Services, etc. */}
      </Routes>
    </Router>
  );
};

export default App;

