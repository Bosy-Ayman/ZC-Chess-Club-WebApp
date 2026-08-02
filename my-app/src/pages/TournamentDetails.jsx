import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './TournamentDetails.css';

export default function TournamentDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check role
  const userRole = localStorage.getItem("userRole") || "member";
  const isLoggedIn = !!localStorage.getItem("adminToken");
  const isStaff = isLoggedIn && (userRole === "admin" || userRole === "oc");

  // Parse ID
  const queryParams = new URLSearchParams(window.location.search);
  const tournamentId = queryParams.get("id");

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchTournamentDetails = async () => {
    if (!tournamentId) {
      setError("No tournament selected.");
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}`);
      if (!res.ok) throw new Error("Tournament not found");
      const data = await res.json();
      setTournament(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournamentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  // Modals state
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [playerForm, setPlayerForm] = useState({ name: "", rating: "", major: "" });

  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchForm, setMatchForm] = useState({ round: 1, white: "", black: "", result: "1-0" });

  const handleAddPlayerSubmit = async (e) => {
    e.preventDefault();
    if (!playerForm.name || !playerForm.rating || !playerForm.major) {
      alert("All fields are required.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/players`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playerForm)
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to add player.");
      }
      setPlayerForm({ name: "", rating: "", major: "" });
      setPlayerModalOpen(false);
      fetchTournamentDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddMatchSubmit = async (e) => {
    e.preventDefault();
    if (!matchForm.white || !matchForm.black) {
      alert("Please fill in both player names.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/matches`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchForm)
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to add match result.");
      }
      setMatchForm({ round: matchForm.round, white: "", black: "", result: "1-0" });
      setMatchModalOpen(false);
      fetchTournamentDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  // Sort players by rating descending
  const sortedPlayers = [...(tournament?.playersList || [])].sort((a, b) => b.rating - a.rating);

  return (
    <div className="tournament-wrapper">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <div className="main-content">
          {isLoading ? (
            <div style={{ color: "#caba91", textAlign: "center", padding: "50px", fontSize: "1.2rem" }}>
              Loading tournament details...
            </div>
          ) : error || !tournament ? (
            <div style={{ color: "#e74c3c", textAlign: "center", padding: "50px", fontSize: "1.2rem" }}>
              {error || "Could not retrieve tournament details. Please verify the URL."}
            </div>
          ) : (
            <>
              {/* Intro Banner */}
              <div className="intro-text">
                <h1>{tournament.title}</h1>
                <p>
                  {tournament.startDate} {tournament.endDate && tournament.endDate !== 'Unknown' ? `to ${tournament.endDate}` : ""} — {tournament.location} ({tournament.type})
                </p>
                {tournament.description && (
                  <p style={{ marginTop: "12px", color: "#bab19c", fontStyle: "italic", fontSize: "15px", maxWidth: "800px", lineHeight: "1.5" }}>
                    {tournament.description}
                  </p>
                )}
              </div>

              {/* Tournament Progress Box */}
              <h2 className="section-title">Tournament Progress</h2>
              <div className="role-card">
                <div className="role-info">
                  <p className="title">Status: {tournament.status}</p>
                  <p className="desc">Time: {tournament.time} | Participants: {tournament.players}</p>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ 
                        width: tournament.status === "Completed" ? "100%" : tournament.status === "Ongoing" ? "50%" : "10%" 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Staff controls for OC and Admins */}
              {isStaff && (
                <div style={{ marginTop: "30px" }}>
                  <h2 className="section-title">Staff Actions (Organizing Committee)</h2>
                  <div className="staff-actions">
                    <button className="add-btn" onClick={() => setPlayerModalOpen(true)}>
                      + Add Participant
                    </button>
                    <button className="add-btn" onClick={() => setMatchModalOpen(true)}>
                      + Record Match Result
                    </button>
                  </div>
                </div>
              )}

              {/* Players Section */}
              <h2 className="section-title">Player List</h2>
              {sortedPlayers.length === 0 ? (
                <p style={{ color: "#888", fontStyle: "italic", margin: "10px 0 30px" }}>No players registered in this tournament yet.</p>
              ) : (
                <div className="application-table-wrapper" style={{ marginBottom: "40px" }}>
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
                      {sortedPlayers.map((p, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{p.name}</td>
                          <td>{p.rating}</td>
                          <td>{p.major}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Matches / Game Results Section */}
              <h2 className="section-title">Match Results</h2>
              {(!tournament.matches || tournament.matches.length === 0) ? (
                <p style={{ color: "#888", fontStyle: "italic", margin: "10px 0" }}>No match results recorded yet.</p>
              ) : (
                <div className="application-table-wrapper">
                  <table className="application-table">
                    <thead>
                      <tr>
                        <th>Round</th>
                        <th>White Player</th>
                        <th>Black Player</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournament.matches.map((m, index) => (
                        <tr key={index}>
                          <td>Round {m.round}</td>
                          <td>{m.white}</td>
                          <td>{m.black}</td>
                          <td style={{ color: "#f4c653", fontWeight: "bold" }}>{m.result}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* --- ADD PLAYER MODAL --- */}
      {playerModalOpen && (
        <div className="modal-overlay" onClick={() => setPlayerModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setPlayerModalOpen(false)}>
              &times;
            </button>
            <h3 className="modal-title">Add Participant</h3>
            <form onSubmit={handleAddPlayerSubmit} className="modal-form">
              <div>
                <label>Player Name *</label>
                <input 
                  type="text" 
                  value={playerForm.name} 
                  onChange={(e) => setPlayerForm({ ...playerForm, name: e.target.value })} 
                  placeholder="e.g. Magnus Carlsen"
                  required 
                />
              </div>
              <div>
                <label>Rating *</label>
                <input 
                  type="number" 
                  value={playerForm.rating} 
                  onChange={(e) => setPlayerForm({ ...playerForm, rating: e.target.value })} 
                  placeholder="e.g. 2100"
                  required 
                />
              </div>
              <div>
                <label>Major *</label>
                <input 
                  type="text" 
                  value={playerForm.major} 
                  onChange={(e) => setPlayerForm({ ...playerForm, major: e.target.value })} 
                  placeholder="e.g. Computer Science"
                  required 
                />
              </div>
              <div className="modal-btn-row">
                <button type="button" className="btn-secondary" onClick={() => setPlayerModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Participant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD MATCH MODAL --- */}
      {matchModalOpen && (
        <div className="modal-overlay" onClick={() => setMatchModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setMatchModalOpen(false)}>
              &times;
            </button>
            <h3 className="modal-title">Record Match Result</h3>
            <form onSubmit={handleAddMatchSubmit} className="modal-form">
              <div>
                <label>Round *</label>
                <input 
                  type="number" 
                  value={matchForm.round} 
                  onChange={(e) => setMatchForm({ ...matchForm, round: e.target.value })} 
                  min="1"
                  required 
                />
              </div>
              <div>
                <label>White Player Name *</label>
                <input 
                  type="text" 
                  value={matchForm.white} 
                  onChange={(e) => setMatchForm({ ...matchForm, white: e.target.value })} 
                  placeholder="White"
                  required 
                />
              </div>
              <div>
                <label>Black Player Name *</label>
                <input 
                  type="text" 
                  value={matchForm.black} 
                  onChange={(e) => setMatchForm({ ...matchForm, black: e.target.value })} 
                  placeholder="Black"
                  required 
                />
              </div>
              <div>
                <label>Result *</label>
                <select 
                  value={matchForm.result} 
                  onChange={(e) => setMatchForm({ ...matchForm, result: e.target.value })}
                >
                  <option value="1-0">1 - 0 (White Wins)</option>
                  <option value="0-1">0 - 1 (Black Wins)</option>
                  <option value="1/2-1/2">½ - ½ (Draw)</option>
                </select>
              </div>
              <div className="modal-btn-row">
                <button type="button" className="btn-secondary" onClick={() => setMatchModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
