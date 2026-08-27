import React, { useState, useEffect } from "react";
import "./ChallongeBracket.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

/**
 * Helper function to transform raw MongoDB matches into Challonge-style Round Columns
 * @param {Array} dbMatches - Array of matches from MongoDB [{ round, white, black, result }]
 * @param {Array} dbPlayers - Optional Array of players from MongoDB [{ name, rating }]
 */
function convertDBMatchesToBracket(dbMatches = [], dbPlayers = []) {
  if (!dbMatches || dbMatches.length === 0) {
    return { upper: [], lower: [], champion: null };
  }

  // Create a seed map from players list if available
  const playerSeedMap = {};
  if (dbPlayers && dbPlayers.length > 0) {
    // Sort players by rating descending to assign seeds
    const sorted = [...dbPlayers].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    sorted.forEach((p, idx) => {
      playerSeedMap[p.name] = idx + 1;
    });
  }

  // Group matches by round number
  const roundsMap = {};
  dbMatches.forEach((m) => {
    const r = m.round || 1;
    if (!roundsMap[r]) roundsMap[r] = [];
    roundsMap[r].push(m);
  });

  const sortedRoundNumbers = Object.keys(roundsMap).map(Number).sort((a, b) => a - b);
  const totalRounds = sortedRoundNumbers.length;

  const upperRounds = sortedRoundNumbers.map((rNum, idx) => {
    // Determine dynamic round title
    let roundName = `Round ${rNum}`;
    if (idx === totalRounds - 1 && totalRounds > 1) {
      roundName = "Grand Finals";
    } else if (idx === totalRounds - 2 && totalRounds > 2) {
      roundName = "Semifinals";
    } else if (idx === 0 && totalRounds > 2) {
      roundName = "Quarterfinals";
    }

    const matchesInRound = roundsMap[rNum].map((m, mIdx) => {
      const p1Winner = m.result === "1-0" || m.result === "1 - 0";
      const p2Winner = m.result === "0-1" || m.result === "0 - 1";
      const isDraw = m.result === "1/2-1/2" || m.result === "½ - ½" || m.result === "Draw";

      const p1Score = p1Winner ? "1" : isDraw ? "½" : "0";
      const p2Score = p2Winner ? "1" : isDraw ? "½" : "0";

      return {
        id: m._id || `db-match-${rNum}-${mIdx}`,
        matchCode: `R${rNum}-M${mIdx + 1}`,
        p1: {
          seed: playerSeedMap[m.white] || mIdx * 2 + 1,
          name: m.white || "TBD",
          score: p1Score,
          isWinner: p1Winner
        },
        p2: {
          seed: playerSeedMap[m.black] || mIdx * 2 + 2,
          name: m.black || "TBD",
          score: p2Score,
          isWinner: p2Winner
        },
        status: "Completed"
      };
    });

    return {
      roundName,
      roundNumber: rNum,
      matches: matchesInRound
    };
  });

  // Extract champion from final match if available
  let champion = null;
  if (upperRounds.length > 0) {
    const finalRound = upperRounds[upperRounds.length - 1];
    const finalMatch = finalRound.matches[finalRound.matches.length - 1];
    if (finalMatch) {
      if (finalMatch.p1.isWinner) {
        champion = {
          name: finalMatch.p1.name,
          title: "Tournament Winner",
          seed: finalMatch.p1.seed,
          trophy: "🥇 Grand Champion"
        };
      } else if (finalMatch.p2.isWinner) {
        champion = {
          name: finalMatch.p2.name,
          title: "Tournament Winner",
          seed: finalMatch.p2.seed,
          trophy: "🥇 Grand Champion"
        };
      }
    }
  }

  return {
    upper: upperRounds,
    lower: [], // Can be populated if lower bracket matches exist
    champion
  };
}

export default function ChallongeBracket({ 
  tournamentId, 
  tournamentType,
  matchesData, 
  playersData, 
  tournamentTitle = "Knockout Championship Bracket",
  isStaff = false,
  onUpdateMatch
}) {
  const [activeTab, setActiveTab] = useState("upper"); // "upper" or "lower"
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedMatchModal, setSelectedMatchModal] = useState(null);
  const [tempWhite, setTempWhite] = useState("");
  const [tempBlack, setTempBlack] = useState("");

  const [dbMatches, setDbMatches] = useState(matchesData || []);
  const [dbPlayers, setDbPlayers] = useState(playersData || []);
  const [dbTitle, setDbTitle] = useState(tournamentTitle);
  const [dbType, setDbType] = useState(tournamentType || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const rawMatch = selectedMatchModal 
    ? dbMatches.find(m => m._id === selectedMatchModal.id) 
    : null;

  // Fetch matches directly from MongoDB API if tournamentId is provided
  useEffect(() => {
    if (tournamentId) {
      fetchFromDatabase(tournamentId);
    } else if (matchesData) {
      setDbMatches(matchesData);
    }
  }, [tournamentId, matchesData]);

  const fetchFromDatabase = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${id}`);
      if (!res.ok) throw new Error("Failed to fetch tournament from database");
      const data = await res.json();
      setDbMatches(data.matches || []);
      setDbPlayers(data.playersList || []);
      if (data.type) setDbType(data.type);
      if (data.title) setDbTitle(data.title);
    } catch (err) {
      console.error("Database fetch error for Challonge bracket:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert raw DB matches into Challonge tree structure
  const bracketData = convertDBMatchesToBracket(dbMatches, dbPlayers);
  const currentRounds = activeTab === "upper" ? bracketData.upper : bracketData.lower;
  const isSingleElimination = (dbType || tournamentType) === "Knockout Single Elimination";

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.4));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="challonge-wrapper glass-panel">
      {/* Bracket Top Navigation Bar */}
      <div className="challonge-header">
        <div className="challonge-title-area">
          <span className="challonge-live-badge">⚡ Live Database Bracket</span>
          <h2 className="challonge-tournament-name">{dbTitle}</h2>
        </div>

        <div className="challonge-controls">
          {/* Upper / Lower Bracket Toggle (Hide Lower Bracket for Single Elimination) */}
          {!isSingleElimination && (
            <div className="bracket-tab-group">
              <button
                className={`bracket-tab-btn ${activeTab === "upper" ? "active" : ""}`}
                onClick={() => setActiveTab("upper")}
              >
                👑 Main Bracket
              </button>
              <button
                className={`bracket-tab-btn ${activeTab === "lower" ? "active" : ""}`}
                onClick={() => setActiveTab("lower")}
              >
                ⚡ Lower Bracket
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="zoom-controls">
            <button onClick={handleZoomOut} title="Zoom Out" className="zoom-btn">
              -
            </button>
            <span className="zoom-percentage">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={handleZoomIn} title="Zoom In" className="zoom-btn">
              +
            </button>
            <button onClick={handleResetZoom} title="Reset Zoom" className="zoom-btn reset">
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Bracket Canvas */}
      <div className="bracket-canvas-container">
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#f3c144", fontSize: "1.1rem" }}>
            Connecting to MongoDB database...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#e74c3c" }}>
            Database Error: {error}
          </div>
        ) : currentRounds.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#b5afa1" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "8px", color: "#fff" }}>No match results recorded in database yet.</p>
            <p style={{ fontSize: "0.9rem", color: "#888" }}>
              Staff members can add match results under <strong>Staff Actions</strong> to build the bracket tree live!
            </p>
          </div>
        ) : (
          <div
            className="bracket-tree-canvas"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top left" }}
          >
            {currentRounds.map((round, rIndex) => (
              <div key={rIndex} className="bracket-round-column">
                {/* Round Header */}
                <div className="round-header-box">
                  <span className="round-number-tag">R{round.roundNumber}</span>
                  <span className="round-name-text">{round.roundName}</span>
                </div>

                {/* Round Matchup Cards */}
                <div className="round-matches-list">
                  {round.matches.map((match) => (
                    <div
                      key={match.id}
                      className="match-card glass-panel-card clickable-match"
                      onClick={() => {
                        setSelectedMatchModal(match);
                        setTempWhite(match.p1.name);
                        setTempBlack(match.p2.name);
                      }}
                    >
                      <div className="match-card-header">
                        <span className="match-code">{match.matchCode}</span>
                        <span className={`match-status-badge ${match.status.toLowerCase()}`}>
                          {match.status}
                        </span>
                      </div>

                      {/* Player 1 Row */}
                      <div className={`match-player-row ${match.p1.isWinner ? "winner" : "loser"}`}>
                        <div className="player-meta">
                          <span className="player-seed">#{match.p1.seed}</span>
                          <span className="player-name">{match.p1.name}</span>
                        </div>
                        <div className="player-score">
                          {match.p1.score}
                          {match.p1.isWinner && <span className="winner-check">✓</span>}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="match-vs-divider"></div>

                      {/* Player 2 Row */}
                      <div className={`match-player-row ${match.p2.isWinner ? "winner" : "loser"}`}>
                        <div className="player-meta">
                          <span className="player-seed">#{match.p2.seed}</span>
                          <span className="player-name">{match.p2.name}</span>
                        </div>
                        <div className="player-score">
                          {match.p2.score}
                          {match.p2.isWinner && <span className="winner-check">✓</span>}
                        </div>
                      </div>

                      {/* Connecting Branch Line */}
                      <div className="connector-line-out"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Grand Champion Trophy Feature */}
            {activeTab === "upper" && bracketData.champion && (
              <div className="bracket-round-column champion-column">
                <div className="round-header-box gold">
                  <span className="round-number-tag gold">👑</span>
                  <span className="round-name-text gold">Tournament Winner</span>
                </div>

                <div className="champion-display-box glass-panel-card gold-glow">
                  <div className="champion-trophy-icon">🏆</div>
                  <h3 className="champion-name">{bracketData.champion.name}</h3>
                  <span className="champion-title-tag">{bracketData.champion.title}</span>
                  <span className="champion-seed-tag">Seed #{bracketData.champion.seed}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Match Details Modal Popup */}
      {selectedMatchModal && (
        <div className="match-modal-overlay" onClick={() => setSelectedMatchModal(null)}>
          <div className="match-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="match-modal-close" onClick={() => setSelectedMatchModal(null)}>
              ✕
            </button>
            <div className="match-modal-header">
              <span className="match-code-tag">{selectedMatchModal.matchCode}</span>
              <h3 style={{ margin: "8px 0 0", color: "#fff" }}>Database Match Details</h3>
            </div>

            <div className="match-modal-vs-box">
              <div className={`modal-player-card ${selectedMatchModal.p1.isWinner ? "winner" : ""}`}>
                <span className="modal-seed">Seed #{selectedMatchModal.p1.seed}</span>
                {isStaff && (rawMatch ? (!rawMatch.result || rawMatch.result === "Pending") : true) ? (
                  <select
                    value={tempWhite}
                    onChange={(e) => setTempWhite(e.target.value)}
                    style={{ background: "#15120c", color: "#fff", border: "1px solid #36332b", padding: "6px", borderRadius: "6px", width: "100%", marginTop: "8px", fontWeight: "600", fontSize: "0.85rem", outline: "none" }}
                  >
                    {dbPlayers.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <h4 className="modal-player-name">{selectedMatchModal.p1.name}</h4>
                )}
                <span className="modal-score-big">{selectedMatchModal.p1.score}</span>
              </div>

              <div className="modal-vs-symbol">VS</div>

              <div className={`modal-player-card ${selectedMatchModal.p2.isWinner ? "winner" : ""}`}>
                <span className="modal-seed">Seed #{selectedMatchModal.p2.seed}</span>
                {isStaff && (rawMatch ? (!rawMatch.result || rawMatch.result === "Pending") : true) ? (
                  <select
                    value={tempBlack}
                    onChange={(e) => setTempBlack(e.target.value)}
                    style={{ background: "#15120c", color: "#fff", border: "1px solid #36332b", padding: "6px", borderRadius: "6px", width: "100%", marginTop: "8px", fontWeight: "600", fontSize: "0.85rem", outline: "none" }}
                  >
                    <option value="BYE">BYE</option>
                    {dbPlayers.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                ) : (
                  <h4 className="modal-player-name">{selectedMatchModal.p2.name}</h4>
                )}
                <span className="modal-score-big">{selectedMatchModal.p2.score}</span>
              </div>
            </div>

            {isStaff && (rawMatch ? (!rawMatch.result || rawMatch.result === "Pending") : true) && (tempWhite !== selectedMatchModal.p1.name || tempBlack !== selectedMatchModal.p2.name) && (
              <button
                onClick={async () => {
                  try {
                    await onUpdateMatch(selectedMatchModal.id, { white: tempWhite, black: tempBlack });
                    setSelectedMatchModal(null);
                  } catch (err) {
                    alert("Error: " + err.message);
                  }
                }}
                style={{
                  background: "linear-gradient(135deg, #f3c144, #d4a32a)",
                  color: "#15120c",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontWeight: "800",
                  width: "100%",
                  marginTop: "15px",
                  cursor: "pointer"
                }}
              >
                💾 Save Matchup Pairing
              </button>
            )}

            <div className="match-modal-info">
              <p>Status: <strong>{selectedMatchModal.status}</strong></p>
              <p>Source: <strong>MongoDB Atlas Cluster Database</strong></p>
            </div>

            {isStaff && onUpdateMatch && (
              <div className="match-modal-actions" style={{ marginTop: "20px", borderTop: "1px solid #36332b", paddingTop: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#bab19c", fontSize: "0.88rem", fontWeight: "600" }}>Record Score:</span>
                <select
                  value={rawMatch ? rawMatch.result : "Pending"}
                  onChange={async (e) => {
                    const newResult = e.target.value;
                    try {
                      await onUpdateMatch(selectedMatchModal.id, { result: newResult });
                      setSelectedMatchModal(null);
                    } catch (err) {
                      alert("Error: " + err.message);
                    }
                  }}
                  style={{
                    background: "#15120c",
                    color: "#f3c144",
                    border: "1px solid #f3c144",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontWeight: "800",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <option value="Pending">Pending</option>
                  <option value="1-0">1 - 0 (White Wins)</option>
                  <option value="0-1">0 - 1 (Black Wins)</option>
                  <option value="1/2-1/2">½ - ½ (Draw)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
