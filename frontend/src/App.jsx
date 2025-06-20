import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Login from "./pages/login";
import Aboutus from "./pages/Aboutus";
import Team from "./pages/Team";
import Services from "./pages/Services";
import Register from "./pages/Register";

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
        {/* Add more routes here for About, Services, etc. */}
      </Routes>
    </Router>
  );
};

export default App;

