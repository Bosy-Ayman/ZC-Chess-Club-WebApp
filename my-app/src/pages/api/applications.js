import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error("MONGO_URI is missing");

const ApplicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  idNumber: String,
  phone: String,
  major: String,
  batch: String,
  roleTitle: String,
  department: String,
  roleSpecificData: { type: mongoose.Schema.Types.Mixed, default: {} },
  submissionDate: { type: Date, default: Date.now },
});

const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await connectDB();

  if (req.method === "GET") {
    const apps = await Application.find().sort({ submissionDate: -1 });
    return res.status(200).json(apps);
  }

  if (req.method === "POST") {
    const newApp = new Application(req.body);
    await newApp.save();
    return res.status(201).json(newApp);
  }

  res.status(405).json({ message: "Method not allowed" });
}