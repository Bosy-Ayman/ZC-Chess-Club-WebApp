import "./ClubRoles.css";
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ClubRoles() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="club-wrapper">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <main className="main-content">
          {/* Introduction */}
          <section className="intro-text">
            <h1>Club Role Applications</h1>
            <p>
              Apply for various roles within the club and track your application status.
            </p>
          </section>

          {/* Available Roles */}
          <h2 className="section-title">Available Roles</h2>

          <div className="role-card-container">
            {[
              {
                department: "Human Resources",
                title: "HR Member",
                desc: "Manage club members, handle inquiries, and ensure smooth communication within the club.",
                image: "/Images/training.png",
              },
              {
                department: "Public Relations",
                title: "PR Member",
                desc: "Promote the club, manage social media, and engage with the community to increase club visibility.",
                image: "/Images/training2.jpeg",
              },
              {
                department: "Tournament Organizer",
                title: "OC Member",
                desc: "Plan and execute chess tournaments, ensuring fair play and a positive experience for all participants.",
                image:
                  "/Images/arbiter.jpeg",
              },{
                department: "MultiMedia",
                title: "Media Member",
                desc: "i will write it later..",
                image:
                  "/Images/media.jpeg",
              },
              {
                department: "Trainer",
                title: "Member",
                desc: "i will write it later..",
                image:
                  "/Images/trainer.jpg",
              },
            ].map((role, index) => (
              <div key={index} className="role-card">
                <div className="role-info">
                  <p className="department">{role.department}</p>
                  <p className="title">{role.title}</p>
                  <p className="desc">{role.desc}</p>
                  <button className="apply-btn">Apply</button>
                </div>
                <div
                  className="role-image"
                  style={{
                    backgroundImage: `url(${role.image})`,
                  }}
                ></div>
              </div>
            ))}
          </div>

          {/* Your Applications */}
          <h2 className="section-title">Your Applications</h2>

          <div className="application-table-wrapper">
            <table className="application-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Applied On</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>HR Member</td>
                  <td>
                    <button className="status pending">Pending</button>
                  </td>
                  <td>2024-07-20</td>
                </tr>
                <tr>
                  <td>Trainer Member</td>
                  <td>
                    <button className="status accepted">Accepted</button>
                  </td>
                  <td>2024-07-15</td>
                </tr>
                <tr>
                  <td>PR Member</td>
                  <td>
                    <button className="status rejected">Rejected</button>
                  </td>
                  <td>2024-07-10</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
