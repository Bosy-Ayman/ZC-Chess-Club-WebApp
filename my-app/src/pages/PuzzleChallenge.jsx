import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./PuzzleChallenge.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function PuzzleChallenge() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [tournaments, setTournaments] = useState([]);
  const [activeTournament, setActiveTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Playing Game States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [trials, setTrials] = useState(3);
  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [gameFeedback, setGameFeedback] = useState("");
  const [feedbackType, setFeedbackType] = useState(""); // 'success' | 'error' | 'info'
  const [isFinished, setIsFinished] = useState(false);
  
  // Chess Instance State
  const [chessGame, setChessGame] = useState(new Chess());
  const [boardFen, setBoardFen] = useState("");
  const [correctMovesList, setCorrectMovesList] = useState([]);
  const [currentMoveIdx, setCurrentMoveIdx] = useState(0); // tracks index in correctMovesList

  const timerRef = useRef(null);
  const boardLocked = useRef(false); // blocks input while opponent replies or puzzle advances

  // User session cache
  const isLoggedIn = !!localStorage.getItem("adminToken");
  const userEmail = localStorage.getItem("adminEmail") || "";
  const userName = userEmail ? userEmail.split("@")[0] : "Guest Player";

  // Fetch puzzle tournaments on load
  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/puzzle-tournaments`);
      const data = await res.json();
      if (res.ok) {
        setTournaments(data);
      }
    } catch (err) {
      console.error("Failed to load puzzle tournaments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePuzzleTimeout = () => {
    setGameFeedback("Time ran out on this puzzle! ⏰");
    setFeedbackType("error");
    
    setTimeout(() => {
      advanceNextPuzzle(false);
    }, 2000);
  };

  // Puzzle Timer Loop
  useEffect(() => {
    if (isPlaying && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handlePuzzleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, currentPuzzleIdx, isFinished]);

  // Launch a tournament challenge
  const startTournamentChallenge = (tournament) => {
    if (!isLoggedIn) {
      alert("Please log in first to participate and submit scores to the leaderboard!");
      return;
    }
    if (!tournament.puzzles || tournament.puzzles.length === 0) {
      alert("This tournament has no puzzles added yet!");
      return;
    }
    
    setActiveTournament(tournament);
    setIsPlaying(true);
    setCurrentPuzzleIdx(0);
    setScore(0);
    setSolvedCount(0);
    setIsFinished(false);
    loadPuzzle(tournament.puzzles[0], tournament.timeLimit);
  };

  // Load a single puzzle
  const loadPuzzle = (puzzle, timeLimit) => {
    const freshChess = new Chess(puzzle.initialFen);
    boardLocked.current = false;
    setChessGame(freshChess);
    setBoardFen(freshChess.fen());
    setCorrectMovesList(puzzle.correctMoves);
    setCurrentMoveIdx(0);
    setTrials(3);
    setTimeRemaining(timeLimit || 60);
    setGameFeedback("");
    setFeedbackType("");
  };

  // Move validation drag/drop handler
  const onPieceDrop = (sourceSquare, targetSquare) => {
    // Block input while opponent is replying, puzzle is advancing, or game is finished
    if (isFinished || boardLocked.current) return false;

    try {
      const targetMove = correctMovesList[currentMoveIdx];
      if (!targetMove) return false;

      // Attempt move on a fresh Chess instance (immutable — never mutate state directly)
      const newChess = new Chess(chessGame.fen());
      const move = newChess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q"
      });

      if (!move) return false; // illegal move

      const playerLan = move.lan; // e.g. "e2e4", "g1f3"

      if (playerLan === targetMove || move.san === targetMove) {
        // ✅ Correct move — update board state immutably
        setChessGame(newChess);
        setBoardFen(newChess.fen());

        const nextMoveIdx = currentMoveIdx + 1;

        if (nextMoveIdx < correctMovesList.length) {
          // Opponent has a reply move — lock board and apply after delay
          boardLocked.current = true;
          setGameFeedback("Correct! Opponent is replying...");
          setFeedbackType("info");

          setTimeout(() => {
            try {
              const opponentMove = correctMovesList[nextMoveIdx];
              const afterOpponent = new Chess(newChess.fen());
              afterOpponent.move(opponentMove);
              setChessGame(afterOpponent);
              setBoardFen(afterOpponent.fen());
              setCurrentMoveIdx(nextMoveIdx + 1);
              setGameFeedback("Your turn — find checkmate!");
              setFeedbackType("info");
              boardLocked.current = false;
            } catch (e) {
              console.error("Opponent reply failed:", e);
              boardLocked.current = false;
            }
          }, 700);
        } else {
          // 🎉 Puzzle fully solved!
          boardLocked.current = true;
          setGameFeedback("Perfect! Puzzle Solved! 🎉");
          setFeedbackType("success");

          const baseScore = 100;
          const timeBonus = Math.floor(timeRemaining * 1.5);
          setScore((prev) => prev + baseScore + timeBonus);
          setSolvedCount((prev) => prev + 1);
          clearInterval(timerRef.current);

          setTimeout(() => advanceNextPuzzle(true), 1500);
        }
        return true;

      } else {
        // ❌ Wrong move
        handleWrongMove();
        return false;
      }
    } catch (err) {
      handleWrongMove();
      return false;
    }
  };

  const handleWrongMove = () => {
    setTrials((prev) => {
      const remaining = prev - 1;
      if (remaining <= 0) {
        setGameFeedback("No trials left on this puzzle! ❌");
        setFeedbackType("error");
        boardLocked.current = true;
        clearInterval(timerRef.current);
        setTimeout(() => advanceNextPuzzle(false), 1500);
      } else {
        setGameFeedback(`Wrong move! ${remaining} trial${remaining === 1 ? '' : 's'} remaining. Try again! ⚠️`);
        setFeedbackType("error");
        // Board FEN stays at the last valid position — no change needed
      }
      return remaining;
    });
  };

  const advanceNextPuzzle = (wasSolved) => {
    const nextIdx = currentPuzzleIdx + 1;
    if (nextIdx < activeTournament.puzzles.length) {
      setCurrentPuzzleIdx(nextIdx);
      loadPuzzle(activeTournament.puzzles[nextIdx], activeTournament.timeLimit);
    } else {
      // Completed all puzzles
      finishChallenge();
    }
  };

  const finishChallenge = async () => {
    setIsFinished(true);
    clearInterval(timerRef.current);
    
    // Submit score to database
    try {
      await fetch(`${API_BASE}/api/puzzle-tournaments/${activeTournament._id}/submit-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          score: score,
          solvedCount: solvedCount
        })
      });
    } catch (err) {
      console.error("Failed to submit score:", err);
    }
  };

  return (
    <div className="puzzle-challenge-root">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="puzzle-layout-container">
        {isLoading ? (
          <div className="loading-spinner">Loading puzzle tournaments...</div>
        ) : !isPlaying ? (
          /* SECTION 1: TOURNAMENT LISTING SCREEN */
          <div className="puzzle-selection-view">
            <h1 className="puzzle-header-title">Chess Tactics Arena</h1>
            <p className="puzzle-description">
              Participate in active club puzzle challenges. Solve custom mate-in-1, mate-in-2, or mate-in-3 puzzles. You get 3 trials per puzzle. Earn speed bonus points!
            </p>

            <div className="tournaments-grid">
              {tournaments.length === 0 ? (
                <div className="no-tournaments-card">
                  <h3>No Puzzle Tournaments Available</h3>
                  <p>Check back later for upcoming club chess tactics challenges.</p>
                </div>
              ) : (
                tournaments.map((t) => (
                  <div key={t._id} className="tournament-card">
                    <div className="card-top">
                      <span className="card-badge">LIVE ARENA</span>
                      <h3>{t.title}</h3>
                    </div>
                    <div className="card-info">
                      <div className="info-item">📅 Date: {t.startDate}</div>
                      <div className="info-item">⏱️ Time Limit: {t.timeLimit}s / puzzle</div>
                      <div className="info-item">🧩 Puzzles: {t.puzzles ? t.puzzles.length : 0}</div>
                    </div>
                    
                    {/* Leaderboard Summary preview */}
                    <div className="card-leaderboard-preview">
                      <h4>Leaderboard Standings</h4>
                      {t.leaderboard && t.leaderboard.length > 0 ? (
                        t.leaderboard.slice(0, 3).map((entry, idx) => (
                          <div key={idx} className="leaderboard-preview-row">
                            <span>{idx + 1}. {entry.name}</span>
                            <strong>{entry.score} pts</strong>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontStyle: "italic", fontSize: "0.8rem", color: "#888", margin: "5px 0" }}>Be the first to participate!</p>
                      )}
                    </div>

                    <button 
                      className="enter-btn" 
                      onClick={() => startTournamentChallenge(t)}
                    >
                      Join Challenge
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : isFinished ? (
          /* SECTION 2: END GAME REPORT CARD */
          <div className="end-game-card">
            <h2>Challenge Complete! 🏆</h2>
            <p>Well played, <strong>{userName}</strong>!</p>
            <div className="results-grid">
              <div className="result-box">
                <span className="label">Total Score</span>
                <span className="val">{score}</span>
              </div>
              <div className="result-box">
                <span className="label">Solved Puzzles</span>
                <span className="val">{solvedCount} / {activeTournament.puzzles.length}</span>
              </div>
            </div>
            
            <div className="leaderboard-full-wrapper" style={{ marginTop: "30px" }}>
              <h3>Leaderboard Rankings</h3>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Solved</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTournament.leaderboard && activeTournament.leaderboard.length > 0 ? (
                    activeTournament.leaderboard.map((entry, idx) => (
                      <tr key={idx} className={entry.email === userEmail ? "highlight-user-row" : ""}>
                        <td>{idx + 1}</td>
                        <td>{entry.name}</td>
                        <td>{entry.solvedCount}</td>
                        <td>{entry.score}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No scores submitted yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <button className="back-list-btn" onClick={() => { setIsPlaying(false); fetchTournaments(); }}>
              Back to Arena List
            </button>
          </div>
        ) : (
          /* SECTION 3: INTERACTIVE GAME BOARD SOLVER */
          <div className="puzzle-gameplay-container">
            <div className="game-status-bar">
              <button className="quit-btn" onClick={() => { if (window.confirm("Quit challenge? Your current progress will be lost.")) setIsPlaying(false); }}>
                Quit Arena
              </button>
              <div className="puzzle-header-title">
                {activeTournament.title} - Puzzle {currentPuzzleIdx + 1} of {activeTournament.puzzles.length}
              </div>
              <div className="timer-badge">
                ⏱️ {timeRemaining}s
              </div>
            </div>

            <div className="gameplay-grid">
              {/* Gameplay Left: Chessboard */}
              <div className="gameplay-board-panel">
                <div className="game-feedback-banner" data-type={feedbackType}>
                  {gameFeedback || "Make your move to begin solving..."}
                </div>
                
                <div className="game-board-wrapper">
                  <Chessboard
                    position={boardFen}
                    onPieceDrop={onPieceDrop}
                    boardWidth={400}
                    arePiecesDraggable={true}
                  />
                </div>
              </div>

              {/* Gameplay Right: Puzzle Metadata & Leaderboard preview */}
              <div className="gameplay-info-panel">
                <div className="stats-card">
                  <h4>Challenge Metrics</h4>
                  <div className="stat-row">
                    <span>Target:</span>
                    <strong>Mate in {activeTournament.puzzles[currentPuzzleIdx].mateIn}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Hint:</span>
                    <span style={{ fontSize: "0.85rem", color: "#caba91" }}>
                      {activeTournament.puzzles[currentPuzzleIdx].description || "Calculate best moves"}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span>Remaining Trials:</span>
                    <span className="hearts-indicator">
                      {Array.from({ length: 3 }).map((_, idx) => (
                        <span key={idx} className={idx < trials ? "heart filled" : "heart empty"}>❤️</span>
                      ))}
                    </span>
                  </div>
                  <div className="stat-row">
                    <span>Current Score:</span>
                    <strong style={{ color: "#f3c144" }}>{score} pts</strong>
                  </div>
                </div>

                <div className="stats-card" style={{ marginTop: "20px", flex: 1, overflowY: "auto" }}>
                  <h4>Live Leaderboard</h4>
                  <div className="mini-leaderboard">
                    {activeTournament.leaderboard && activeTournament.leaderboard.length > 0 ? (
                      activeTournament.leaderboard.map((entry, idx) => (
                        <div key={idx} className={`mini-leaderboard-row ${entry.email === userEmail ? 'highlight' : ''}`}>
                          <span>{idx + 1}. {entry.name}</span>
                          <strong>{entry.score} pts</strong>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontStyle: "italic", fontSize: "0.8rem", color: "#888" }}>No scores yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
