
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

            <div className="p-4">
              <div
                className="challenge-banner"
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAw_59cLYghQJjc29UPPb2kVb2su68VGZo-lazDQjDHmjS8PhIgjaxGbQssxE4wvrCTAj6mUhY8qpffSJcA6_SwLrrpWSkCoCvVGvZ-bTBrovAwMHU_yaDmVaE7fTvRoErXfUzeOEzfzMU_wJKxPl9X03mO_8d262r9AkK8krgvTI4j52mAsprfthY_a7vjoKK0KC1-HTNi8Eczpn0upp3gIaVMWMW46fXJtLboqkgts5Zc8LcU7kAwJ3Jx97RZ5M4oLHHi9shCVVAb")` }}
              >
                <button className="play-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                  </svg>
                </button>
              </div>
            </div>

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
