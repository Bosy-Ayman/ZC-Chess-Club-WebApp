import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import "./SignUp.css"; 
import { Link, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "1028308432321-defaultplaceholder.apps.googleusercontent.com";

export default function SignUp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");
  const [major, setMajor] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [googleCredential, setGoogleCredential] = useState("");
  
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const credential = response.credential;
      const parts = credential.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid Google credential format");
      }
      const payload = JSON.parse(window.atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      setEmail(payload.email || "");
      setFullName(payload.name || "");
      setGoogleCredential(credential);
      setErrorMessage("");
      setSuccessMessage("Google account connected! Please enter your Student ID, Phone Number, and Major below to finish signing up.");
    } catch (err) {
      setErrorMessage(err.message || "Google account connection failed.");
    }
  };

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleLoginSuccess
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-btn"),
        { theme: "filled_blue", size: "large", width: 280, shape: "pill" }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!googleCredential && password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      let res;
      if (googleCredential) {
        res = await fetch(`${API_BASE}/api/admin/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            credential: googleCredential, 
            name: fullName, 
            idNumber: id, 
            phone, 
            major,
            batch: "2026"
          })
        });
      } else {
        res = await fetch(`${API_BASE}/api/admin/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email, 
            password, 
            name: fullName, 
            idNumber: id, 
            phone, 
            major,
            batch: "2026"
          })
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminEmail", data.user.email);
      localStorage.setItem("userRole", data.user.role);

      setSuccessMessage("Account created successfully!");
      setTimeout(() => {
        navigate("/admin");
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || "Sign up failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="signup-split-container">
        {/* Left Panel: Signup Form */}
        <div className="signup-form-panel">
          <div className="signup-card-split">
            <h2 className="signup-title-split">Create Your Account</h2>
            <p className="signup-subtitle-split">Join the Zewail City Chess Club today.</p>

            {errorMessage && <div className="signup-alert-split error">{errorMessage}</div>}
            {successMessage && <div className="signup-alert-split success">{successMessage}</div>}

            <form className="signup-form-split" onSubmit={handleSignUpSubmit}>
              <div className="signup-form-row">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="signup-input-split" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                  readOnly={!!googleCredential}
                  style={googleCredential ? { opacity: 0.8, cursor: "not-allowed" } : {}}
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="signup-input-split" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  readOnly={!!googleCredential}
                  style={googleCredential ? { opacity: 0.8, cursor: "not-allowed" } : {}}
                />
              </div>

              <div className="signup-form-row">
                <input 
                  type="text" 
                  placeholder="Student ID" 
                  className="signup-input-split" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required 
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  className="signup-input-split" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>

              <div className="signup-form-row">
                <input 
                  type="text" 
                  placeholder="Major" 
                  className="signup-input-split" 
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  required 
                />
              </div>

              {!googleCredential && (
                <div className="signup-form-row">
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="signup-input-split" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                  <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    className="signup-input-split" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
              )}

              <button type="submit" className="signup-button-split" disabled={isLoading}>
                {isLoading ? "Creating account..." : googleCredential ? "Complete Google Sign-Up" : "Sign Up"}
              </button>
            </form>

            <div className="signup-divider-split">
              <span>OR</span>
            </div>

            <div className="google-signup-container-split">
              <div id="google-signup-btn"></div>
            </div>

            <p className="signup-login-prompt">
              Already have an account? <Link to="/">Log in</Link>
            </p>
          </div>
        </div>

        {/* Right Panel: Additional Club Info */}
        <div className="signup-info-panel">
          <div className="signup-info-content">
            <span className="info-badge">Membership Benefits</span>
            <h2>ZC Chess Club Perks ♟️</h2>
            <p className="info-intro">
              Access Zewail City's premier intellectual space. Develop your logical thinking, network with players, and sharpen your tactics.
            </p>

            <div className="perks-list">
              <div className="perk-item">
                <div className="perk-icon">🏆</div>
                <div className="perk-text">
                  <h3>Dynamic Tournaments</h3>
                  <p>Compete in Blitz, Rapid, and Classic Swiss & Knockout events directly tracked on our calendar.</p>
                </div>
              </div>

              <div className="perk-item">
                <div className="perk-icon">🎓</div>
                <div className="perk-text">
                  <h3>Structured Training</h3>
                  <p>Access puzzles, strategic training, and master opening databases prepared by seasoned players.</p>
                </div>
              </div>

              <div className="perk-item">
                <div className="perk-icon">📁</div>
                <div className="perk-text">
                  <h3>Club Applications</h3>
                  <p>Apply to join club departments (OC, HR, Multimedia, Training) and review progress in the Admin Panel.</p>
                </div>
              </div>
            </div>

            <div className="info-quote">
              <p>"Chess is the struggle against the error."</p>
              <span>— Johannes Zukertort</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
