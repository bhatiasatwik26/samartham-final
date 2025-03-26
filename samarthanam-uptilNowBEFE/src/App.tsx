import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import React from "react";

// Import pages
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import SignIn from "./pages/SignIn";
import { VolunteerDashboard } from "./pages/volunteer";
import BadgesPage from "./pages/volunteer/BadgesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import ManageEvent from "./pages/ManageEvent";
// Import our custom pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import ParticipantRegistration from "./pages/ParticipantRegistration";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import ParticipantLogin from "./pages/ParticipantLogin";
import VolunteerRegister from "./pages/VolunteerRegister";
import VolunteerLogin from "./pages/VolunteerLogin";
import SpeechRecognizer from "./components/SpeechRecognizer";
import Dashboard from "./pages/volunteer/Dashboard";

const App = () => {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/volunteer-dashboard/:id" element={<Dashboard />} />
        <Route path="/volunteer-register" element={<VolunteerRegister />} />
        <Route path="/volunteer-login" element={<VolunteerLogin />} />
        <Route path="/badges" element={<BadgesPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manage-event/:eventId" element={<ManageEvent />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route
          path="/participant-registration"
          element={<ParticipantRegistration />}
        />
        <Route
          path="/participant-dashboard"
          element={<ParticipantDashboard />}
        />
        <Route path="/participant-login" element={<ParticipantLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <SpeechRecognizer />
      <Toaster />
    </TooltipProvider>
  );
};

export default App;
