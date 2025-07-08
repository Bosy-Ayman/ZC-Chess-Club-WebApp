import React, { useState } from "react";
import Header from "../components/Header";
import "./Login.css";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="login-page">
      {/* Header on top */}
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Centered login form */}
      <div className="login-container">
        <div className="login-card">
          <header className="login-header">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Log in to your Chess Club account</p>
          </header>

          <form className="login-form">
            <input
              type="email"
              placeholder="Email"
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              className="login-input"
            />
            <p className="login-forgot">Forgot password?</p>

            <button type="submit" className="login-button">
              Log In
            </button>
          </form>

          <p className="login-footer">
            Don't have an account?
            <Link to='/signup'>
            <span className="login-link">Sign up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
