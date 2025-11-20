import mongoose from "mongoose";

// Load MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable in Vercel");
}

// --- Mongoose Schema ---
const ApplicationSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  idNumber: { type: String },
  phone: { type: String },
  major: { type: String },
  batch: { type: String },
  roleTitle: { type: String },
  department: { type: String },
  roleSpecificData: { type: mongoose.Schema.Types.Mixed, default: {} },
  submissionDate: { type: Date, default: Date.now },
});

// Avoid model recompilation during hot reloads
const Application = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

// --- Connect to MongoDB ---
async function connectDB() {
  if (mongoose.connections[0].readyState) return; // Already connected
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// --- API handler ---
export default async function handler(req, res) {
  await connectDB();

  try {
    if (req.method === "GET") {
      const applications = await Application.find().sort({ submissionDate: -1 });
      return res.status(200).json(applications);
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.error("Error fetching applications:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
