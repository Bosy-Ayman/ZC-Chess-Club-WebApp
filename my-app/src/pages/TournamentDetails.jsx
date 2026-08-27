import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChallongeBracket from "../components/ChallongeBracket";
import './TournamentDetails.css';

export default function TournamentDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("bracket"); // "bracket" or "table"

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
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { throw new Error("Could not connect to backend server on port 5000."); }
      if (!res.ok) throw new Error(data.error || "Tournament not found");
      setTournament(data);
      if (data.type === "Swiss") {
        setViewMode("table");
      } else {
        setViewMode("bracket");
      }
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
      const text = await res.text();
      let result;
      try { result = JSON.parse(text); } catch (e) { throw new Error("Could not parse server response."); }
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
      const text = await res.text();
      let result;
      try { result = JSON.parse(text); } catch (e) { throw new Error("Could not parse server response."); }
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

  const handleUpdateMatch = async (matchId, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/matches/${matchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { throw new Error("Invalid response from server"); }
      if (!res.ok) throw new Error(data.error || "Failed to update match");
      fetchTournamentDetails();
    } catch (err) {
      alert("Error updating match: " + err.message);
    }
  };

  const handleGenerateNextRound = async () => {
    // Check for pending matches in frontend first
    const pendingMatches = (tournament?.matches || []).filter(m => !m.result || m.result === "Pending");
    if (pendingMatches.length > 0) {
      alert(`⚠️ Cannot generate next round! There are still ${pendingMatches.length} pending match(es) in the current round. Please select all match results first.`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/generate-swiss-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { throw new Error("Invalid response from server. Check backend terminal on port 5000."); }
      if (!res.ok) throw new Error(data.error || "Failed to generate Swiss pairings");
      alert(data.message || "Next round pairings generated!");
      fetchTournamentDetails();
    } catch (err) {
      alert("Error generating pairings: " + err.message);
    }
  };

  const handleGenerateKnockoutBracket = async (shuffle = false) => {
    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/generate-knockout-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shuffle })
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { throw new Error("Invalid response from server."); }
      if (!res.ok) throw new Error(data.error || "Failed to generate bracket");
      alert(data.message || "Knockout bracket generated successfully!");
      fetchTournamentDetails();
    } catch (err) {
      alert("Error generating bracket: " + err.message);
    }
  };

  const handleGenerateNextKnockoutRound = async () => {
    const pendingMatches = (tournament?.matches || []).filter(m => !m.result || m.result === "Pending");
    if (pendingMatches.length > 0) {
      alert(`⚠️ Cannot generate next round! There are still ${pendingMatches.length} pending match(es) in the current round. Please score all matches first.`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/generate-knockout-round`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { throw new Error("Invalid response from server."); }
      if (!res.ok) throw new Error(data.error || "Failed to generate next round");
      alert(data.message || "Next round matchups generated successfully!");
      fetchTournamentDetails();
    } catch (err) {
      alert("Error generating next round: " + err.message);
    }
  };

  // Calculate Swiss Standings from live database matches
  const calculateSwissStandings = (players = [], matches = []) => {
    const statsMap = {};
    players.forEach((p) => {
      statsMap[p.name] = {
        name: p.name,
        rating: p.rating || 1500,
        major: p.major || "-",
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0
      };
    });

    matches.forEach((m) => {
      const white = m.white;
      const black = m.black;
      if (!statsMap[white]) statsMap[white] = { name: white, rating: 1500, major: "-", played: 0, wins: 0, draws: 0, losses: 0, points: 0 };
      if (!statsMap[black]) statsMap[black] = { name: black, rating: 1500, major: "-", played: 0, wins: 0, draws: 0, losses: 0, points: 0 };

      statsMap[white].played += 1;
      statsMap[black].played += 1;

      if (m.result === "1-0" || m.result === "1 - 0") {
        statsMap[white].wins += 1;
        statsMap[white].points += 1;
        statsMap[black].losses += 1;
      } else if (m.result === "0-1" || m.result === "0 - 1") {
        statsMap[black].wins += 1;
        statsMap[black].points += 1;
        statsMap[white].losses += 1;
      } else if (m.result === "1/2-1/2" || m.result === "½ - ½" || m.result === "Draw") {
        statsMap[white].draws += 1;
        statsMap[white].points += 0.5;
        statsMap[black].draws += 1;
        statsMap[black].points += 0.5;
      }
    });

    return Object.values(statsMap).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.rating - a.rating;
    });
  };

  const isSwissFormat = tournament?.type === "Swiss";
  const swissStandings = isSwissFormat ? calculateSwissStandings(tournament?.playersList, tournament?.matches) : [];

  // Group matches by Round for Swiss Round-by-Round display
  const matchesByRound = {};
  if (tournament?.matches) {
    tournament.matches.forEach((m) => {
      const r = m.round || 1;
      if (!matchesByRound[r]) matchesByRound[r] = [];
      matchesByRound[r].push(m);
    });
  }
  const sortedRounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);
  const maxCurrentRound = sortedRounds.length > 0 ? Math.max(...sortedRounds) : 0;
  const nextRoundNum = maxCurrentRound + 1;

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
                  <div className="staff-actions" style={{ gap: "12px", flexWrap: "wrap" }}>
                    <button className="add-btn" onClick={() => setPlayerModalOpen(true)}>
                      + Add Participant
                    </button>
                    
                    {/* Add Match Pairing only makes sense for Knockout if no bracket is generated yet */}
                    {!isSwissFormat && (!tournament.matches || tournament.matches.length === 0) && (
                      <button className="add-btn" onClick={() => setMatchModalOpen(true)}>
                        + Add Manual Matchup
                      </button>
                    )}

                    {/* Bracket Generation buttons for Knockout */}
                    {!isSwissFormat && (!tournament.matches || tournament.matches.length === 0) && (
                      <button 
                        className="add-btn" 
                        onClick={() => handleGenerateKnockoutBracket(false)}
                        style={{ background: "linear-gradient(135deg, #f3c144, #d4a32a)", color: "#15120c", fontWeight: "800" }}
                      >
                        ⚡ Generate Seeded Bracket
                      </button>
                    )}
                    {!isSwissFormat && (!tournament.matches || tournament.matches.length === 0) && (
                      <button 
                        className="add-btn" 
                        onClick={() => handleGenerateKnockoutBracket(true)}
                        style={{ background: "linear-gradient(135deg, #bab19c, #8c8575)", color: "#15120c", fontWeight: "800" }}
                      >
                        🎲 Generate Random Bracket
                      </button>
                    )}

                    {/* Advance to next round for Knockout */}
                    {!isSwissFormat && tournament.matches && tournament.matches.length > 0 && (
                      <button 
                        className="add-btn" 
                        onClick={handleGenerateNextKnockoutRound}
                        style={{ background: "linear-gradient(135deg, #f3c144, #d4a32a)", color: "#15120c", fontWeight: "800" }}
                      >
                        ⚡ Generate Next Round Pairings ➔
                      </button>
                    )}

                    {/* Swiss pairings generation */}
                    {isSwissFormat && (
                      <button 
                        className="add-btn" 
                        onClick={handleGenerateNextRound}
                        style={{ background: "linear-gradient(135deg, #f3c144, #d4a32a)", color: "#15120c", fontWeight: "800" }}
                      >
                        ⚡ Generate Round {nextRoundNum} Pairings
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* SWISS FORMAT SPECIFIC DISPLAY */}
              {isSwissFormat ? (
                <>
                  {/* Swiss Standings Table */}
                  <h2 className="section-title">🏆 Swiss System Standings (Live Table)</h2>
                  <div className="application-table-wrapper" style={{ marginBottom: "40px" }}>
                    <table className="application-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Player Name</th>
                          <th>Points</th>
                          <th>Record (W-D-L)</th>
                          <th>Played</th>
                          <th>Rating</th>
                          <th>Major</th>
                        </tr>
                      </thead>
                      <tbody>
                        {swissStandings.map((p, idx) => (
                          <tr key={idx} style={{ background: idx === 0 ? "rgba(243, 193, 68, 0.08)" : "transparent" }}>
                            <td style={{ fontWeight: "bold", color: idx === 0 ? "#f3c144" : idx === 1 ? "#d0d0d0" : idx === 2 ? "#cd7f32" : "#e8e8e8" }}>
                              {idx === 0 ? "🥇 1st" : idx === 1 ? "🥈 2nd" : idx === 2 ? "🥉 3rd" : `#${idx + 1}`}
                            </td>
                            <td style={{ fontWeight: "600", color: "#fff" }}>{p.name}</td>
                            <td style={{ color: "#f3c144", fontWeight: "800", fontSize: "1.05rem" }}>{p.points} pts</td>
                            <td style={{ color: "#bab19c" }}>{p.wins}W - {p.draws}D - {p.losses}L</td>
                            <td>{p.played}</td>
                            <td>{p.rating}</td>
                            <td>{p.major}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Swiss Round-by-Round Results */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", marginBottom: "15px" }}>
                    <h2 className="section-title" style={{ margin: 0 }}>🗓️ Round-by-Round Pairings & Results</h2>
                    {isStaff && (
                      <button 
                        onClick={handleGenerateNextRound}
                        style={{
                          background: "linear-gradient(135deg, #f3c144, #d4a32a)",
                          color: "#15120c",
                          border: "none",
                          padding: "8px 18px",
                          borderRadius: "8px",
                          fontWeight: "800",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(243, 193, 68, 0.25)"
                        }}
                      >
                        ⚡ Generate Round {nextRoundNum} Pairings ➔
                      </button>
                    )}
                  </div>

                  {sortedRounds.length === 0 ? (
                    <p style={{ color: "#888", fontStyle: "italic", margin: "10px 0 30px" }}>No round results recorded yet.</p>
                  ) : (
                    sortedRounds.map((rNum) => (
                      <div key={rNum} style={{ marginBottom: "28px" }}>
                        <h3 style={{ color: "#f3c144", fontSize: "1.1rem", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Round {rNum} Pairings & Results
                        </h3>
                        <div className="application-table-wrapper">
                          <table className="application-table">
                            <thead>
                              <tr>
                                <th>Board</th>
                                <th>White Player</th>
                                <th>Result / Toggle (Staff)</th>
                                <th>Black Player</th>
                              </tr>
                            </thead>
                            <tbody>
                              {matchesByRound[rNum].map((m, idx) => (
                                <tr key={m._id || idx}>
                                  <td style={{ color: "#888" }}>Board {idx + 1}</td>
                                  <td style={{ fontWeight: m.result === "1-0" || m.result === "1 - 0" ? "bold" : "normal", color: m.result === "1-0" || m.result === "1 - 0" ? "#f3c144" : "#fff" }}>
                                    {m.white} {m.result === "1-0" || m.result === "1 - 0" ? "✓" : ""}
                                  </td>
                                  <td>
                                    {isStaff && m._id ? (
                                      <select
                                        value={m.result}
                                        onChange={(e) => handleUpdateMatch(m._id, { result: e.target.value })}
                                        style={{
                                          background: "#15120c",
                                          color: "#f3c144",
                                          border: "1px solid #f3c144",
                                          padding: "4px 10px",
                                          borderRadius: "6px",
                                          fontWeight: "800",
                                          fontSize: "0.88rem",
                                          cursor: "pointer"
                                        }}
                                      >
                                        <option value="1-0">1 - 0 (White Wins)</option>
                                        <option value="0-1">0 - 1 (Black Wins)</option>
                                        <option value="1/2-1/2">½ - ½ (Draw)</option>
                                        <option value="Pending">Pending</option>
                                      </select>
                                    ) : (
                                      <span style={{ color: "#f4c653", fontWeight: "bold", fontSize: "1rem" }}>{m.result}</span>
                                    )}
                                  </td>
                                  <td style={{ fontWeight: m.result === "0-1" || m.result === "0 - 1" ? "bold" : "normal", color: m.result === "0-1" || m.result === "0 - 1" ? "#f3c144" : "#fff" }}>
                                    {m.black} {m.result === "0-1" || m.result === "0 - 1" ? "✓" : ""}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))
                  )}
                </>
              ) : (
                /* KNOCKOUT FORMAT SPECIFIC DISPLAY (Challonge Tree + Table View) */
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", margin: "30px 0 15px" }}>
                    <h2 className="section-title" style={{ margin: 0 }}>Knockout Matches & Bracket</h2>
                    
                    {/* View Mode Toggle Buttons */}
                    <div style={{ display: "flex", gap: "8px", background: "#15120c", padding: "4px", borderRadius: "8px", border: "1px solid #36332b" }}>
                      <button
                        onClick={() => setViewMode("bracket")}
                        style={{
                          background: viewMode === "bracket" ? "#f3c144" : "transparent",
                          color: viewMode === "bracket" ? "#15120c" : "#b5afa1",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontWeight: "700",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        ⚡ Challonge Bracket Tree
                      </button>
                      <button
                        onClick={() => setViewMode("table")}
                        style={{
                          background: viewMode === "table" ? "#f3c144" : "transparent",
                          color: viewMode === "table" ? "#15120c" : "#b5afa1",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontWeight: "700",
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        📋 Table View
                      </button>
                    </div>
                  </div>

                  {viewMode === "bracket" ? (
                    <ChallongeBracket 
                      tournamentId={tournamentId}
                      tournamentType={tournament.type}
                      matchesData={tournament.matches} 
                      playersData={tournament.playersList}
                      tournamentTitle={`${tournament.title} (${tournament.type || "Knockout Bracket"})`} 
                      isStaff={isStaff}
                      onUpdateMatch={handleUpdateMatch}
                    />
                  ) : (!tournament.matches || tournament.matches.length === 0) ? (
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
                              <td style={{ fontWeight: m.result === "1-0" || m.result === "1 - 0" ? "bold" : "normal", color: m.result === "1-0" || m.result === "1 - 0" ? "#f3c144" : "#fff" }}>
                                {m.white} {m.result === "1-0" || m.result === "1 - 0" ? "✓" : ""}
                              </td>
                              <td style={{ fontWeight: m.result === "0-1" || m.result === "0 - 1" ? "bold" : "normal", color: m.result === "0-1" || m.result === "0 - 1" ? "#f3c144" : "#fff" }}>
                                {m.black} {m.result === "0-1" || m.result === "0 - 1" ? "✓" : ""}
                              </td>
                              <td>
                                {isStaff && m._id ? (
                                  <select
                                    value={m.result}
                                    onChange={(e) => handleUpdateMatch(m._id, { result: e.target.value })}
                                    style={{
                                      background: "#15120c",
                                      color: "#f3c144",
                                      border: "1px solid #f3c144",
                                      padding: "4px 10px",
                                      borderRadius: "6px",
                                      fontWeight: "800",
                                      fontSize: "0.88rem",
                                      cursor: "pointer"
                                    }}
                                  >
                                    <option value="1-0">1 - 0 (White Wins)</option>
                                    <option value="0-1">0 - 1 (Black Wins)</option>
                                    <option value="1/2-1/2">½ - ½ (Draw)</option>
                                    <option value="Pending">Pending</option>
                                  </select>
                                ) : (
                                  <span style={{ color: "#f4c653", fontWeight: "bold", fontSize: "1rem" }}>{m.result}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
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
                <label>White Player *</label>
                <select
                  value={matchForm.white}
                  onChange={(e) => setMatchForm({ ...matchForm, white: e.target.value })}
                  style={{ background: "#15120c", color: "#fff", border: "1px solid #36332b", padding: "8px", borderRadius: "8px", width: "100%", marginTop: "5px" }}
                  required
                >
                  <option value="">-- Select White Player --</option>
                  {(tournament.playersList || []).map(p => (
                    <option key={p.name} value={p.name}>{p.name} ({p.rating || 1500})</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Black Player *</label>
                <select
                  value={matchForm.black}
                  onChange={(e) => setMatchForm({ ...matchForm, black: e.target.value })}
                  style={{ background: "#15120c", color: "#fff", border: "1px solid #36332b", padding: "8px", borderRadius: "8px", width: "100%", marginTop: "5px" }}
                  required
                >
                  <option value="">-- Select Black Player --</option>
                  <option value="BYE">BYE (Free Win)</option>
                  {(tournament.playersList || []).map(p => (
                    <option key={p.name} value={p.name}>{p.name} ({p.rating || 1500})</option>
                  ))}
                </select>
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
