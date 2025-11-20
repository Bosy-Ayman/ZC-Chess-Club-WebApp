const mongoose = require('mongoose');

// Connection caching for serverless
let conn = null;
const uri = process.env.MONGO_URI;

const connectDB = async () => {
  if (conn == null) {
    conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('New MongoDB connection');
  }
  return conn;
};

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

module.exports = async (req, res) => {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const apps = await Application.find({}).sort({ submissionDate: -1 }).lean();
      return res.status(200).json(apps);
    }

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
      return res.status(201).json({ message: 'Success', id: newApp._id });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('API Error:', error);

    if (error.code === 11000) {
      return res.status(409).json({ error: 'Email already used' });
    }

    return res.status(500).json({ error: 'Server error', details: error.message });
  }
};