
import React, { useState } from "react";
import './PuzzleChallenge.css';
import Header from "../components/Header";
import Footer from "../components/Footer";
export default function PuzzleChallenge() {
    
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="puzzle-challenge-root">
    <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        
        <div className="puzzle-main">
          <div className="puzzle-content">
            <h2 className="puzzle-header-title">Puzzle Challenge</h2>
            <p className="puzzle-description">
              Solve puzzles to earn points and climb the leaderboard. Each puzzle has a time limit, and the faster you solve it, the more points you'll get.
            </p>

   !

            <div className="timer-container">
              {['Hours', 'Minutes', 'Seconds'].map((label, idx) => (
                <div key={idx} className="timer-box">
                  <div className="timer-value">{label === 'Minutes' ? '05' : '00'}</div>
                  <div className="timer-label">{label}</div>
                </div>
              ))}
            </div>

            <div className="submit-button-container">
              <button className="submit-button">
                <span>Submit Solution</span>
              </button>
            </div>

            <h3 className="leaderboard-title">Leaderboard</h3>
            <div className="leaderboard-wrapper">
              <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th className="column-120">Rank</th>
                      <th className="column-240">Player</th>
                      <th className="column-360">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['1', 'Ethan Carter', '1250'],
                      ['2', 'Olivia Bennett', '1180'],
                      ['3', 'Noah Thompson', '1120'],
                      ['4', 'Ava Harris', '1050'],
                      ['5', 'Liam Clark', '980']
                    ].map(([rank, player, points], idx) => (
                      <tr key={idx}>
                        <td className="column-120">{rank}</td>
                        <td className="column-240">{player}</td>
                        <td className="column-360">{points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
