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
import MonitoreSession from "./pages/Admin/MonitorSession";


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
        <Route path="/monitor-sessions" element={<MonitoreSession />}/>
        
        {/* Add more routes here for About, Services, etc. */}
      </Routes>
    </Router>
  );
};

export default App;

