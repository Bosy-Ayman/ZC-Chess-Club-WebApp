import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import ContactUs from "./components/ContactUs";
import AboutUs from "./components/About";
import Tournaments from "./components/Tournaments";
import Profile from "./components/Profile";
import PuzzleChallenge from "./components/PuzzleChallenge";
import ClubRoles from "./components/ClubRoles";
import TournamentDetails from "./components/TournamentDetails";

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
      </Routes>
    </Router>
  );
}

export default App;
