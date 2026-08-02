import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Profile.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [profile, setProfile] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [allTournaments, setAllTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const email = localStorage.getItem("adminEmail");

  useEffect(() => {
    if (!email) {
      window.location.href = "/?login=true";
      return;
    }
    fetchData();
  }, [email]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Profile
      const profRes = await fetch(`${API_BASE}/api/profile?email=${email}`);
      const profData = await profRes.json();
      if (profRes.ok) {
        setProfile(profData);
      } else {
        throw new Error(profData.error || "Failed to load profile");
      }

      // Fetch User's Tournaments
      const tourRes = await fetch(`${API_BASE}/api/users/${email}/tournaments`);
      const tourData = await tourRes.json();
      if (tourRes.ok) {
        setTournaments(tourData);
      }

      // Fetch All Upcoming Tournaments
      const allRes = await fetch(`${API_BASE}/api/tournaments`);
      const allData = await allRes.json();
      if (allRes.ok) {
        setAllTournaments(allData.filter(t => t.status === "Upcoming"));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (tournamentId) => {
    if (!profile) return;
    try {
      const res = await fetch(`${API_BASE}/api/tournaments/${tournamentId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, name: profile.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      alert("Successfully registered for the tournament!");
      fetchData(); // Refresh lists
    } catch (err) {
      alert(err.message);
    }
  };

  const renderMatches = (tournament) => {
    if (!profile) return null;
    const myMatches = tournament.matches?.filter(
      (m) => m.white === profile.name || m.black === profile.name
    );

    if (!myMatches || myMatches.length === 0) {
      return <p className="no-matches">No matches scheduled for you yet.</p>;
    }

    return (
      <div className="matches-list">
        <h4>Your Matches:</h4>
        {myMatches.map((match, idx) => (
          <div key={idx} className="match-card">
            <span className="match-round">Round {match.round}</span>
            <div className="match-players">
              <span className={match.white === profile.name ? "highlight" : ""}>
                ♔ {match.white}
              </span>
              <span className="vs">VS</span>
              <span className={match.black === profile.name ? "highlight" : ""}>
                ♚ {match.black}
              </span>
            </div>
            <div className="match-result">Result: {match.result}</div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) return <div className="loading-screen">Loading Profile...</div>;
  if (error) return <div className="error-screen">{error}</div>;

  return (
    <div className="profile">
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
      
      <main className="profile-wrapper profile-main" style={{ minHeight: "100vh" }}>
        <h1 className="section-title">My Dashboard</h1>

        {profile && (
          <section className="profile-top-info" style={{ flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
            <div className="profile-user">
              <div className="profile-user-img" style={{ backgroundImage: `url("/Icons/user.png")` }}></div>
              <div>
                <p className="user-name">{profile.name}</p>
                <p className="user-joined">Role: {(profile.role || 'member').toUpperCase()}</p>
              </div>
            </div>
            
            <div className="profile-details-grid">
              <div className="profile-detail-card">
                <span className="profile-detail-label">Email</span>
                <span className="profile-detail-value">{profile.email}</span>
              </div>
              <div className="profile-detail-card">
                <span className="profile-detail-label">Student ID</span>
                <span className="profile-detail-value">{profile.idNumber || "N/A"}</span>
              </div>
              <div className="profile-detail-card">
                <span className="profile-detail-label">Major</span>
                <span className="profile-detail-value">{profile.major || "N/A"}</span>
              </div>
              <div className="profile-detail-card">
                <span className="profile-detail-label">Phone</span>
                <span className="profile-detail-value">{profile.phone || "N/A"}</span>
              </div>
            </div>
          </section>
        )}

        <section className="dashboard-section">
          <h3 className="section-title">My Tournaments</h3>
          {tournaments.length === 0 ? (
            <p style={{ color: "var(--light-text)" }}>You haven't joined any tournaments yet.</p>
          ) : (
            <div className="tournament-grid-dashboard">
              {tournaments.map((t) => {
                const reg = t.registrations?.find((r) => r.email === email);
                const isPlayer = t.playersList?.some((p) => p.name === profile?.name);
                
                let status = "Pending";
                if (isPlayer) status = "Approved (Playing)";
                else if (reg) status = reg.status;

                return (
                  <div key={t._id} className="tournament-card-dashboard">
                    <div className="t-header">
                      <h3 className="t-title">{t.title}</h3>
                      <span className="t-status">{status}</span>
                    </div>
                    <div className="t-info-row">
                      <span className="t-info-text"><strong>Date:</strong> {t.startDate}</span>
                      <span className="t-info-text"><strong>Location:</strong> {t.location}</span>
                    </div>
                    {isPlayer && renderMatches(t)}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="dashboard-section" style={{ marginBottom: "50px" }}>
          <h3 className="section-title">Upcoming Tournaments</h3>
          {allTournaments.length === 0 ? (
            <p style={{ color: "var(--light-text)" }}>No upcoming tournaments available to join.</p>
          ) : (
            <div className="tournament-grid-dashboard">
              {allTournaments.map((t) => {
                const alreadyJoined = tournaments.some((joined) => joined._id === t._id);
                if (alreadyJoined) return null;

                return (
                  <div key={t._id} className="tournament-card-dashboard">
                    <div className="t-header">
                      <h3 className="t-title">{t.title}</h3>
                    </div>
                    <div className="t-info-row">
                      <span className="t-info-text"><strong>Date:</strong> {t.startDate}</span>
                      <span className="t-info-text"><strong>Type:</strong> {t.type}</span>
                    </div>
                    <button 
                      onClick={() => handleRegister(t._id)}
                      className="btn-primary"
                    >
                      Join Tournament
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
