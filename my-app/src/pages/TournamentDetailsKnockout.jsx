import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./TournamentDetailsKnockout.css";

export default function TournamentDetailsKnockout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="tournament-knockout">
      <div className="layout-container">
        <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="main-content">
          <div className="intro-text">
            <h1>1st Knockout Tournament - Fall 2025</h1><br />
          </div>

  
        </div>

        <Footer />
      </div>
    </div>
  );
}
