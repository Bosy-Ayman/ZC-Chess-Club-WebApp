// src/pages/api/applications.js   (or api/applications.js – both work the same on Vercel)

import mongoose from 'mongoose';

// Connection caching – essential for Vercel serverless
let conn = null;
const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error('Please add MONGO_URI to Vercel Environment Variables');
}

const connectDB = async () => {
  if (conn == null) {
    conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    // Ready state 1 = connected
    console.log('New MongoDB connection established');
  }
  return conn;
};

// Define schema & model (only once)
const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true },
  phone: { type: String, required: true },
  major: { type: String, required: true },
  batch: { type: String, required: true },
  roleTitle: { type: String, required: true },
  department: { type: String, required: true },
  roleSpecificData: { type: mongoose.Schema.Types.Mixed, default: {} },
  submissionDate: { type: Date, default: Date.now },
});

const Application =
  mongoose.models.Application || mongoose.model('Application', applicationSchema, 'applications');

// Main API handler
export default async function handler(req, res) {
  try {
    await connectDB();

    // GET: Fetch all applications
    if (req.method === 'GET') {
      const apps = await Application.find({})
        .sort({ submissionDate: -1 })
        .lean();

      return res.status(200).json(apps);
    }

    // POST: Create new application
    if (req.method === 'POST') {
      const {
        name,
        email,
        idNumber,
        phone,
        major,
        batch,
        roleTitle,
        department,
        ...roleSpecificData
      } = req.body;

      const newApp = new Application({
        name,
        email,
        idNumber,
        phone,
        major,
        batch,
        roleTitle,
        department,
        roleSpecificData,
      });

      await newApp.save();
      return res.status(201).json({ message: 'Application saved', id: newApp._id });
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('API Error:', error); // ← FIXED LINE (this was the bug!)

    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already used' });
    }

    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}

// Required for larger payloads (forms with big roleSpecificData)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};