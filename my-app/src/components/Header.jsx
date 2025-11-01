import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <>
      <header className="header">
        <div className="logo-title">
          <div className="logo-icon">
            {/* Logo image instead of SVG */}
            <img src="/Icons/rook.png" alt="Chess Rook Logo" />
          </div>
          <h2 className="logo-text">ZC Chess Club</h2>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/tournaments">Tournaments</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="auth-buttons">
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="login-btn">Log In</button>
          </Link>
        </div>

        <div className="hamburger" onClick={toggleSidebar}>
          ☰
        </div>
      </header>

      {sidebarOpen && (
        <div className="mobile-sidebar">
          <Link to="/">Home</Link>
          <Link to="/tournaments">Tournaments</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/signup">
            <button className="signup-btn">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="login-btn">Log In</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
