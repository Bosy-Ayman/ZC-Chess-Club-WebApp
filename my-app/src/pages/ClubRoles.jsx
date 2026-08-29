// src/pages/ClubRoles.js

import "./ClubRoles.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // 👈 IMPORT LINK & NAVIGATE
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClubRoles() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [myApplications, setMyApplications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("adminEmail");
    if (!email) {
      navigate("/?login=true");
      return;
    }
    setIsLoggedIn(true);
    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
    fetch(`${API_BASE}/api/applications`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(app => app.email.toLowerCase() === email.toLowerCase());
        setMyApplications(filtered);
      })
      .catch(err => console.error("Error fetching applications in ClubRoles:", err));
  }, [navigate]);

  const roles = [
    {
      department: "Human Resources",
      title: "HR Member",
      desc: "Manage club members, handle inquiries, and ensure smooth communication within the club.",
      image: "/Images/Positions/HR.jpg",
      path: "/apply/hr", // 👈 ADD PATH
    },
    {
      department: "Tournament Organizer",
      title: "OC Member",
      desc: "Plan and execute chess tournaments, ensuring fair play and a positive experience for all participants.",
      image: "/Images/Positions/arbiter.jpeg",
      path: "/apply/oc-member", // 👈 ADD PATH
    },
    {
      department: "Multimedia",
      title: "Media Member",
      desc: "Capture, design, and produce creative content that represents the club’s activities and achievements.",
      image: "/Images/Positions/media.jpeg",
      path: "/apply/multimedia", // 👈 ADD PATH (Matches previous setup)
    },
    {
      department: "Trainer",
      title: "Trainer Member",
      desc: "Train new players, prepare materials for club sessions, and guide members to improve their chess skills.",
      image: "/Images/Positions/trainer.jpg",
      path: "/apply/trainer", // 👈 ADD PATH
    },
    {
      department: "Trainee",
      title: "Trainee Member",
      desc: "New members who are learning the basics of chess and developing their skills through training sessions.",
      image: "/Images/Positions/trainee2.jpg",
      path: "/apply/trainee", // 👈 ADD PATH
    },
  ];

  return (
    <div className="club-wrapper">
      {/* 🧭 Header */}
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="clubroles-container">
        {/* 🌟 Intro Section */}
        <section className="intro-text">
          <h1>Club Role Applications</h1>
          <p>
            Apply for various roles within the club and track your application status.
          </p>
        </section>

        {/* 🧩 Available Roles */}
        <h2 className="section-title">Available Roles</h2>
        <div className="role-card-container">
          {roles.map((role, index) => (
            <div key={index} className="role-card">
              <div className="role-info">
                <p className="department">{role.department}</p>
                <p className="title">{role.title}</p>
                <p className="desc">{role.desc}</p>
                {/* 🎯 USE LINK FOR NAVIGATION */}
                <Link to={role.path} className="apply-btn-link">
                    <button className="apply-btn">Apply Now</button>
                </Link>
              </div>
              <div
                className="role-image"
                style={{ backgroundImage: `url(${role.image})` }}
              ></div>
            </div>
          ))}
        </div>

        {/* 📋 Your Application Status */}
        {isLoggedIn && myApplications.length > 0 && (
          <section className="applications-status-section" style={{ marginTop: "50px", borderTop: "1px solid #393428", paddingTop: "30px" }}>
            <h2 className="section-title">Your Application Status</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
              {myApplications.map((app) => (
                <div key={app._id} className="role-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="role-info" style={{ paddingRight: "0" }}>
                    <p className="department">{app.department}</p>
                    <p className="title">{app.roleTitle}</p>
                    <p className="desc" style={{ marginTop: "5px" }}>Submitted: {new Date(app.submissionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span 
                      className={`status-badge ${app.status?.toLowerCase() || 'pending'}`}
                      style={{ 
                        padding: "6px 14px", 
                        borderRadius: "20px", 
                        fontWeight: "700",
                        fontSize: "0.9rem",
                        border: "1px solid",
                        textTransform: "capitalize",
                        backgroundColor: app.status === "Accepted" ? "rgba(46, 204, 113, 0.15)" : app.status === "Rejected" ? "rgba(231, 76, 60, 0.15)" : "rgba(230, 126, 34, 0.15)",
                        borderColor: app.status === "Accepted" ? "#2ecc71" : app.status === "Rejected" ? "#e74c3c" : "#e67e22",
                        color: app.status === "Accepted" ? "#2ecc71" : app.status === "Rejected" ? "#e74c3c" : "#e67e22"
                      }}
                    >
                      {app.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 🦶 Footer */}
      <Footer />
    </div>
  );
}