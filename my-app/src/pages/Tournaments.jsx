import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Tournaments.css"; 

export default function Tournaments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="app-container">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <div className="content-wrapper">
          <div className="layout-content-container">
            {/* 🧭 Page Header */}
            <div className="page-header-section">
              <div className="header-text-group">
                <p className="page-title">Upcoming & Ongoing Tournaments</p>
                <p className="page-description">
                  Explore and join exciting chess tournaments happening now or soon.
                </p>
              </div>
            </div>

            {/*  Table Section */}
            <div className="tournaments-table-section">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Tournament Name</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Players</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Knockout Tournament</td>
                      <td>Knockout</td>
                      <td>
                        <button className="status-button proceeding">
                          <span>Ongoing</span>
                        </button>
                      </td>
                      <td>2025-10-01</td>
                      <td>Unknown</td>
                      <td>20</td>
                      <td>
                        <a href="/tournamentdetailsKnockout" className="view-button">
                          View
                        </a>
                      </td>
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
