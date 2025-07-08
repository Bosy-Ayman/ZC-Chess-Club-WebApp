import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Tournaments.css"; 

export default function Tournaments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="app-container">
      {/* Header on top */}
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <div className="content-wrapper">
          <div className="layout-content-container">
            <div className="page-header-section">
              <div className="header-text-group">
                <p className="page-title">Upcoming & Ongoing Tournaments</p>
                <p className="page-description">Explore and join exciting chess tournaments happening now or in the near future.</p>
              </div>
            </div>
            <div className="filter-buttons-container">
              <button className="filter-button">
                <p className="filter-text">All Tournaments</p>
                <div className="caret-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
              <button className="filter-button">
                <p className="filter-text">Swiss</p>
                <div className="caret-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
              <button className="filter-button">
                <p className="filter-text">Knockout</p>
                <div className="caret-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                  </svg>
                </div>
              </button>
            </div>
            <div className="tournaments-table-section">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th className="column-name">Tournament Name</th>
                      <th className="column-type">Type</th>
                      <th className="column-status">Status</th>
                      <th className="column-start-date">Start Date</th>
                      <th className="column-end-date">End Date</th>
                      <th className="column-players">Players</th>
                      <th className="column-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="column-name">Online Blitz Arena</td>
                      <td className="column-type">Swiss</td>
                      <td className="column-status">
                        <button className="status-button ongoing">
                          <span>Ongoing</span>
                        </button>
                      </td>
                      <td className="column-start-date">2025-04-15</td>
                      <td className="column-end-date">2025-07-20</td>
                      <td className="column-players">64</td>
                      <td className="column-action view-action">View</td>
                    </tr>
                    <tr>
                      <td className="column-name">Ramadan Rapid Tournament</td>
                      <td className="column-type">Knockout</td>
                      <td className="column-status">
                        <button className="status-button upcoming">
                          <span>Upcoming</span>
                        </button>
                      </td>
                      <td className="column-start-date">2025-08-05</td>
                      <td className="column-end-date">2025-08-10</td>
                      <td className="column-players">32</td>
                      <td className="column-action view-action">View</td>
                    </tr>
                    <tr>
                      <td className="column-name">Online Blitz Arena</td>
                      <td className="column-type">Swiss</td>
                      <td className="column-status">
                        <button className="status-button upcoming">
                          <span>Upcoming</span>
                        </button>
                      </td>
                      <td className="column-start-date">2025-09-01</td>
                      <td className="column-end-date">2025-09-05</td>
                      <td className="column-players">128</td>
                      <td className="column-action view-action">View</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}