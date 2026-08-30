import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./History.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// A helper component for scroll-reveal animations using Intersection Observer
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
  const [activeTab, setActiveTab] = useState("events"); // "events", "highboard", or "halloffame"
  const [categoryFilter, setCategoryFilter] = useState("all"); // "all", "tournament", "exhibition", "training", "online"
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  // Check URL query params for active tab (e.g. ?tab=halloffame)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "halloffame") {
      setActiveTab("halloffame");
    }
  }, []);

  // Highboard history data containing current and past leadership structures
  const highboardHistory = [
    {
      year: "2026/2027",
      isCurrent: true,
      members: [
        { name: "Ahmed Elkodariy", role: "President", image: "/Images/highboard/26-27/AhmedElkodariy.PNG" },
        { name: "Omar Hafez", role: "Vice President", image: "/Images/highboard/26-27/OmarHafez.jpeg" },
        { name: "Omar Ezz", role: "Head of Training", image: "/Images/highboard/26-27/OmarEzz.jpg" },
        { name: "Haneen Yasser", role: "Head of Multimedia", image: "/Images/highboard/26-27/HaneenYasser.png" },
        { name: "Raphael Robier", role: "Head of PR", image: "/Images/highboard/26-27/RaphaelRobier.png" },
        { name: "Unknown", role: "Head of Organization", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of HR", image: "/Icons/unknown.png" }
      ]
    },
    {
      year: "2025/2026",
      isCurrent: false,
      members: [
        { name: "Bosy Ayman", role: "President", image: "/Images/highboard/24-25/bosy.png" },
        { name: "Abdelrahman Mohamed", role: "Vice President", image: "/Images/highboard/24-25/abdelrahman.png" },
        { name: "Aml Ali", role: "Head of HR", image: "/Images/highboard/24-25/Aml.png" },
        { name: "Momen Mahmoud", role: "Head of Training", image: "/Images/highboard/24-25/momen.png" },
        { name: "Rana Ahmed", role: "Head of Multimedia", image: "/Images/highboard/24-25/rana.jpg" },
        { name: "Alaa Ibrahim", role: "Head of Organization", image: "/Images/highboard/24-25/alaa.png" },
        { name: "Adham Elawady", role: "Head of PR", image: "/Images/highboard/24-25/adham.png" }
      ]
    },
    {
      year: "2024/2025",
      isCurrent: false,
      members: [
        { name: "Bosy Ayman", role: "President", image: "/Images/highboard/24-25/bosy.png" },
        { name: "Abdelrahman Mohamed", role: "Vice President", image: "/Images/highboard/24-25/abdelrahman.png" },
        { name: "Aml Ali", role: "Head of HR", image: "/Images/highboard/24-25/Aml.png" },
        { name: "Momen Mahmoud", role: "Head of Training", image: "/Images/highboard/24-25/momen.png" },
        { name: "Rana Ahmed", role: "Head of Multimedia", image: "/Images/highboard/24-25/rana.jpg" },
        { name: "Alaa Ibrahim", role: "Head of Organization", image: "/Images/highboard/24-25/alaa.png" },
        { name: "Adham Elawady", role: "Head of PR", image: "/Images/highboard/24-25/adham.png" }
      ]
    },
     {
      year: "2023/2024",
      isCurrent: false,
      members: [
        { name: "Thomas Emad", role: "President", image: "/Images/highboard/23-24/ThomasEmad.png" },
        { name: "Youssef Zanny", role: "Vice President", image: "/Icons/unknown.png" },
        { name: "Elaf Ahmed", role: "Head of HR", image: "/Images/highboard/23-24/ElafAhmed.jpg" },
        { name: "Amira Elhussainy", role: "Head of Training", image: "/Images/highboard/23-24/AmiraElhussainy.jpg" },
        { name: "Mohamed Ahmed Ezz", role: "Head of Organization", image: "/Images/highboard/23-24/MohamedEzz.jpg" },
      ]
    },
     {
      year: "2022/2023",
      isCurrent: false,
      members: [
        { name: "Mohamed Ebrahim", role: "President", image: "/Images/highboard/22-23/MohamedEbrahim.jpg" },
        { name: "Ahmed Fateen", role: "Vice President", image: "/Images/highboard/22-23/AhmedFateen.png" },
        { name: "Elaf Ahmed", role: "Head of HR", image: "/Images/highboard/22-23/ElafAhmed.jpg" },
        { name: "Aly Faragallah", role: "Head of Marketing", image: "/Icons/unknown.png" },
        { name: "Sama Yousef", role: "Head of Organization", image: "/Icons/unknown.png" },
      ]
    },
    {
      year: "2021/2022",
      isCurrent: false,
      members: [
        { name: "Mohamad Ebrahim", role: "President", image: "/Images/highboard/22-23/MohamedEbrahim.jpg" },
        { name: "Ahmed Fateen", role: "Vice President", image: "/Images/highboard/22-23/AhmedFateen.png" },
        { name: "Unknown", role: "Head of HR", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Training", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Organization", image: "/Icons/unknown.png" },
      ]
    },
    {
      year: "2020/2021",
      isCurrent: false,
      members: [
        { name: "Mohamed Adel", role: "President", image: "/Images/highboard/20-21/MohamedAdel.png" },
        { name: "Muhammed Alaa Eldin", role: "Vice President", image: "/Images/highboard/20-21/MuhammedAlaaEldin.jpg" },
        { name: "Aya Nageh", role: "Vice President", image: "/Icons/unknown.png" },

        { name: "Unknown", role: "Head of HR", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Training", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Organization", image: "/Icons/unknown.png" },
      ]
    },
     {
      year: "2019/2020",
      isCurrent: false,
      members: [
        { name: "Mohamed Adel", role: "President", image: "/Images/highboard/19-20/MohamedAdel.png" },
        { name: "Muhammed Alaa Eldin", role: "Vice President", image: "/Images/highboard/19-20/MuhammedAlaaEldin.jpg" },
        { name: "Aya Nageh", role: "Vice President", image: "/Icons/unknown.png" },

        { name: "Unknown", role: "Head of HR", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Training", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Organization", image: "/Icons/unknown.png" },
      ]
    }, {
      year: "2018/2019",
      isCurrent: false,
      members: [
        { name: "Unknown", role: "President", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Vice President", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Vice President", image: "/Icons/unknown.png" },

        { name: "Unknown", role: "Head of HR", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Training", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Organization", image: "/Icons/unknown.png" },
      ]
    }, {
      year: "2017/2018",
      isCurrent: false,
      members: [
        { name: "unknown", role: "President", image: "/Icons/unknown.png" },
        { name: "unknown", role: "Vice President", image: "/Icons/unknown.png" },
        { name: "unknown", role: "Vice President", image: "/Icons/unknown.png" },

        { name: "Unknown", role: "Head of HR", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Training", image: "/Icons/unknown.png" },
        { name: "Unknown", role: "Head of Organization", image: "/Icons/unknown.png" },
      ]
    }
  ];

  // Enhanced historical events with photos, categories, and full highlights from Instagram & Facebook
  const defaultHistoricalEvents = [
    {
      _id: "hist-2026-spring",
      title: "King's Quest IV Championship 2026",
      type: "Swiss System (5 Rounds)",
      category: "tournament",
      startDate: "2026-05-15",
      location: "Academic Building",
      image: "/Images/Tournaments/2025-2026/KingQuest4.jpg",
      description: "5-round intense Swiss tournament featuring the top players of Zewail City competing for the 2026 season championship.",
      playersList: [
        { name: "🥇 1st Place: Abdelrahman Mohamed" },
        { name: "🥈 2nd Place: Abdelwahab Hamdi" },
        { name: "🥉 3rd Place: Mohamed Eslam" }
      ]
    },
    {
      _id: "hist-2026-careerfair",
      title: "ZC Career Fair Chess Booth & Exhibition",
      type: "Campus Exhibition & Tactics",
      category: "exhibition",
      startDate: "2026-04-22",
      location: "Zewail City Student Center",
      image: "/Images/Tournaments/2024-2025/CareerFair.jpg",
      description: "Interactive chess booth, speed puzzle solving, and open exhibition matches hosted during the annual Zewail City Career Fair.",
      playersList: [
        { name: "🎯 Speed Puzzle Booth" },
        { name: "👥 Student Activity Exhibition" }
      ]
    },
     {
      _id: "AAST university championship",
      title: "AAST university championship",
      type: "Swiss System (5 Rounds)",
      category: "tournament",
      startDate: "2026-05-14",
      location: "AAST University",
      image: "/Images/Tournaments/2025-2026/AASTUni.jpg",
      description: "5-round Swiss tournament organized by AAST chess club for october uni sector - 9 members represented ZC",
      playersList: [
        { name: "🥇 1st Place girls: Bosy Ayman" },
        { name: "🥈 4th Place boys: Abdelrahman Mohamed" },
        { name: "🥉 5th Place boys: Raphael Robier" },
        { name: "🥉 6th Place boys: Omar Ezz" },
        { name: "🥉 7th Place boys: Omar Hafez" },
        { name: "🥉 8th Place boys: Ahmed Elkodariy" }
      ]
    },
    {
      _id: "hist-2026-puzzle",
      title: "ZC Chess Puzzle Challenge 2026",
      type: "Puzzle Tactics Arena",
      category: "training",
      startDate: "2026-04-10",
      location: "Student Center, Zewail City",
      image: "/Images/Tournaments/2025-2026/PuzzleChallenge.jpg",
      description: "Interactive speed tactics challenge where participants competed to solve tactical positions in record time.",
      playersList: [
        { name: "🏆 Winner: Omar Hafez (Day 1 & 2)" },
        { name: "🧩 Tactics Arena" }
      ]
    },
    {
      _id: "hist-2026-ramadan",
      title: "Ramadan Knockout Tournament",
      type: "Rapid Tournament",
      category: "tournament",
      startDate: "2026-03-25",
      location: "Academic Building",
      image: "/Images/Tournaments/2025-2026/Ramadanknockout26.jpg",
      description: "Annual Ramadan rapid tournament bringing together UST students in a spirited nighttime competition.",
      playersList: [
        { name: "🥇 Champion: Omar Ezz" },
        { name: "🥈 Runner-up: Omar Hafez" },
        { name: "🥉 3rd Place: Abdelwahab Hamdi" }
      ]
    },
    {
      _id: "hist-2020-2021",
      title: "Knockout Tournament",
      type: "Rapid Tournament",
      category: "tournament",
      startDate: "2021-03-25",
      location: "Service Building",
      image: "/Images/Tournaments/2020-2021/Knockout21.jpg",
      description: "2020/2021 Rapid Knockout Tournament",
      playersList: [
        { name: "🥇 Champion: Mohamed Adel" }
      ]
    },
    {
      _id: "hist-2022-2023",
      title: "Knockout Tournament - Spring 24",
      type: "Blitz Tournament",
      category: "tournament",
      startDate: "2024-04-05",
      location: "Academic Building",
      image: "/Images/Tournaments/2023-2024/Knockout24.jpg",
      description: "ZC rapid knockout chess championship",
      playersList: [
        { name: "🥇 Champion: Unknown" }
      ]
    },{
      _id: "hist-2022-2023",
      title: "Knockout Tournament - Spring 23",
      type: "Blitz Tournament",
      category: "tournament",
      startDate: "2023-05-20",
      location: "Academic Building",
      image: "/Icons/unknown.png",
      description: "Sponsored by Redbull",
      playersList: [
        { name: "🥇 Champion: Unknown" }
      ]
    },
    {
      _id: "2026-esport",
      title: "Esport Chess Tournament 2026",
      type: "Esport tournament",
      category: "tournament",
      startDate: "2026-02-15",
      location: "Academic Building - Zone E",
      image: "/Images/Tournaments/2025-2026/Esports.jpg",
      description: "Esport blitz Chess tournament organized by the club on campus",
      playersList: [
        { name: "🥇 Champion: Abdelrahman Mohamed" },
        { name: "🥈 Runner-up: Mazen Ahmed" },
        { name: "🥉 3rd Place: Omar Hafez" }
      ]
    }, {
      _id: "2025-teams",
      title: "Teams Championship",
      type: "Teams tournament",
      category: "tournament",
      startDate: "2025-11-08",
      location: "Academic Building - Palm Tree",
      image: "/Images/Tournaments/2025-2026/TeamsTournament.jpg",
      description: "Teams Championship",
      playersList: [
        { name: "🥇 Champion: Knights : Ahmed Elkodariy, Omar Hafez, Omar Ezz" },
        { name: "🥈 Runner-up: Gambling : Abdelrahman Mohamed, Abdelrahman Mane3, Mohamed Eslam" },
        { name: "🥉 3rd Place: Epsilon : Noureldin Newer, Amr Khaled, Youssef Yasser " }
      ]
    },
    {
      _id: "Knockout Tournament - Fall 2025",
      title: "Knockout Tournament",
      type: "Knockout tournament",
      category: "tournament",
      startDate: "2025-10-04",
      location: "Zewail City Academic Hall",
      image: "/Images/Tournaments/2024-2025/KingQuest1_1.jpg",
      description: "Knockout Tournament",
      playersList: [
        { name: "🥇 Champion: Ahmed Elkodariy" },
        { name: "🥈 Runner-up: Abdelrahman Mohamed" },
      ]
    },
    {
      _id: "hist-2025-nile",
      title: "Nile University championship",
      type: "Inter-University Championship",
      category: "tournament",
      startDate: "2025-05-06",
      location: "Nile University",
      image: "/Images/Tournaments/2024-2025/NileUni.jpg",
      description: "6 members represented Zewail City at the Nile University Chess Tournament, bringing home an amazing achievement — 🥇 1st place in the girls' category! Highlights of a busy and successful season for our club.",
      playersList: [
        { name: "🥇 1st Place (Girls' Category): Bosy Ayman" },
        { name: "🏆 6 ZC Representatives" },
        { name: "🏛️ Inter-University" }
      ]
    },
    {
      _id: "hist-2025-kq2",
      title: "King's Quest II Tournament",
      type: "Swiss Format",
      category: "tournament",
      startDate: "2025-04-10",
      location: "Academic Building - Palm Tree",
      image: "/Images/Tournaments/2024-2025/KingQuest2.jpg",
      description: "King’s Quest II tournament featuring 32 participants competing in a Swiss format across multi-round high-level matches.",
      playersList: [
        { name: "👥 32 Participants" },
        { name: "♟️ Swiss Format" },
        { name: "🥇 Champion: Mohamed Ezz" },
        { name: "🥈 Runner-up: Mazen Allam" },
        { name: "🥉 3rd Place: Kareem Mahmoud" }
      ]
    },
    {
      _id: "hist-2025-ramadan",
      title: "Ramadan Chess Championship 25",
      type: "Knockout Tournament",
      category: "tournament",
      startDate: "2025-03-25",
      location: "Academic Building - Palm Tree",
      image: "/Images/Tournaments/2024-2025/RamadanKnockout25.jpg",
      description: "Annual Ramadan Chess Championship featuring top campus players competing in high-stakes matches.",
      playersList: [
        { name: "🥇 Champion: Abdelrahman Mohamed" },
        { name: "🥈 Runner-up: Mazen Allam" },
        { name: "🥉 3rd Place: Abdelrahman Manee3" }
      ]
    },
    {
      _id: "hist-2025-kq1",
      title: "King's Quest I Tournament",
      type: "Swiss Format",
      category: "tournament",
      startDate: "2025-03-15",
      location: "Academic Building - Palm Tree",
      image: "/Images/Tournaments/2024-2025/KingQuest1_3.png",
      description: "King’s Quest I tournament featuring 24 participants competing in a Swiss format for top campus rankings.",
      playersList: [
        { name: "👥 24 Participants" },
        { name: "♟️ Swiss Format" },
        { name: "🥇 Champion: Mohamed Ezz" },
        { name: "🥈 Runner-up: Mazen Allam" },
        { name: "🥉 3rd Place: Noureldin Mohamed" }
      ]
    },

    {
      _id: "hist-2021-Women",
      title: "Women Tournament",
      type: "Tournament",
      category: "tournament",
      startDate: "2021-07-20",
      location: "Zewail City Service Building",
      image: "/Images/Tournaments/2020-2021/WomanTournament.jpg",
      description: "Women Championship",
      playersList: [
        { name: "🥇 Champion: Unknown" }
      ]
    },
    {
      _id: "hist-2019-1",
      title: "Grandmasters Simultaneous Exhibition (Simul)",
      type: "Exhibition Match",
      category: "exhibition",
      startDate: "2019-11-15",
      location: "Service Building",
      image: "/Images/Tournaments/2018-2019/shahenda.jpg",
      description: "Historic simultaneous exhibition match hosting African Champions GM Adham Fawzy and WGM Shahinda Wafa playing against 20 Zewail City students simultaneously.",
      playersList: [
        { name: "GM Adham Fawzy" },
        { name: "WGM Shahinda Wafa" },
        { name: "20 ZC Students" }
      ]
    },
    {
      _id: "hist-2018-1",
      title: "International Master Simultaneous Exhibition 2018",
      type: "Exhibition Match",
      category: "exhibition",
      startDate: "2018-04-12",
      location: "Service Building",
      image: "/Images/Tournaments/2018-2019/adhamfawzy.jpg",
      description: "First landmark grand exhibition where International Master Adham Fawzy took on 16 ZC Chess Club players simultaneously.",
      playersList: [
        { name: "IM Adham Fawzy" },
        { name: "16 ZC Players" }
      ]
    }
  ];

  // Hall of Fame Champions List
  const hallOfFameChampions = [
    {
      title: "King's Quest IV Championship 2026",
      date: "May 2026",
      location: "Zewail City Campus",
      image: "/Winners/Winner1.png",
      winners: [
        { place: "🥇 1st", name: "Abdelrahman Mohamed", badge: "Grand Champion" },
        { place: "🥈 2nd", name: "Abdelwahab Hamdi", badge: "Runner-Up" },
        { place: "🥉 3rd", name: "Mohamed Eslam", badge: "3rd Place" }
      ]
    },
    {
      title: "Nile University Championship",
      date: "May 2025",
      location: "Nile University",
      image: "/Images/Tournaments/2024-2025/NileUni.jpg",
      winners: [
        { place: "🥇 1st", name: "ZC Girls' Chess Team", badge: "1st Place Trophy" },
        { place: "🏆 Award", name: "6 ZC Representatives", badge: "Inter-University" }
      ]
    },
    {
      title: "Ramadan Chess Championship 25",
      date: "March 2025",
      location: "Zewail City Campus",
      image: "/Images/Tournaments/2024-2025/RamadanKnockout25.jpg",
      winners: [
        { place: "🥇 1st", name: "Abdelrahman Mohamed", badge: "Ramadan Winner" },
        { place: "🥈 2nd", name: "Mazen Allam", badge: "Runner-Up" },
        { place: "🥉 3rd", name: "Abdelrahman Manee3", badge: "3rd Place" }
      ]
    },
    {
      title: "ZC Chess Puzzle Challenge 2026",
      date: "April 2026",
      location: "Zewail City Student Center",
      image: "/Images/Tournaments/2025-2026/PuzzleChallenge.jpg",
      winners: [
        { place: "🏆 1st", name: "Omar Hafez", badge: "Tactics Champion" }
      ]
    },
    {
      title: "King's Quest II Swiss Championship",
      date: "April 2025",
      location: "Zewail City Campus",
      image: "/Images/Tournaments/2024-2025/KingQuest2.jpg",
      winners: [
        { place: "🥇 1st", name: "Mohamed Ezz", badge: "32 Players Swiss" },
        { place: "🥈 2nd", name: "Mazen Allam" },
        { place: "🥉 3rd", name: "Kareem Mahmoud" }
      ]
    },
    {
      title: "ZC Major Elimination Championship",
      date: "February 2025",
      location: "Zewail City Campus",
      image: "/Winners/Winner3.png",
      winners: [
        { place: "🥇 1st", name: "Elimination Cup Champion", badge: "38 Players Knockout" }
      ]
    }
  ];

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tournaments`);
      let combined = [...defaultHistoricalEvents];
      if (res.ok) {
        const data = await res.json();
        const completed = data.filter((t) => t.status === "Completed");
        
        // Merge completed DB tournaments with historical events (avoiding ID duplicates)
        const dbIds = new Set(completed.map(t => t._id));
        const filteredDefault = defaultHistoricalEvents.filter(e => !dbIds.has(e._id));
        combined = [...completed, ...filteredDefault];
      }
      
      // Sort by date descending (newest first)
      combined.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setPastEvents(combined);
    } catch (err) {
      console.error("Failed to fetch events for history:", err);
      setPastEvents(defaultHistoricalEvents);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter events by category if selected
  const filteredEventsList = pastEvents.filter(event => {
    if (categoryFilter === "all") return true;
    return (event.category || "").toLowerCase() === categoryFilter.toLowerCase();
  });

  // Group the fetched events by year
  const groupedEvents = {};
  filteredEventsList.forEach(event => {
    const d = new Date(event.startDate);
    const parsedYear = d && !isNaN(d.getFullYear()) ? d.getFullYear() : null;
    const fallbackYear = event.startDate ? String(event.startDate).substring(0, 4) : "Unknown Year";
    const year = parsedYear || (isNaN(Number(fallbackYear)) ? "Unknown Year" : fallbackYear);
    
    if (!groupedEvents[year]) {
      groupedEvents[year] = [];
    }
    groupedEvents[year].push(event);
  });

  const years = Object.keys(groupedEvents).sort((a, b) => b - a); // Descending years

  // Global item counter for continuous alternating timeline zigzag (Left -> Right -> Left...)
  let globalItemCounter = 0;

  return (
    <div className="history-page">
      <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="history-content">
        <div className="history-intro">
          <h1 className="title">Club History & Accomplishments</h1>
          <p className="subtitle">
            A journey through our past tournaments, championships, grandmaster exhibitions, and major milestones. 
            Relive the greatest moments of ZC Chess Club.
          </p>

          {/* Stats Bar Component */}
          <div className="history-stats-bar">
            <div className="stat-box">
              <span className="stat-number">🥇 1st</span>
              <span className="stat-label">Nile Univ. Girls' Category</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">🏆 15+</span>
              <span className="stat-label">Major Tournaments</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">👑 2</span>
              <span className="stat-label">Grandmaster Simuls</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">👥 250+</span>
              <span className="stat-label">Campus Competitors</span>
            </div>
          </div>
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
            className={`tab-btn ${activeTab === 'halloffame' ? 'active' : ''}`}
            onClick={() => setActiveTab('halloffame')}
          >
            🥇 Hall of Fame & Winners
          </button>
          <button 
            className={`tab-btn ${activeTab === 'highboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('highboard')}
          >
            👑 High Board History
          </button>
        </div>

        {activeTab === "events" ? (
          <>
            {/* Category Sub-Filters */}
            <div className="category-filter-bar">
              <button 
                className={`filter-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                🌟 All Events
              </button>
              <button 
                className={`filter-chip ${categoryFilter === 'tournament' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('tournament')}
              >
                🏆 Tournaments
              </button>
              <button 
                className={`filter-chip ${categoryFilter === 'exhibition' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('exhibition')}
              >
                👑 GM Exhibitions
              </button>
              <button 
                className={`filter-chip ${categoryFilter === 'training' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('training')}
              >
                🎓 Workshops & Tactics
              </button>
              <button 
                className={`filter-chip ${categoryFilter === 'online' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('online')}
              >
                🌐 Online Series
              </button>
            </div>

            {isLoading ? (
              <div className="history-loading-container">
                <div className="spinner-ring"></div>
                <span>Loading Club History...</span>
              </div>
            ) : years.length === 0 ? (
              <div style={{ textAlign: "center", marginTop: "50px", color: "#b5afa1" }}>
                No events found in this category.
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
                        const isLeft = globalItemCounter % 2 === 0;
                        globalItemCounter++;
                        
                        return (
                          <ScrollReveal key={event._id || eventIndex}>
                            <div className={`timeline-item ${isLeft ? 'left' : 'right'}`}>
                              <div className="timeline-dot"></div>
                              <div 
                                className="timeline-card glass-panel clickable-card" 
                                onClick={() => setSelectedEventModal(event)}
                              >
                                {event.image && (
                                  <div className="card-image-banner">
                                    <img 
                                      src={event.image} 
                                      alt={event.title} 
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                    <div className="banner-overlay-badge">{event.type}</div>
                                  </div>
                                )}

                                <div className="card-body-content" style={{ padding: "24px" }}>
                                  <div className="card-header-group">
                                    <h3 className="card-event-title">
                                      {event.title}
                                    </h3>
                                    <div className="card-meta-tags">
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
                                    <div style={{ marginTop: "18px", borderTop: "1px solid #36332b", paddingTop: "14px" }}>
                                      <p style={{ margin: "0 0 8px 0", color: "#f3c144", fontWeight: "bold", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>KEY HIGHLIGHTS & PARTICIPANTS</p>
                                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        {event.playersList.slice(0, 5).map((p, i) => (
                                          <span key={i} style={{ backgroundColor: "#15120c", padding: "4px 10px", borderRadius: "5px", fontSize: "0.8rem", border: "1px solid #36332b", color: "#e2dcce" }}>
                                            {p.name}
                                          </span>
                                        ))}
                                        {event.playersList.length > 5 && (
                                          <span style={{ padding: "4px 10px", fontSize: "0.8rem", color: "#888" }}>+{event.playersList.length - 5} more</span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  
                                  <div className="view-details-prompt">
                                    <span>View Photo & Event Details</span> →
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ScrollReveal>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : activeTab === "halloffame" ? (
          <div className="hall-of-fame-container">
            {/* Top Podium Feature */}
            <ScrollReveal>
              <div className="champions-podium-card glass-panel">
                <h2 className="podium-title">🏆 ZC Chess Club Champions Podium</h2>
                <p className="podium-subtitle">Honoring our top tournament winners and inter-university champions</p>

                <div className="podium-grid">
                  {/* 2nd Place Silver */}
                  <div className="podium-place silver">
                    <div className="podium-avatar-wrapper">
                      <img src="/Winners/Winner2.png" alt="Silver Winner" className="podium-avatar" onError={(e) => { e.target.src = "/Icons/user.png"; }} />
                      <span className="podium-medal">🥈</span>
                    </div>
                    <h3 className="podium-winner-name">Abdelwahab Hamdi</h3>
                    <span className="podium-winner-badge">Runner-Up Champion</span>
                    <p className="podium-event-name">Spring 2026 Championship</p>
                  </div>

                  {/* 1st Place Gold */}
                  <div className="podium-place gold">
                    <div className="podium-crown">👑</div>
                    <div className="podium-avatar-wrapper gold-border">
                      <img src="/Winners/Winner1.png" alt="Gold Winner" className="podium-avatar" onError={(e) => { e.target.src = "/Icons/user.png"; }} />
                      <span className="podium-medal">🥇</span>
                    </div>
                    <h3 className="podium-winner-name">Abdelrahman Mohamed</h3>
                    <span className="podium-winner-badge gold-bg">Grand Champion</span>
                    <p className="podium-event-name">Spring 2026 & Ramadan Cup Winner</p>
                  </div>

                  {/* 3rd Place Bronze */}
                  <div className="podium-place bronze">
                    <div className="podium-avatar-wrapper">
                      <img src="/Winners/Winner3.png" alt="Bronze Winner" className="podium-avatar" onError={(e) => { e.target.src = "/Icons/user.png"; }} />
                      <span className="podium-medal">🥉</span>
                    </div>
                    <h3 className="podium-winner-name">Mohamed Eslam</h3>
                    <span className="podium-winner-badge">3rd Place Winner</span>
                    <p className="podium-event-name">Spring 2026 Championship</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Hall of Fame Tournament Grid */}
            <div className="hall-tournaments-grid">
              {hallOfFameChampions.map((item, idx) => (
                <ScrollReveal key={idx}>
                  <div className="hall-card glass-panel">
                    <div className="hall-card-header">
                      <div className="hall-card-image" style={{ backgroundImage: `url(${item.image})` }}>
                        <span className="hall-date-badge">{item.date}</span>
                      </div>
                      <div className="hall-card-title-group">
                        <h3 className="hall-tournament-title">{item.title}</h3>
                        <span className="hall-location">📍 {item.location}</span>
                      </div>
                    </div>

                    <div className="hall-winners-list">
                      {item.winners.map((w, wIdx) => (
                        <div key={wIdx} className="hall-winner-row">
                          <span className="hall-winner-place">{w.place}</span>
                          <span className="hall-winner-name">{w.name}</span>
                          <span className="hall-winner-tag">{w.badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
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

        {/* Interactive Event Modal */}
        {selectedEventModal && (
          <div className="event-modal-overlay" onClick={() => setSelectedEventModal(null)}>
            <div className="event-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={() => setSelectedEventModal(null)}>✕</button>

              {selectedEventModal.image && (
                <div className="modal-banner">
                  <img src={selectedEventModal.image} alt={selectedEventModal.title} />
                </div>
              )}

              <div className="modal-content-body">
                <span className="modal-type-tag">{selectedEventModal.type}</span>
                <h2 className="modal-title">{selectedEventModal.title}</h2>
                <div className="modal-meta-row">
                  <span>📅 {selectedEventModal.startDate}</span>
                  <span>📍 {selectedEventModal.location}</span>
                </div>

                <p className="modal-desc">{selectedEventModal.description}</p>

                {selectedEventModal.playersList && selectedEventModal.playersList.length > 0 && (
                  <div className="modal-highlights-section">
                    <h4>KEY HIGHLIGHTS & PARTICIPANTS</h4>
                    <div className="modal-tags-grid">
                      {selectedEventModal.playersList.map((p, idx) => (
                        <div key={idx} className="modal-tag-chip">
                          {p.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-footer-actions">
                  <a 
                    href={selectedEventModal.link || selectedEventModal.instagramUrl || selectedEventModal.url || "https://www.instagram.com/zc.chessclub/"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="modal-instagram-btn"
                  >
                    📷 View Post on Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
