import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/About";
import Tournaments from "./pages/Tournaments";
import Profile from "./pages/Profile";
import PuzzleChallenge from "./pages/PuzzleChallenge";
import ClubRoles from "./pages/ClubRoles";
import TournamentDetails from "./pages/TournamentDetails";
import TournamentDetailsKnockout from "./pages/TournamentDetailsKnockout";
import Calendar from './pages/Calendar.jsx'
import CalendarEdit from './pages/CalendarEdit.jsx'
import Archive from "./pages/Archive.jsx";


// import ClubRoles from './pages/ClubRoles';
import MultimediaForm from './pages/MultimediaForm'; 
// ADD IMPORTS FOR OTHER FORMS:
import HRForm from './pages/HRForm';
import OCMemberForm from './pages/OCMemberForm';
import TrainerForm from './pages/TrainerForm';
import TraineeForm from './pages/TraineeForm';
import ApplicationsTable from './pages/ApplicationsTable';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/login" element={<Login />} />
         <Route path="/contact" element={<ContactUs />} />
         <Route path="/about" element={<AboutUs />} />
         <Route path="/tournaments" element={<Tournaments />} />
         <Route path="/profile" element={<Profile />} />
         <Route path="/puzzlechallenge" element={<PuzzleChallenge />} />
         <Route path="/clubroles" element={<ClubRoles />} />
         <Route path="/tournamentdetails" element={<TournamentDetails />} />
         <Route path="/tournamentdetailsKnockout" element={<TournamentDetailsKnockout />} />
         <Route path="/calendar" element={<Calendar />} />
         <Route path="/calendaredit" element={<CalendarEdit />} />
         <Route path="/archive" element={<Archive />} />
        {/* New Application Routes */}
        <Route path="/apply/multimedia" element={<MultimediaForm />} />
        <Route path="/apply/hr" element={<HRForm />} />
        <Route path="/apply/oc-member" element={<OCMemberForm />} />
        <Route path="/apply/trainer" element={<TrainerForm />} />
        <Route path="/apply/trainee" element={<TraineeForm />} />

        <Route path="/applicationtable" element={<ApplicationsTable/>} />

      </Routes>
    </Router>
  );
}

export default App;
