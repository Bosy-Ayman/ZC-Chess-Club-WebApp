const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors()); // Allow requests from frontend (port 3000)
app.use(express.json()); // Parse incoming JSON

// --- Mongoose Schema & Model ---
const ApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true },
  phone: { type: String, required: true },
  major: { type: String, required: true },
  batch: { type: String, required: true },
  roleTitle: { type: String, required: true },
  department: { type: String, required: true },
  roleSpecificData: { type: mongoose.Schema.Types.Mixed, default: {} },
  submissionDate: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', ApplicationSchema, 'chess_club');

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not found in .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---

// POST: submit a new application
app.post('/api/applications', async (req, res) => {
  try {
    const { name, email, idNumber, phone, major, batch, roleTitle, department, ...roleSpecificData } = req.body;

    const newApp = new Application({
      name,
      email,
      idNumber,
      phone,
      major,
      batch,
      roleTitle,
      department,
      roleSpecificData
    });

    const savedApp = await newApp.save();
    res.status(201).json({ message: 'Application submitted!', data: savedApp });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.message });
    }
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already exists', details: error.keyValue });
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET: fetch all applications (for testing in browser)
app.get('/api/applications', async (req, res) => {
  try {
    const apps = await Application.find().sort({ submissionDate: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications', details: error.message });
  }
});

// --- Start server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
