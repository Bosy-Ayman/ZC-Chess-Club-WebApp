const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors({
  origin: "*", // Update to your frontend URL for security, e.g., "https://zc-chess-club.vercel.app"
  methods: "GET,POST"
}));
app.use(express.json());

// Schema
const ApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true },
  phone: { type: String, required: true },
  major: { type: String, required: true },
  batch: { type: String, required: true },
  roleTitle: { type: String, required: true },
  department: { type: String, required: true },
  roleSpecificData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  submissionDate: { type: Date, default: Date.now }
});

const Application = mongoose.model("Application", ApplicationSchema, "applications");

// MongoDB connection (Vercel serverless handles per-request connections)
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// POST route
app.post('/api/applications', async (req, res) => {
  try {
    const {
      name, email, idNumber, phone, major, batch,
      roleTitle, department, ...roleSpecificData
    } = req.body;

    const newApplication = new Application({
      name, email, idNumber, phone, major, batch,
      roleTitle, department,
      roleSpecificData
    });

    await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully",
      id: newApplication._id
    });
  } catch (error) {
    console.error("Save error:", error);
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already used" });
    }
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// GET route
app.get('/api/applications', async (req, res) => {
  try {
    const apps = await Application.find()
      .sort({ submissionDate: -1 })
      .lean();

    res.status(200).json(apps);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      error: "Failed to fetch applications",
      details: error.message
    });
  }
});

// Export for Vercel
module.exports = app;