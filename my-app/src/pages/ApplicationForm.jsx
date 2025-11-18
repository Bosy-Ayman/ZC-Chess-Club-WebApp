import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import './ApplicationForm.css'; // Import the new CSS

// A reusable component for the application forms
const ApplicationForm = ({ title, department, roleDescription, roleSpecificContent }) => {
  // State for submission status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    // --- 1. Gather All Form Data (The New, Robust Way) ---
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    // --- 2. Manually add/overwrite fields from props ---
    // (FormData captures the 'role-choice' input, but we'll overwrite it
    // with the 'title' prop to be 100% sure)
    payload.roleTitle = title;
    payload.department = department;

    // Map form 'id' to backend 'idNumber'
    payload.idNumber = payload.id;
    delete payload.id; // remove the original 'id' field
    delete payload['role-choice']; // remove the read-only input field

    // --- 3. Send Data to API ---
    try {
      const response = await fetch('http://localhost:5000/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        e.target.reset(); // Clear the form
      } else {
        // Handle API errors (e.g., "Email already exists")
        setError(result.error || 'Submission failed. Please try again.');
      }
    } catch (err) {
      // Handle network errors
      setError('A network error occurred. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-page-wrapper">
      <Header />
      
      <main className="form-container">
        <h1>♟️ ZC Chess Club Recruitment Form</h1>
        <p className="form-description">
          "Chess is the gymnasium of the mind." – Blaise Pascal. We are currently accepting applications for the 
          {title} team.
        </p>

        <form onSubmit={handleSubmit}>
          {/* --- Section 1: Basic Information --- */}
          <section className="form-section basic-info-section">
            <h2>Section 1: Basic Information</h2>
            <p className="section-note">
              {roleDescription}
              <br/><br/>
              Please provide your contact and academic information. All fields marked with * are required.
            </p>
            
            {/* 'name' attributes are present, which is what FormData needs */}
            <label htmlFor="name">Name*</label>
            <input type="text" id="name" name="name" required />
            
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" name="email" required />
            
            <label htmlFor="id">ID*</label>
            <input type="text" id="id" name="id" required />
            
            <label htmlFor="phone">Phone Number*</label>
            <input type="tel" id="phone" name="phone" required />
            
            <label htmlFor="major">Major*</label>
            <input type="text" id="major" name="major" required />
            
            <label htmlFor="batch">Batch*</label>
            <input type="text" id="batch" name="batch" required />
            
            <label htmlFor="role-choice">Applying for Role*</label>
            <input type="text" id="role-choice" name="role-choice" value={title} readOnly />
          </section>
          
          {/* --- Role Specific Content (Dynamic) --- */}
          {/* This works perfectly now because FormData will
              find all 'name' attributes inside this fragment */}
          {roleSpecificContent}
          
          {/* --- Submission & Status Messages --- */}
          <div className="form-status" aria-live="polite">
            {success && (
              <p className="status-success">
                Application for {title} submitted successfully! We will review your details soon.
              </p>
            )}
            {error && (
              <p className="status-error">
                <strong>Error:</strong> {error}
              </p>
            )}
          </div>
          
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplicationForm;