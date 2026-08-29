import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Admin.css";

// API Base URL - works for both local and production
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [activeTab, setActiveTab] = useState("add-tournament");
  
  // Puzzle Challenge Tournament states
  const [puzzleTitle, setPuzzleTitle] = useState("");
  const [puzzleStartDate, setPuzzleStartDate] = useState("");
  const [puzzleTimeLimit, setPuzzleTimeLimit] = useState(60);
  const [puzzlesList, setPuzzlesList] = useState([]);

  // Active puzzle setup state
  const [activePuzzleFen, setActivePuzzleFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [activePuzzleMateIn, setActivePuzzleMateIn] = useState(1);
  const [activePuzzleMoves, setActivePuzzleMoves] = useState([]);
  const [activePuzzleDesc, setActivePuzzleDesc] = useState("");
  const [setupMode, setSetupMode] = useState(true); // true = setup pieces; false = record solution moves
  const [selectedPiece, setSelectedPiece] = useState(null); // { type: 'p'|'r'..., color: 'w'|'b' } or 'clear'
  const [chessInstance, setChessInstance] = useState(new Chess());
  const [initialPuzzleFen, setInitialPuzzleFen] = useState("");

  const [tournaments, setTournaments] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal state for applications
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Form state for new tournament
  const [form, setForm] = useState({
    title: "",
    type: "Swiss",
    status: "Upcoming",
    startDate: "",
    endDate: "",
    time: "",
    location: "Zewail Chess Club",
    description: "",
    players: 0,
    detailsUrl: "",
    rounds: 5  // Swiss only — FIDE: N rounds needs ≥ N+1 players
  });

  // Fetch tournaments and applications
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Tournaments
      const tourRes = await fetch(`${API_BASE}/api/tournaments`);
      if (tourRes.ok) {
        const tourData = await tourRes.json();
        setTournaments(tourData);
      }

      // Fetch Applications
      const appRes = await fetch(`${API_BASE}/api/applications`);
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData);
      }

      // Fetch Users
      if (userRole === "admin") {
        const userRes = await fetch(`${API_BASE}/api/users`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsers(userData);
        }
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setErrorMessage("Failed to load dashboard data. Is the server running?");
    } finally {
      setIsLoading(false);
    }
  };

  const userRole = localStorage.getItem("userRole") || "member";

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/?login=true");
      return;
    }
    if (userRole !== "admin" && userRole !== "oc" && userRole !== "hr") {
      navigate("/");
      return;
    }
    
    // Set default active tab based on query param or role
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    } else if (userRole === "hr") {
      setActiveTab("applications");
    } else {
      setActiveTab("add-tournament");
    }
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, userRole, location.search]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleUpdateStatus = async (id, status) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/applications/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status.");
      }
      setSuccessMessage(`Application ${status.toLowerCase()} successfully!`);
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setErrorMessage(err.message || "Failed to update status.");
    }
  };

  // Chess editor helpers
  const handleSquareClick = (square) => {
    if (!setupMode) return;
    
    try {
      let newChess;
      try {
        newChess = new Chess(chessInstance ? chessInstance.fen() : undefined);
      } catch (e) {
        // If FEN validation fails due to temporary missing king during custom piece setup,
        // create a fresh board and copy existing piece placements
        newChess = new Chess();
        newChess.clear();
        if (chessInstance && typeof chessInstance.board === "function") {
          const currentBoard = chessInstance.board();
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
              const piece = currentBoard[r][c];
              if (piece) {
                const sq = String.fromCharCode(97 + c) + (8 - r);
                newChess.put({ type: piece.type, color: piece.color }, sq);
              }
            }
          }
        }
      }

      if (selectedPiece === "clear") {
        newChess.remove(square);
      } else if (selectedPiece) {
        newChess.put({ type: selectedPiece.type, color: selectedPiece.color }, square);
      }
      
      setChessInstance(newChess);
      setActivePuzzleFen(newChess.fen());
    } catch (err) {
      console.warn("Square click edit handled safely:", err);
    }
  };

  const handleToggleTurn = () => {
    try {
      const currentFen = activePuzzleFen || (chessInstance ? chessInstance.fen() : "");
      const fenParts = currentFen.split(" ");
      if (fenParts.length >= 2) {
        fenParts[1] = fenParts[1] === "w" ? "b" : "w";
        const newFen = fenParts.join(" ");
        try {
          const newChess = new Chess(newFen);
          setChessInstance(newChess);
        } catch (e) {
          // Keep new FEN string in active setup state if chess.js strict validation fails
        }
        setActivePuzzleFen(newFen);
      }
    } catch (err) {
      alert("Invalid board state to change turn!");
    }
  };

  const handleStartRecording = () => {
    const board = chessInstance.board();
    let whiteKing = false;
    let blackKing = false;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k') {
          if (piece.color === 'w') whiteKing = true;
          if (piece.color === 'b') blackKing = true;
        }
      }
    }

    if (!whiteKing || !blackKing) {
      alert("Both White and Black Kings must be placed on the board before recording moves!");
      return;
    }

    setInitialPuzzleFen(chessInstance.fen());
    setSetupMode(false);
    setActivePuzzleMoves([]);
    alert("Record Solution Mode ON. Drag and drop pieces to make correct solution moves.");
  };

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    if (setupMode) return false;
    
    try {
      const newChess = new Chess(chessInstance.fen());
      const move = newChess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      });
      
      if (move) {
        setChessInstance(newChess);
        setActivePuzzleFen(newChess.fen());
        setActivePuzzleMoves([...activePuzzleMoves, move.lan]);
        return true;
      }
    } catch (err) {
      alert("Invalid move! Pieces must follow legal chess rules.");
    }
    return false;
  };

  const handleUndoMove = () => {
    if (activePuzzleMoves.length === 0) return;
    try {
      const replayChess = new Chess(initialPuzzleFen);
      const newMoves = activePuzzleMoves.slice(0, -1);
      newMoves.forEach(m => {
        replayChess.move(m);
      });
      setChessInstance(replayChess);
      setActivePuzzleFen(replayChess.fen());
      setActivePuzzleMoves(newMoves);
    } catch (err) {
      alert("Error undoing move!");
    }
  };

  const handleAddPuzzle = () => {
    if (activePuzzleMoves.length === 0) {
      alert("Please record the correct solution moves first!");
      return;
    }
    
    const newPuzzle = {
      initialFen: initialPuzzleFen,
      mateIn: activePuzzleMateIn,
      correctMoves: activePuzzleMoves,
      description: activePuzzleDesc || `Mate in ${activePuzzleMateIn}`
    };
    
    setPuzzlesList([...puzzlesList, newPuzzle]);
    
    // Reset editor
    const defaultChess = new Chess();
    setChessInstance(defaultChess);
    setActivePuzzleFen(defaultChess.fen());
    setInitialPuzzleFen("");
    setActivePuzzleMoves([]);
    setActivePuzzleDesc("");
    setSetupMode(true);
    setSelectedPiece(null);
  };

  const handleCreatePuzzleTournament = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    if (puzzlesList.length === 0) {
      setErrorMessage("Please add at least one puzzle to the tournament!");
      return;
    }
    
    try {
      const res = await fetch(`${API_BASE}/api/puzzle-tournaments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: puzzleTitle,
          startDate: puzzleStartDate,
          timeLimit: puzzleTimeLimit,
          puzzles: puzzlesList
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create tournament.");
      }
      
      setSuccessMessage("Puzzle tournament created successfully!");
      setPuzzleTitle("");
      setPuzzleStartDate("");
      setPuzzleTimeLimit(60);
      setPuzzlesList([]);
    } catch (err) {
      setErrorMessage(err.message || "Failed to create puzzle tournament.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Create Tournament
  const handleCreateTournament = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!form.title || !form.startDate || !form.time) {
      setErrorMessage("Please fill in all required fields (Title, Start Date, and Time).");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/tournaments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create tournament.");
      }

      setSuccessMessage("Tournament created successfully!");
      // Reset form (except defaults)
      setForm({
        title: "",
        type: "Swiss",
        status: "Upcoming",
        startDate: "",
        endDate: "",
        time: "",
        location: "Zewail Chess Club",
        description: "",
        players: 0,
        detailsUrl: "",
        rounds: 5
      });
      fetchData(); // Refresh list
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    }
  };

  // Delete Tournament
  const handleDeleteTournament = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete tournament.");
      }

      setSuccessMessage("Tournament deleted successfully.");
      fetchData(); // Refresh list
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user completely? This cannot be undone.")) return;

    try {
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete user.");
      }

      setSuccessMessage("User deleted successfully.");
      fetchData(); // Refresh list
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Utility to format role specific details
  const PrettyRoleData = ({ data }) => {
    const formatKey = (key) =>
      key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const renderData = (obj) => {
      if (obj === null || obj === undefined)
        return <em style={{ color: "#888" }}>Not provided</em>;

      if (Array.isArray(obj)) {
        return obj.map((item, i) => (
          <div key={i} className="pretty-role-array-item">
            <h4>Entry #{i + 1}</h4>
            {renderData(item)}
          </div>
        ));
      }

      if (typeof obj === "object" && obj !== null) {
        return Object.entries(obj).map(([k, v]) => (
          <div key={k} className="pretty-field">
            <strong>{formatKey(k)}:</strong>
            <div style={{ paddingLeft: "15px" }}>{renderData(v)}</div>
          </div>
        ));
      }

      return <span>{obj}</span>;
    };

    return (
      <div className="pretty-role-data">
        {Object.keys(data || {}).length === 0 ? (
          <p style={{ color: "#caba91", fontStyle: "italic" }}>
            No role-specific data provided.
          </p>
        ) : (
          renderData(data)
        )}
      </div>
    );
  };

  return (
    <div className="admin-wrapper">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="admin-container">
        <section className="intro-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "1px solid #393428", paddingBottom: "15px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", color: "white", margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: "#caba91", margin: "5px 0 0 0" }}>Create and manage club tournaments, and review member applications.</p>
          </div>
          <button onClick={handleLogout} className="tab-btn" style={{ borderColor: "#e74c3c", color: "#e74c3c" }}>
            Log Out
          </button>
        </section>

        {/* Tab Controls */}
        <div className="admin-tabs">
          {(userRole === "admin" || userRole === "oc") && (
            <button
              className={`tab-btn ${activeTab === "add-tournament" ? "active" : ""}`}
              onClick={() => setActiveTab("add-tournament")}
            >
              Add Tournament
            </button>
          )}
          {(userRole === "admin" || userRole === "oc") && (
            <button
              className={`tab-btn ${activeTab === "tournaments-list" ? "active" : ""}`}
              onClick={() => setActiveTab("tournaments-list")}
            >
              Manage Tournaments ({tournaments.length})
            </button>
          )}
          {(userRole === "admin" || userRole === "hr") && (
            <button
              className={`tab-btn ${activeTab === "applications" ? "active" : ""}`}
              onClick={() => setActiveTab("applications")}
            >
              Club Applications ({applications.length})
            </button>
          )}
          {userRole === "admin" && (
            <button
              className={`tab-btn ${activeTab === "manage-users" ? "active" : ""}`}
              onClick={() => setActiveTab("manage-users")}
            >
              Manage Users ({users.length})
            </button>
          )}
          {(userRole === "admin" || userRole === "oc") && (
            <button
              className={`tab-btn ${activeTab === "manage-puzzles" ? "active" : ""}`}
              onClick={() => setActiveTab("manage-puzzles")}
            >
              Chess Puzzles
            </button>
          )}
        </div>

        {/* Alert Messages */}
        {successMessage && <div className="alert-message success">{successMessage}</div>}
        {errorMessage && <div className="alert-message error">{errorMessage}</div>}

        {/* Tab Contents */}
        <div className="tab-content">
          
          {/* Tab 1: Add Tournament */}
          {activeTab === "add-tournament" && (
            <div className="form-card">
              <h2>Add New Tournament</h2>
              <form onSubmit={handleCreateTournament} className="admin-form">
                <div className="form-group">
                  <label htmlFor="title">Tournament Name *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Rapid Fall Tournament"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type">Tournament Type</label>
                    <select
                      id="type"
                      name="type"
                      value={form.type}
                      onChange={handleInputChange}
                    >
                      <option value="Swiss">Swiss</option>
                      <option value="Knockout Single Elimination">Knockout Single Elimination</option>
                      <option value="Knockout Double Elimination">Knockout Double Elimination</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                      id="status"
                      name="status"
                      value={form.status}
                      onChange={handleInputChange}
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Swiss-only: Number of Rounds */}
                {form.type === "Swiss" && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="rounds">
                        Number of Rounds *
                        <span style={{ fontWeight: "400", color: "#f3c144", marginLeft: "8px", fontSize: "0.82rem" }}>
                          (Swiss only)
                        </span>
                      </label>
                      <input
                        type="number"
                        id="rounds"
                        name="rounds"
                        value={form.rounds}
                        onChange={handleInputChange}
                        min="1"
                        max="13"
                        required
                      />
                      <small style={{ color: "#888", fontSize: "0.78rem", marginTop: "5px", display: "block" }}>
                        📋 FIDE min. players needed:{" "}
                        <strong style={{ color: "#f3c144" }}>{Number(form.rounds) + 1}</strong>
                        {" "}· Ideal (no rematches):{" "}
                        <strong style={{ color: "#f3c144" }}>{Math.pow(2, Number(form.rounds))}</strong>
                      </small>
                    </div>
                    <div className="form-group" /> {/* spacer */}
                  </div>
                )}


                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date *</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="time">Time *</label>
                    <input
                      type="text"
                      id="time"
                      name="time"
                      value={form.time}
                      onChange={handleInputChange}
                      placeholder="e.g. 12:00 PM or 2:00 PM - 5:00 PM"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="players">Initial Registered Players</label>
                    <input
                      type="number"
                      id="players"
                      name="players"
                      value={form.players}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Zewail Chess Club Room"
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Provide details about the tournament rounds, rules, or prizes."
                    rows="4"
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Create Tournament"}
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Manage Tournaments */}
          {activeTab === "tournaments-list" && (
            <div className="table-card">
              <h2>All Tournaments</h2>
              {tournaments.length === 0 ? (
                <p className="empty-message">No tournaments found. Go ahead and add one!</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Tournament</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Location</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tournaments.map((t) => (
                        <tr key={t._id}>
                          <td className="strong">{t.title}</td>
                          <td>{t.type}</td>
                          <td>
                            <span className={`status-badge ${t.status.toLowerCase()}`}>
                              {t.status}
                            </span>
                          </td>
                          <td>{t.startDate}</td>
                          <td>{t.time}</td>
                          <td>{t.location}</td>
                          <td>
                            <div style={{ display: "flex", gap: "8px" }}>
                              <a
                                href={`/tournamentdetails?id=${t._id}`}
                                className="action-btn"
                                style={{
                                  background: "rgba(243, 193, 68, 0.15)",
                                  color: "#f3c144",
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  textDecoration: "none",
                                  fontSize: "0.8rem",
                                  fontWeight: "700",
                                  border: "1px solid rgba(243, 193, 68, 0.3)"
                                }}
                              >
                                View & Edit Matches ➔
                              </a>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteTournament(t._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Applications */}
          {activeTab === "applications" && (
            <div className="table-card">
              <h2>Received Member Applications</h2>
              {applications.length === 0 ? (
                <p className="empty-message">No applications submitted yet.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Applicant</th>
                        <th>Email</th>
                        <th>ID</th>
                        <th>Major & Batch</th>
                        <th>Department</th>
                        <th>Applied Role</th>
                        <th>Status</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr key={app._id}>
                          <td className="strong">{app.name}</td>
                          <td>{app.email}</td>
                          <td>{app.idNumber}</td>
                          <td>{app.major} (Batch {app.batch})</td>
                          <td>{app.department}</td>
                          <td className="strong">{app.roleTitle}</td>
                          <td>
                            <span className={`status-badge ${(app.status || 'Pending').toLowerCase()}`}>
                              {app.status || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <button className="view-btn" onClick={() => {
                              setSelectedApp(app);
                              setModalOpen(true);
                            }}>
                              View Answers
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Manage Users */}
          {activeTab === "manage-users" && (
            <div className="table-card">
              <h2>All Registered Users</h2>
              {users.length === 0 ? (
                <p className="empty-message">No users found.</p>
              ) : (
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>ID Number</th>
                        <th>Major</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id}>
                          <td className="strong">{u.name}</td>
                          <td>{u.email}</td>
                          <td>{u.idNumber || "N/A"}</td>
                          <td>{u.major || "N/A"}</td>
                          <td>
                            <span className={`status-badge ${u.role === 'admin' ? 'approved' : 'pending'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            {u.role !== 'admin' ? (
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteUser(u._id)}
                              >
                                Delete
                              </button>
                            ) : (
                              <span style={{color: "#888", fontStyle: "italic"}}>Admin</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Manage Puzzles */}
          {activeTab === "manage-puzzles" && (
            <div className="table-card">
              <h2>Chess Puzzle Challenge Manager</h2>
              <p style={{ color: "#caba91", marginBottom: "20px" }}>
                Create a new puzzle challenge tournament. Set up board positions visually, record the solution moves, and define time limits.
              </p>

              <form onSubmit={handleCreatePuzzleTournament} className="admin-form" style={{ marginTop: "20px" }}>
                <div className="form-group">
                  <label>Tournament Title *</label>
                  <input
                    type="text"
                    value={puzzleTitle}
                    onChange={(e) => setPuzzleTitle(e.target.value)}
                    placeholder="e.g. Weekly Tactics Arena"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      value={puzzleStartDate}
                      onChange={(e) => setPuzzleStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Time Limit per Puzzle (Seconds) *</label>
                    <input
                      type="number"
                      value={puzzleTimeLimit}
                      onChange={(e) => setPuzzleTimeLimit(parseInt(e.target.value) || 60)}
                      min="5"
                      required
                    />
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #393428", margin: "25px 0" }} />

                <h3>Puzzles in this Tournament ({puzzlesList.length})</h3>
                {puzzlesList.length === 0 ? (
                  <p style={{ color: "#888", fontStyle: "italic" }}>No puzzles added to this tournament yet. Set up a position below to add your first puzzle.</p>
                ) : (
                  <div className="puzzle-list-manager" style={{ marginBottom: "25px" }}>
                    {puzzlesList.map((p, index) => (
                      <div key={index} className="puzzle-item-row">
                        <div className="puzzle-item-info">
                          <span className="puzzle-item-title">Puzzle #{index + 1} - Mate in {p.mateIn}</span>
                          <span className="puzzle-item-desc">{p.description}</span>
                          <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#f3c144" }}>
                            Moves: {p.correctMoves.join(" -> ")}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="delete-btn"
                          style={{ cursor: "pointer", padding: "6px 12px", minWidth: "auto" }}
                          onClick={() => setPuzzlesList(puzzlesList.filter((_, i) => i !== index))}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="puzzle-dashboard-grid">
                  {/* Left Column: Interactive Chess Board */}
                  <div className="puzzle-board-container">
                    <h4>{setupMode ? "⚙️ Position Setup Mode" : "🔴 Recording Solution Moves..."}</h4>
                    <p style={{ fontSize: "0.8rem", color: "#caba91", margin: "0 0 10px 0", textAlign: "center" }}>
                      {setupMode 
                        ? "Select a piece below, then click on squares to place/remove them. Click Toggle Turn to change who starts."
                        : "Drag and drop pieces to make moves. They are recorded in sequence as the correct solution."}
                    </p>
                    
                    <div className="puzzle-board-wrapper">
                      <Chessboard
                        position={activePuzzleFen}
                        onSquareClick={handleSquareClick}
                        onPieceDrop={handlePieceDrop}
                        boardWidth={360}
                        arePiecesDraggable={!setupMode}
                      />
                    </div>

                    {setupMode && (
                      <div className="piece-palette">
                        {[
                          { label: "Eraser ❌", value: "clear" },
                          { label: "WP ♙", value: { type: "p", color: "w" } },
                          { label: "WN ♘", value: { type: "n", color: "w" } },
                          { label: "WB ♗", value: { type: "b", color: "w" } },
                          { label: "WR ♖", value: { type: "r", color: "w" } },
                          { label: "WQ ♕", value: { type: "q", color: "w" } },
                          { label: "WK ♔", value: { type: "k", color: "w" } },
                          { label: "BP ♟", value: { type: "p", color: "b" } },
                          { label: "BN ♞", value: { type: "n", color: "b" } },
                          { label: "BB ♝", value: { type: "b", color: "b" } },
                          { label: "BR ♜", value: { type: "r", color: "b" } },
                          { label: "BQ ♛", value: { type: "q", color: "b" } },
                          { label: "BK ♚", value: { type: "k", color: "b" } },
                        ].map((piece, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`palette-btn ${selectedPiece === piece.value || (selectedPiece && piece.value && selectedPiece.type === piece.value.type && selectedPiece.color === piece.value.color) ? "active" : ""}`}
                            onClick={() => setSelectedPiece(piece.value)}
                          >
                            {piece.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Active Setup Controls */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <div className="form-group">
                      <label>Turn to Move (Starts Puzzle)</label>
                      <button
                        type="button"
                        className="tab-btn"
                        style={{ width: "100%", textTransform: "uppercase" }}
                        onClick={handleToggleTurn}
                        disabled={!setupMode}
                      >
                        {activePuzzleFen.split(" ")[1] === "w" ? "⚪ White to Move" : "⚫ Black to Move"}
                      </button>
                    </div>

                    <div className="form-group">
                      <label>Mate In *</label>
                      <select
                        value={activePuzzleMateIn}
                        onChange={(e) => setActivePuzzleMateIn(parseInt(e.target.value) || 1)}
                        disabled={!setupMode}
                      >
                        <option value="1">Mate in 1</option>
                        <option value="2">Mate in 2</option>
                        <option value="3">Mate in 3</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Puzzle Description / Hint</label>
                      <input
                        type="text"
                        value={activePuzzleDesc}
                        onChange={(e) => setActivePuzzleDesc(e.target.value)}
                        placeholder="e.g. Find the killer bishop sacrifice..."
                        disabled={!setupMode}
                      />
                    </div>

                    <div className="form-group" style={{ marginTop: "10px" }}>
                      {setupMode ? (
                        <button
                          type="button"
                          className="tab-btn"
                          style={{ width: "100%", background: "#e67e22", color: "white", borderColor: "#e67e22" }}
                          onClick={handleStartRecording}
                        >
                          🔴 Start Recording Solution Moves
                        </button>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <span style={{ fontSize: "0.85rem", color: "#caba91", fontWeight: "bold" }}>
                            Recorded Moves: {activePuzzleMoves.length > 0 ? activePuzzleMoves.join(", ") : "Make moves on the board"}
                          </span>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              type="button"
                              className="tab-btn"
                              style={{ flex: 1, borderColor: "#e74c3c", color: "#e74c3c" }}
                              onClick={handleUndoMove}
                            >
                              ↩️ Undo Move
                            </button>
                            <button
                              type="button"
                              className="tab-btn"
                              style={{ flex: 1, borderColor: "#95a5a6", color: "#95a5a6" }}
                              onClick={() => {
                                const resetChess = new Chess(initialPuzzleFen);
                                setChessInstance(resetChess);
                                setActivePuzzleFen(initialPuzzleFen);
                                setSetupMode(true);
                                setActivePuzzleMoves([]);
                              }}
                            >
                              ✏️ Back to Setup
                            </button>
                          </div>
                          <button
                            type="button"
                            className="tab-btn"
                            style={{ width: "100%", background: "#2ecc71", color: "white", borderColor: "#2ecc71" }}
                            onClick={handleAddPuzzle}
                          >
                            ✅ Add Puzzle to Tournament
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="signup-btn"
                  style={{ width: "100%", marginTop: "40px", height: "48px", fontSize: "1.05rem" }}
                >
                  🚀 Publish Puzzle Tournament
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal for Applicant Details */}
        {modalOpen && selectedApp && (
          <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal-btn" onClick={() => setModalOpen(false)}>
                &times;
              </button>
              <h3>Application Details: {selectedApp.name}</h3>
              <hr className="modal-divider" />
              <div className="modal-info-grid">
                <div><strong>Email:</strong> {selectedApp.email}</div>
                <div><strong>Phone:</strong> {selectedApp.phone}</div>
                <div><strong>ID:</strong> {selectedApp.idNumber}</div>
                <div><strong>Academic Path:</strong> {selectedApp.major} (Batch {selectedApp.batch})</div>
                <div><strong>Department:</strong> {selectedApp.department}</div>
                <div><strong>Position:</strong> {selectedApp.roleTitle}</div>
              </div>
              <hr className="modal-divider" />
              <h4>Role-Specific Answers</h4>
              <PrettyRoleData data={selectedApp.roleSpecificData} />
              
              {selectedApp.status === "Pending" && (
                <div className="modal-action-buttons" style={{ display: "flex", gap: "10px", marginTop: "25px", justifyContent: "flex-end" }}>
                  <button 
                    onClick={() => handleUpdateStatus(selectedApp._id, "Accepted")}
                    className="view-btn" 
                    style={{ cursor: "pointer" }}
                  >
                    Accept Application
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedApp._id, "Rejected")}
                    className="delete-btn" 
                    style={{ cursor: "pointer" }}
                  >
                    Reject Application
                  </button>
                </div>
              )}
              {selectedApp.status && selectedApp.status !== "Pending" && (
                <div style={{ marginTop: "25px", textAlign: "right", color: selectedApp.status === "Accepted" ? "#2ecc71" : "#e74c3c", fontWeight: "bold" }}>
                  Application Status: {selectedApp.status}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
