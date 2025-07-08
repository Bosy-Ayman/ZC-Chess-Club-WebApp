import React, { useState } from "react";
import Header from "../components/Header";
import './TournamentDetails.css';
import Footer from "../components/Footer";

export default function TournamentDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const players = [
    { rank: 1, name: "Magnus Carlsen", rating: 2850, major: "Physics" },
    { rank: 2, name: "Fabiano Caruana", rating: 2822, major: "Engineering" },
    { rank: 3, name: "Ding Liren", rating: 2805, major: "AI" },
    { rank: 4, name: "Ian Nepomniachtchi", rating: 2792, major: "Math" },
  ];

  return (
    <div className="tournament-wrapper">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <div className="main-content">
          <div className="intro-text">
            <h1>Ramadan Rapid Tournament</h1>
            <p>May 15–20, 2025 — Academic Department - Palm Tree</p>
          </div>

          <h2 className="section-title">Tournament Progress</h2>
          <div className="role-card">
            <div className="role-info">
              <p className="title">Round 3 of 5</p>
              <p className="desc">Next round starts in 2 hours</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>

          <h2 className="section-title">Player List</h2>
          <div className="application-table-wrapper">
            <table className="application-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player Name</th>
                  <th>Rating</th>
                  <th>Major</th>
                </tr>
              </thead>
              <tbody>
                {players.map(({ rank, name, rating, major }) => (
                  <tr key={rank}>
                    <td>{rank}</td>
                    <td>{name}</td>
                    <td>{rating}</td>
                    <td>{major}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
      <Footer/>
    </div>
  );
}
