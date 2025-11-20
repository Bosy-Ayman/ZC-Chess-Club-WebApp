import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './ApplicationsTable.css';

const ApplicationsTable = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);


  const PrettyRoleData = ({ data }) => {
  const formatKey = (key) =>
    key.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  // Recursive rendering
  const renderData = (obj) => {
    if (obj === null || obj === undefined) return <em style={{ color: '#666' }}>Not provided</em>;
    
    if (Array.isArray(obj)) {
      return obj.map((item, index) => (
        <div key={index} className="pretty-role-array-item">
          <h4>Entry #{index + 1}</h4>
          {renderData(item)}
        </div>
      ));
    }

    if (typeof obj === 'object') {
      return Object.entries(obj).map(([key, value]) => (
        <div key={key} className="pretty-field">
          <strong>{formatKey(key)}:</strong>
          <div style={{ paddingLeft: '15px' }}>{renderData(value)}</div>
        </div>
      ));
    }

    // Plain value
    return <span>{obj}</span>;
  };

  return (
    <div className="pretty-role-data">
      {Object.keys(data || {}).length === 0 ? (
        <p style={{ color: '#caba91', fontStyle: 'italic' }}>No role-specific data provided.</p>
      ) : (
        renderData(data)
      )}
    </div>
  );
};
useEffect(() => {
  const API_BASE =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "/api/applications"; 

  const fetchApplications = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/applications`);
      if (!response.ok) throw new Error("Failed to fetch applications");

      const result = await response.json();
      setApplications(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  fetchApplications();
}, []);


  const openModal = (data) => {
    setSelectedData(data);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedData(null);
  };

  if (isLoading) {
    return (
      <div className="app-container applications-table-page">
        <Header />
        <div className="layout-container">
          <div className="content-wrapper">
            <div className="layout-content-container">
              <h1 className="page-title">Loading Applications...</h1>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container applications-table-page">
        <Header />
        <div className="layout-container">
          <div className="content-wrapper">
            <div className="layout-content-container">
              <h1 className="page-title" style={{ color: '#ff6b6b' }}>
                Error: {error}
              </h1>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-container applications-table-page">
      <Header />

      <div className="layout-container">
        <div className="content-wrapper">
          <div className="layout-content-container">
            {/* Header */}
            <header className="page-header-section">
              <div className="header-text-group">
                <h1 className="page-title">♟️ Submitted Applications</h1>
                <p className="page-description">
                  A total of <strong>{applications.length}</strong> application(s) found.
                </p>
              </div>
            </header>

            {/* Table */}
            <div className="table-container">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Submission Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Major</th>
                    <th>Batch</th>
                    <th>ID Number</th>
                  
                    {/* Sticky Details Header */}
                    <th className="sticky-details-header">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>{new Date(app.submissionDate).toLocaleString()}</td>
                      <td>{app.name}</td>
                      <td>{app.email}</td>
                      <td>{app.phone}</td>
                      <td>{app.roleTitle}</td>
                      <td>{app.department}</td>
                      <td>{app.major}</td>
                      <td>{app.batch}</td>
                      <td>{app.idNumber}</td>
                      
                      {/* Sticky Details Button */}
                      <td className="sticky-details-cell">
                        <button
                          className="view-button"
                          onClick={() => openModal(app.roleSpecificData)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal */}
      {/* ==================== INSIDE THE MODAL ==================== */}
            {modalOpen && (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Role Specific Data</h2>
                    <button className="modal-close" onClick={closeModal}>✕</button>
                </div>
                <div className="modal-body">
                    <PrettyRoleData data={selectedData} />
                </div>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ApplicationsTable;