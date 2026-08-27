import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Tournaments.css"; 

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Tournaments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/tournaments`)
      .then(res => res.json())
      .then(data => {
        setTournaments(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tournaments:", err);
        setIsLoading(false);
      });
  }, []);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "proceeding";
      case "upcoming":
        return "upcoming";
      case "completed":
        return "completed";
      default:
        return "";
    }
  };

  return (
    <div className="app-container">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <div className="content-wrapper">
          <div className="layout-content-container">
            {/* Page Header */}
            <div className="page-header-section">
              <div className="header-text-group">
                <p className="page-title">Tournaments</p>
                <p className="page-description">
                  Explore and join exciting chess tournaments happening now or soon.
                </p>
              </div>
            </div>

            {/* Table Section */}
            <div className="tournaments-table-section">
              <div className="table-container">
                {isLoading ? (
                  <div className="tournaments-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading tournaments…</p>
                  </div>
                ) : tournaments.length === 0 ? (
                  <div className="tournaments-empty-state">
                    <div className="empty-icon">♟</div>
                    <p>No tournaments scheduled yet. Check back soon!</p>
                  </div>
                ) : (
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
                      {tournaments.map((t) => (
                        <tr key={t._id}>
                          <td>{t.title}</td>
                          <td>{t.type}</td>
                          <td>
                            <span className={`status-button ${getStatusClass(t.status)}`}>
                              {t.status}
                            </span>
                          </td>
                          <td>{t.startDate}</td>
                          <td>{t.endDate || "—"}</td>
                          <td>{t.players}</td>
                          <td>
                            {t.detailsUrl ? (
                              <a href={t.detailsUrl} target="_blank" rel="noopener noreferrer" className="view-button">
                                View / Register
                              </a>
                            ) : (
                              <a href={`/tournamentdetails?id=${t._id}`} className="view-button">
                                View Details
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
