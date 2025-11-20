import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

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
  submissionDate: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', ApplicationSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);

  await Application.create({
    name: "Alice Smith",
    email: "alice@example.com",
    idNumber: "A001",
    phone: "0123456789",
    major: "CS",
    batch: "2024",
    roleTitle: "Trainer Member",
    department: "Chess Training",
    roleSpecificData: { experience: "3 years" }
  });

  console.log("Seeded successfully!");
  mongoose.disconnect();
}

seed();
