import React, { useState } from "react";
import Header from "../components/Header";
import './TournamentDetails.css';


export default function TournamentDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    
  return (
  <div className="tournament-page">
  <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <div className="content-wrapper">
          {/* Left column */}
          <div className="left-column">
            <div className="header-title">Chess Tournament Details</div>

            <h3 className="section-title">Tournament Overview</h3>
            <div className="overview-grid">
              <div className="overview-row">
                <p className="label">Tournament Name</p>
                <p className="value">Grandmaster Showdown</p>
              </div>
              <div className="overview-row">
                <p className="label">Date</p>
                <p className="value">July 15-20, 2024</p>
              </div>
              <div className="overview-row">
                <p className="label">Location</p>
                <p className="value">City Chess Club</p>
              </div>
            </div>

            <h3 className="section-title">Tournament Progress</h3>
            <div className="progress-section">
              <p className="progress-text">Round 3 of 5</p>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: "60%" }}></div>
              </div>
              <p className="progress-info">Next round starts in 2 hours</p>
            </div>

            <h3 className="section-title">Quick Actions</h3>
            <div className="quick-actions">
              <button className="btn yellow-btn">View Live Games</button>
              <button className="btn dark-btn">Download PGN</button>
            </div>
          </div>

          {/* Right column */}
          <div className="right-column">
            <div className="tabs">
              <a href="#" className="tab active">Players</a>
              <a href="#" className="tab">Pairings</a>
              <a href="#" className="tab">Live Results</a>
              <a href="#" className="tab">Standings</a>
            </div>

            <h2 className="player-list-title">Player List</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player Name</th>
                    <th>Rating</th>
                    <th>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: "Magnus Carlsen", rating: 2850, country: "Norway" },
                    { rank: 2, name: "Fabiano Caruana", rating: 2822, country: "USA" },
                    { rank: 3, name: "Ding Liren", rating: 2805, country: "China" },
                    { rank: 4, name: "Ian Nepomniachtchi", rating: 2792, country: "Russia" },
                    { rank: 5, name: "Alireza Firouzja", rating: 2785, country: "France" },
                    { rank: 6, name: "Anish Giri", rating: 2777, country: "Netherlands" },
                    { rank: 7, name: "Wesley So", rating: 2770, country: "USA" },
                    { rank: 8, name: "Maxime Vachier-Lagrave", rating: 2765, country: "France" },
                    { rank: 9, name: "Levon Aronian", rating: 2758, country: "USA" },
                    { rank: 10, name: "Richard Rapport", rating: 2750, country: "Romania" },
                  ].map(({ rank, name, rating, country }) => (
                    <tr key={rank}>
                      <td>{rank}</td>
                      <td>{name}</td>
                      <td>{rating}</td>
                      <td>{country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
