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
import UserManagementDashboard from "./pages/Admin/UserManagementDashboard";
import MonitorStudent from "./pages/Admin/MonitorStudent";
import ExploreModel from "./pages/Admin/ExploreModel";
import FeedbackPage from "./pages/Admin/FeedbackPage"; 
import BasicPage from "./pages/Admin/BasicPage";
import UpcomingEvents from "./pages/User/UserEvent/UpcomingEvents";
import OngoingEvents from "./pages/User/UserEvent/OngoingEvents";
import CompletedEventsPage from "./pages/User/UserEvent/CompletedEventsPage";
const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Team" element={<Team />} />
        <Route path="/Services" element={<Services />} />
        <Route path="/Aboutus" element={<Aboutus />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/user-dashboard" element={<User />} />
        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/FundRaising" element={<FundRaising />} />
        <Route path="/monitor-sessions" element={<MonitoreSession />} />
        <Route path="/event-management" element={<EventManagement />} />
        <Route path="/admin/EventManagement" element={<EventManagement />} />
        <Route path="/admin/ViewEvent/:id" element={<ViewEvent />} />
        <Route path="/admin/events/:id/feedback" element={<FeedbackPage />} />
        <Route path="/admin/events/:id/basic" element={<BasicPage />} />
        <Route path="/user-management" element={<UserManagementDashboard />} />
        <Route path="/monitor-students" element={<MonitorStudent />} />
        <Route path="/explore-model" element={<ExploreModel />} />
        <Route path="/upcoming-events" element={<UpcomingEvents />} />
        <Route path="/ongoing-events" element={<OngoingEvents />} />
        <Route path="/completed-events" element={<CompletedEventsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
