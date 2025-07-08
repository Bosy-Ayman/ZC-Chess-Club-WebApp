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
      </Routes>
    </Router>
  );
}

export default App;
