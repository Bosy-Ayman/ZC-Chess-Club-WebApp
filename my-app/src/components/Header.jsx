import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import LoginModal from "./LoginModal";

const Header = ({ sidebarOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "tournament",
      text: "The ZC Rapid Championship begins tomorrow at 6:00 PM.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "puzzle",
      text: "New Weekly Puzzle Challenge is now live. Solve to earn points!",
      time: "1 day ago",
      read: false
    },
    {
      id: 3,
      type: "role",
      text: "Your application status has been updated to 'Under Review'.",
      time: "2 days ago",
      read: false
    }
  ]);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Outside click listener to auto-close notifications dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".notification-wrapper")) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("click", handleOutsideClick);
    }
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showNotifications]);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("adminToken"));
    setUserRole(localStorage.getItem("userRole"));
    setUserEmail(localStorage.getItem("adminEmail") || "");
    
    // Check if ?login=true is in the URL to open the login modal
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "true") {
      setShowLoginModal(true);
      // clean up URL to avoid opening on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleHeaderLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserDrawerOpen(false);
    window.location.reload();
  };

  return (
    <>
      <header className="header">
        <div className="logo-title">
          <div className="logo-icon">
            <img src="\Icons\chess-clublogo.png" alt="Chess Rook Logo" />
          </div>
          <a href='/'>
            <h2 className="logo-text">ZC Chess Club</h2>
          </a>
        </div>

        {/* LOGGED IN USER INTERFACE (Top navbar controls) */}
        {isLoggedIn ? (
          <div className="logged-in-menu">
            {/* Notifications Dropdown */}
            <div className="notification-wrapper">
              <button 
                className="notification-bell-btn" 
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
              >
                🔔
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="mark-read-btn" onClick={handleMarkAllRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="notifications-list">
                    {notifications.map((n) => (
                      <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                        <div className="notification-icon">
                          {n.type === 'tournament' ? '🏆' : n.type === 'puzzle' ? '🧩' : '♟️'}
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">{n.text}</p>
                          <span className="notification-time">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Drawer Menu Toggle */}
            <button className="user-menu-btn" onClick={() => setUserDrawerOpen(true)}>
              <span className="user-menu-avatar">👤</span>
              <span className="user-menu-text">{userEmail.split('@')[0]}</span>
              {userRole && <span className="user-role-badge">{userRole}</span>}
            </button>
          </div>
        ) : (
          /* GUEST VISITOR INTERFACE (Top navbar links + Hamburger) */
          <>
            {!isMobile && (
              <>
                <nav className="nav-links">
                  <Link to="/">Home</Link>
                  <Link to="/tournaments">Tournaments</Link>
                  <Link to="/puzzlechallenge">Puzzles</Link>
                  <Link to="/history">History</Link>
                  <Link to="/calendar">Calendar</Link>
                  <Link to="/about">About</Link>
                  <Link to="/clubroles">Join Us</Link>
                </nav>

                <div className="auth-buttons">
                  <Link to="/signup">
                    <button className="signup-btn">Sign Up</button>
                  </Link>
                  <button className="login-btn" onClick={() => setShowLoginModal(true)}>Log In</button>
                </div>
              </>
            )}

            {isMobile && (
              <div className="hamburger" onClick={toggleSidebar}>
                ☰
              </div>
            )}
          </>
        )}
      </header>

      {/* Guest Mobile Sidebar Drawer */}
      {!isLoggedIn && isMobile && sidebarOpen && (
        <div className="mobile-sidebar">
          <Link to="/">Home</Link>
          <Link to="/tournaments">Tournaments</Link>
          <Link to="/history">History</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/about">About Us</Link>
          <Link to="/clubroles">Join Us</Link>
          
          <div style={{ padding: "0 10px", marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/signup" style={{ width: "100%" }}>
              <button className="signup-btn" style={{ width: "100%" }}>Sign Up</button>
            </Link>
            <button className="login-btn" onClick={() => { setShowLoginModal(true); toggleSidebar(); }} style={{ width: "100%", marginTop: "10px" }}>Log In</button>
          </div>
        </div>
      )}

      {/* User Sidebar Drawer (For Logged In Users) */}
      {isLoggedIn && userDrawerOpen && (
        <>
          <div className="drawer-overlay" onClick={() => setUserDrawerOpen(false)}></div>
          <div className="user-drawer">
            <button className="close-drawer-btn" onClick={() => setUserDrawerOpen(false)}>
              &times;
            </button>
            
            <div className="drawer-header">
              <div className="drawer-avatar">👤</div>
              <div className="drawer-user-info">
                <span className="drawer-user-email">{userEmail}</span>
                {userRole && <span className="drawer-role-tag">{userRole}</span>}
              </div>
            </div>

            <nav className="drawer-links">
              <Link to="/" onClick={() => setUserDrawerOpen(false)}>🏠 Home</Link>
              <Link to="/profile" onClick={() => setUserDrawerOpen(false)}>👤 Profile</Link>
              
              {/* Main Pages */}
              <Link to="/tournaments" onClick={() => setUserDrawerOpen(false)}>🏆 Tournaments</Link>
              <Link to="/puzzlechallenge" onClick={() => setUserDrawerOpen(false)}>🧩 Puzzles</Link>
              <Link to="/calendar" onClick={() => setUserDrawerOpen(false)}>📅 Calendar</Link>
              <Link to="/history" onClick={() => setUserDrawerOpen(false)}>📜 History</Link>
              <Link to="/about" onClick={() => setUserDrawerOpen(false)}>ℹ️ About Us</Link>

              {/* Sub-links for role capabilities (subs for additional entries) */}
              {(userRole === 'admin' || userRole === 'hr' || userRole === 'oc') && (
                <>
                  <div className="drawer-submenu-title">Management</div>
                  <Link to="/admin" className="drawer-sublink" onClick={() => setUserDrawerOpen(false)}>📊 Dashboard Home</Link>
                </>
              )}

              {userRole === 'admin' && (
                <>
                  <Link to="/admin?tab=add-tournament" className="drawer-sublink" onClick={() => setUserDrawerOpen(false)}>➕ Add Tournament</Link>
                  <Link to="/admin?tab=tournaments-list" className="drawer-sublink" onClick={() => setUserDrawerOpen(false)}>⚙️ Manage Tournaments</Link>
                  <Link to="/admin?tab=applications" className="drawer-sublink" onClick={() => setUserDrawerOpen(false)}>♟️ View Applications</Link>
                  <Link to="/admin?tab=manage-users" className="drawer-sublink" onClick={() => setUserDrawerOpen(false)}>👥 Manage Users</Link>
                </>
              )}

              {userRole === 'hr' && (
                <>
                  <Link to="/admin?tab=applications" className="drawer-sublink" onClick={() => setUserDrawerOpen(false)}>♟️ View Applications</Link>
                </>
              )}

              {userRole === 'oc' && (
                <>
                  <Link to="/admin?tab=add-tournament" className="drawer-sublink" onClick={() => setUserDrawerOpen(false)}>➕ Add Tournament</Link>
                  <Link to="/admin?tab=tournaments-list" className="drawer-sublink" onClick={() => setUserDrawerOpen(false)}>⚙️ Manage Tournaments</Link>
                </>
              )}

              {(!userRole || userRole === 'member') && (
                <Link to="/clubroles" onClick={() => setUserDrawerOpen(false)}>♟️ Join Us / Apply</Link>
              )}
            </nav>

            <div className="drawer-footer">
              <button className="logout-btn-drawer" onClick={handleHeaderLogout}>
                🚪 Log Out
              </button>
            </div>
          </div>
        </>
      )}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </>
  );
};

export default Header;
