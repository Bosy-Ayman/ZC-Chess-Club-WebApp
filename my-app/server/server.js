const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors()); // Enables cross-origin communication from React (port 3000)
app.use(express.json()); // Parses incoming JSON payloads

// --- Mongoose Schema & Model ---

// Define the flexible schema structure to accommodate all form fields
const ApplicationSchema = new mongoose.Schema({
    // --- Section 1: Generic Personal Info (Required for all) ---
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Ensure email is unique
    idNumber: { type: String, required: true },
    phone: { type: String, required: true },
    major: { type: String, required: true },
    batch: { type: String, required: true },
    
    // --- Role Info (Required) ---
    roleTitle: { type: String, required: true }, // e.g., "Media Member"
    department: { type: String, required: true }, // e.g., "Multimedia"
    
    // --- Role-Specific Data (Flexible/Mixed) ---
    // Stores all custom questions (chessScore, leadershipExperience, etc.)
    roleSpecificData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    
    submissionDate: { type: Date, default: Date.now }
});


<<<<<<< HEAD
const Application = mongoose.model('Application', ApplicationSchema, 'chess_club');
=======
const Application = mongoose.model('Application', ApplicationSchema, 'zcchessclub_db_user');
>>>>>>> parent of d9cebc3 (add)

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB successfully connected!');
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// --- API Endpoint: Handle Form Submission ---

app.post('/api/applications', async (req, res) => {
    // Log the incoming request body immediately for debugging
    console.log("-----------------------------------------");
    console.log(`[INCOMING DATA] Role: ${req.body.roleTitle || 'N/A'}`);
    console.log("Full Payload Received:", req.body);
    console.log("-----------------------------------------");
    
    try {
        const {
            name, email, idNumber, phone, major, batch, 
            roleTitle, department, ...roleSpecificData 
        } = req.body;

        // Construct the document, explicitly separating generic and specific data
        const newApplication = new Application({
            name, email, idNumber, phone, major, batch, 
            roleTitle, department,
            roleSpecificData: roleSpecificData 
        });

        await newApplication.save();
        
        console.log(`[SUCCESS] Document saved with ID: ${newApplication._id}`);
        res.status(201).json({ 
            message: 'Application submitted successfully!', 
            data: { id: newApplication._id, role: roleTitle }
        });

    } catch (error) {
        console.error("!!! DATABASE SAVE ERROR !!!");
        
        // Log detailed Mongoose Validation Errors (e.g., required field missing)
        if (error.name === 'ValidationError') {
            console.error("Validation failed. Missing/Invalid fields:", Object.keys(error.errors));
            return res.status(400).json({ 
                error: 'Validation failed.', 
                details: error.message,
                fields: Object.keys(error.errors) 
            });
        } 
        
        // Log Duplicate Key Error (e.g., email already exists)
        if (error.code && error.code === 11000) {
            console.error("Duplicate key error:", error.keyValue);
            return res.status(409).json({
                error: 'Conflict: This email address has already submitted an application.',
                details: error.keyValue
            });
        }

        console.error("Unknown Server Error:", error);
        res.status(500).json({ error: 'Failed to save application to database', details: error.message });
    }
<<<<<<< HEAD
});
=======
});

// --- API Endpoint: Get All Applications ---
app.get('/api/applications', async (req, res) => {
    try {
        const allApplications = await Application.find().sort({ submissionDate: -1 }); // newest first
        res.status(200).json(allApplications);
    } catch (error) {
        console.error("Failed to fetch applications:", error);
        res.status(500).json({
            error: "Failed to fetch applications",
            details: error.message
        });
    }
});
>>>>>>> parent of d9cebc3 (add)
