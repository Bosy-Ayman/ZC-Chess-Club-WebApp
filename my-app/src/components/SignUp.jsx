import React, { useState } from "react";
import Header from "../components/Header";
import "./SignUp.css"; 
import { Link } from "react-router-dom";

export default function SignUp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="signup-page">
      {/* Header on top */}
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Signup form centered below header */}
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Create Your Account</h2>

          {/* Input Fields */}
          <form className="signup-form">
            <input type="text" placeholder="Full Name" className="signup-input" />
            <input type="email" placeholder="Email" className="signup-input" />
            <input type="id" placeholder="ID" className="signup-input" />

            <input type="phone-number" placeholder="Phone Number" className="signup-input" />
            <input type="major" placeholder="Major" className="signup-input" />

            <input type="password" placeholder="Password" className="signup-input" />
            <input type="password" placeholder="Confirm Password" className="signup-input" />

            {/* Signup Button */}
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>

          {/* Footer */}

          <p className="signup-login"> 
            Already have an account?
            </p>
          <Link to="/login">
          <p className="signup-login-link">Log in</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
