import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI is missing");

// Schema and model same as before...

async function connectDB() {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(MONGO_URI);
}

export async function GET() {
  await connectDB();
  const apps = await Application.find().sort({ submissionDate: -1 });
  return Response.json(apps);
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const newApp = new Application(body);
  await newApp.save();
  return Response.json(newApp, { status: 201 });
}