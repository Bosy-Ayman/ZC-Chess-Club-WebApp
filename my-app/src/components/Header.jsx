import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ sidebarOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

        {!isMobile && (
          <>
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/tournaments">Tournaments</Link>
               <Link to="/Calendar">Calendar</Link>
              <Link to="/about">About</Link>
              <Link to="/clubroles">Join Us</Link>
             

              {/* <Link to="/contact">Contact</Link> */}
            </nav>

            {/* <div className="auth-buttons">
              <Link to="/signup">
                <button className="signup-btn">Sign Up</button>
              </Link>
              <Link to="/login">
                <button className="login-btn">Log In</button>
              </Link>
            </div> */}
          </>
        )}

        {isMobile && (
          <div className="hamburger" onClick={toggleSidebar}>
            ☰
          </div>
        )}
      </header>

      {isMobile && sidebarOpen && (
        <div className="mobile-sidebar">
          <Link to="/">Home</Link>
          <Link to="/tournaments">Tournaments</Link>
          <Link to="/Calendar">Calendar</Link>
          <Link to="/about">About Us</Link>
          <Link to="/clubroles">Join Us</Link>
          {/* <Link to="/contact">Contact</Link>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="login-btn">Log In</button>
          </Link> */}
        </div>
      )}
    </>
  );
};

export default Header;
