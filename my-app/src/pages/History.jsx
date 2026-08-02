import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./History.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// A simple helper component for scroll-reveal animations using Intersection Observer
const ScrollReveal = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div ref={domRef} className={`scroll-reveal ${isVisible ? "is-visible" : ""}`}>
      {children}
    </div>
  );
};

export default function EventHistory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [pastEvents, setPastEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("events"); // "events" or "highboard"

  // Highboard history data containing current and past leadership structures
  const highboardHistory = [
    {
      year: "2025/2026",
      isCurrent: true,
      members: [
        { name: "Bosy Ayman", role: "President", image: "/Icons/user.png" },
        { name: "Abdelrahman Mohamed", role: "Vice President", image: "/Winners/Winner1.png" },
        { name: "Aml Ali", role: "Head of Human Resources", image: "/Images/Aml.png" },
        { name: "Momen Mahmoud", role: "Head of Training", image: "/Images/momen.png" },
        { name: "Rana Ahmed", role: "Head of Multimedia", image: "/Images/rana.jpg" },
        { name: "Alaa Ibrahim", role: "Head of Organization", image: "/Images/unknown.png" },
        { name: "Adham Elawady", role: "Head of Public Relations", image: "/Images/adham.png" }
      ]
    },
    {
      year: "2024/2025",
      isCurrent: false,
      members: [
        { name: "Ahmed Khaled", role: "President", image: "/Icons/user.png" },
        { name: "Yara Amr", role: "Vice President", image: "/Icons/user.png" },
        { name: "Sarah Hassan", role: "Head of Human Resources", image: "/Icons/user.png" },
        { name: "Karim Omar", role: "Head of Training", image: "/Icons/user.png" },
        { name: "Mariam Ali", role: "Head of Multimedia", image: "/Icons/user.png" },
        { name: "Youssef Ahmed", role: "Head of Organization", image: "/Icons/user.png" },
        { name: "Nour El-Din", role: "Head of Public Relations", image: "/Icons/user.png" }
      ]
    },
    {
      year: "2023/2024",
      isCurrent: false,
      members: [
        { name: "Mohamed Sherif", role: "President", image: "/Icons/user.png" },
        { name: "Layla Tarek", role: "Vice President", image: "/Icons/user.png" },
        { name: "Omar Farouk", role: "Head of Human Resources", image: "/Icons/user.png" },
        { name: "Nada Mostafa", role: "Head of Training", image: "/Icons/user.png" },
        { name: "Hady Sherif", role: "Head of Multimedia", image: "/Icons/user.png" },
        { name: "Zeinab Ali", role: "Head of Organization", image: "/Icons/user.png" },
        { name: "Aly El-Din", role: "Head of Public Relations", image: "/Icons/user.png" }
      ]
    }
  ];

  // Group events by Year for the timeline
  const groupedEvents = {};

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tournaments`);
      if (res.ok) {
        const data = await res.json();
        // Filter only completed tournaments
        const completed = data.filter((t) => t.status === "Completed");
        
        // Sort by date descending (newest first)
        completed.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        
        setPastEvents(completed);
      }
    } catch (err) {
      console.error("Failed to fetch events for history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Group the fetched events by year
  pastEvents.forEach(event => {
    const year = new Date(event.startDate).getFullYear() || "Unknown Year";
    if (!groupedEvents[year]) {
      groupedEvents[year] = [];
    }
    groupedEvents[year].push(event);
  });

  const years = Object.keys(groupedEvents).sort((a, b) => b - a); // Descending years

  return (
    <div className="history-page">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="history-content">
        <div className="history-intro">
          <h1 className="title">Club History & Events</h1>
          <p className="subtitle">
            A journey through our past tournaments, championships, and major events. 
            Relive the greatest moments of ZC Chess Club.
          </p>
        </div>

        {/* Tab Switching controls */}
        <div className="history-tabs">
          <button 
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            🏆 Tournament History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'highboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('highboard')}
          >
            👑 High Board History
          </button>
        </div>

        {activeTab === "events" ? (
          isLoading ? (
            <div style={{ textAlign: "center", marginTop: "50px" }}>Loading history...</div>
          ) : years.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "50px", color: "#b5afa1" }}>
              No past events found yet.
            </div>
          ) : (
            <div className="timeline">
              {years.map((year, yearIndex) => (
                <div key={yearIndex} className="timeline-year-section">
                  {/* Year Marker */}
                  <div className="timeline-year-marker">
                    <div className="year-badge">{year}</div>
                  </div>

                  {/* Events for this year */}
                  <div className="board-members-grid">
                    {groupedEvents[year].map((event, eventIndex) => {
                      // Alternate left and right
                      const isLeft = eventIndex % 2 === 0;
                      
                      return (
                        <ScrollReveal key={event._id || eventIndex}>
                          <div className={`timeline-item ${isLeft ? 'left' : 'right'}`}>
                            <div className="timeline-dot"></div>
                            <div className="timeline-card glass-panel" style={{ padding: "30px" }}>
                              <div className="card-header-group">
                                <h3 className="card-event-title">
                                  {event.title}
                                </h3>
                                <div className="card-meta-tags">
                                  <span className="card-tag-type">
                                    {event.type}
                                  </span>
                                  <span className="card-tag-date">
                                    📅 {event.startDate}
                                  </span>
                                  <span className="card-tag-location">
                                    📍 {event.location}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="card-event-desc">
                                {event.description || "An exciting tournament hosted by Zewail City Chess Club that brought together players of all levels to compete."}
                              </p>

                              {event.playersList && event.playersList.length > 0 && (
                                <div style={{ marginTop: "20px", borderTop: "1px solid #36332b", paddingTop: "15px" }}>
                                  <p style={{ margin: "0 0 10px 0", color: "#f3c144", fontWeight: "bold", fontSize: "0.9rem" }}>TOP PARTICIPANTS</p>
                                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {event.playersList.slice(0, 5).map((p, i) => (
                                      <span key={i} style={{ backgroundColor: "#181611", padding: "4px 10px", borderRadius: "4px", fontSize: "0.8rem", border: "1px solid #36332b" }}>
                                        {p.name}
                                      </span>
                                    ))}
                                    {event.playersList.length > 5 && (
                                      <span style={{ padding: "4px 10px", fontSize: "0.8rem", color: "#888" }}>+{event.playersList.length - 5} more</span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </ScrollReveal>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="board-history-container">
            {highboardHistory.map((board, index) => (
              <ScrollReveal key={index}>
                <div className="board-year-section">
                  <h2 className="board-year-title">
                    🎓 Academic Year {board.year}
                    {board.isCurrent && <span className="current-badge">Current</span>}
                  </h2>
                  <div className="board-members-grid-custom">
                    {board.members.map((member, idx) => (
                      <div 
                        key={idx} 
                        className="board-member-card"
                        style={{ '--delay': `${idx * 0.08}s` }}
                      >
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className="board-member-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/Icons/user.png";
                          }}
                        />
                        <div className="board-member-info">
                          <h3 className="board-member-name">{member.name}</h3>
                          <p className="board-member-role">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
