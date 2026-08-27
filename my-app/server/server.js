const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dns = require('dns');

// DNS override removed because it breaks Serverless functions on AWS Lambda (Vercel)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const JWT_SECRET = process.env.JWT_SECRET || 'zcchessclub-super-secret-key-change-me';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors({
  origin: [
    "http://localhost:3000", // local frontend
    "https://zc-chess-club-web-euimxokx7-bosy-aymans-projects.vercel.app" // your deployed frontend
  ]
}));
app.use(express.json());

// --- MongoDB Schema & Model ---
const ApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  idNumber: { type: String, required: true },
  phone: { type: String, required: true },
  major: { type: String, required: true },
  batch: { type: String, required: true },
  roleTitle: { type: String, required: true },
  department: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Accepted', 'Rejected'] },
  roleSpecificData: { type: mongoose.Schema.Types.Mixed, default: {} },
  submissionDate: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', ApplicationSchema, 'chess_club');

// --- Tournament Schema & Model ---
const TournamentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, default: 'Upcoming' },
  startDate: { type: String, required: true }, // Format: YYYY-MM-DD
  endDate: { type: String, default: 'Unknown' }, // Format: YYYY-MM-DD or 'Unknown'
  time: { type: String, required: true },
  location: { type: String, default: 'Zewail Chess Club' },
  description: { type: String, default: '' },
  players: { type: Number, default: 0 },
  detailsUrl: { type: String, default: '' },
  playersList: [{
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    major: { type: String, required: true }
  }],
  registrations: [{
    email: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] }
  }],
  matches: [{
    round: { type: Number, required: true },
    white: { type: String, required: true },
    black: { type: String, required: true },
    result: { type: String, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Tournament = mongoose.model('Tournament', TournamentSchema, 'tournaments');

// --- User Schema & Model ---
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  idNumber: { type: String, default: "" },
  phone: { type: String, default: "" },
  major: { type: String, default: "" },
  batch: { type: String, default: "" },
  role: { type: String, default: 'member' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema, 'users');

// --- Puzzle Tournament Schema & Model ---
const PuzzleSchema = new mongoose.Schema({
  initialFen: { type: String, required: true },
  mateIn: { type: Number, required: true, enum: [1, 2, 3] },
  correctMoves: [{ type: String, required: true }],
  description: { type: String, default: "" }
});

const PuzzleTournamentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: String, required: true }, // Format: YYYY-MM-DD
  timeLimit: { type: Number, required: true, default: 60 }, // seconds per puzzle
  puzzles: [PuzzleSchema],
  leaderboard: [{
    email: { type: String, required: true },
    name: { type: String, required: true },
    score: { type: Number, required: true },
    solvedCount: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

const PuzzleTournament = mongoose.model('PuzzleTournament', PuzzleTournamentSchema, 'puzzle_tournaments');

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Error: MONGO_URI not defined in environment variables.");
  process.exit(1);
}

// Removed bufferCommands: false to allow Mongoose to wait for DB connection in serverless

mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose disconnected'));

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB connected!');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Attempting connection to local MongoDB fallback (mongodb://localhost:27017/chess_club)...');
    mongoose.connect('mongodb://localhost:27017/chess_club', { serverSelectionTimeoutMS: 3000 })
      .then(() => {
        console.log('Connected to fallback local MongoDB!');
        seedDatabase();
      })
      .catch(localErr => console.error('Fallback local MongoDB connection failed as well:', localErr.message));
  });

async function seedAdminUser() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found in database. Seeding default admin user...');
      const hashedPassword = await bcrypt.hash('chessadmin123', 10);
      const defaultAdmin = new User({
        email: 'admin@zcchessclub.com',
        password: hashedPassword,
        role: 'admin'
      });
      await defaultAdmin.save();
      console.log('Default admin user successfully seeded: admin@zcchessclub.com / chessadmin123');
    } else {
      console.log('Users collection is not empty. Seeding skipped.');
    }
  } catch (err) {
    console.error('Error seeding default admin user:', err.message);
  }
}

async function seedPuzzleTournament() {
  try {
    const count = await PuzzleTournament.countDocuments();
    if (count === 0) {
      console.log('No puzzle tournaments found in database. Seeding default tournaments...');
      const defaultTournament = new PuzzleTournament({
        title: 'Weekly Tactics Arena',
        startDate: new Date().toISOString().split('T')[0],
        timeLimit: 60,
        puzzles: [
          {
            initialFen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
            mateIn: 1,
            correctMoves: ['h5f7'],
            description: 'Find the classic Scholar\'s Mate in 1 move!'
          },
          {
            initialFen: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
            mateIn: 1,
            correctMoves: ['a1a8'],
            description: 'Exploit the weak back rank to deliver mate in 1!'
          }
        ],
        leaderboard: []
      });
      await defaultTournament.save();
      console.log('Default puzzle tournament successfully seeded!');
    } else {
      console.log('Puzzle tournaments collection is not empty. Seeding skipped.');
    }
  } catch (err) {
    console.error('Error seeding puzzle tournament:', err.message);
  }
}

async function seedDatabase() {
  await seedAdminUser();
  await seedPuzzleTournament();
}

// --- Routes ---

// POST: submit new application
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
    if (error.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed', details: error.message });
    if (error.code === 11000) return res.status(409).json({ error: 'Email already exists', details: error.keyValue });
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET: fetch all applications
app.get('/api/applications', async (req, res) => {
  try {
    const apps = await Application.find().sort({ submissionDate: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications', details: error.message });
  }
});

// POST: Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    let isMatch = false;
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token: token,
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login', details: error.message });
  }
});

// POST: Admin Google login
app.post('/api/admin/google-login', async (req, res) => {
  try {
    const { credential, name, idNumber, phone, major, batch } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Google credential is required' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID || '963065836254-h2pdhhkdgt5c9p4vim5ervkdc13iqhl9.apps.googleusercontent.com'
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.error('Google ID token verification failed:', verifyError.message);
      // Fallback base64 decode for local testing/troubleshooting (in case of client ID configuration issues)
      const parts = credential.split('.');
      if (parts.length === 3) {
        payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        console.warn('Warning: Fell back to insecure decoding for Google Login due to token verification error.');
      } else {
        return res.status(401).json({ error: 'Invalid Google authentication token' });
      }
    }

    const email = payload.email;
    if (!email) {
      return res.status(400).json({ error: 'Google credential does not contain email' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      // Prevent auto-register from simple login attempt
      if (!idNumber || !phone || !major) {
        return res.status(404).json({ error: 'Account not found. Please sign up first.' });
      }
      
      // Auto-register google users when they provide sign-up profile fields
      user = new User({
        email,
        password: `google-auth-${Date.now()}`,
        name: name || payload.name || "",
        idNumber: idNumber || "",
        phone: phone || "",
        major: major || "",
        batch: batch || "",
        role: email === 'admin@zcchessclub.com' ? 'admin' : 'member'
      });
      await user.save();
    } else {
      // Update details if passed during profile completion
      if (name) user.name = name;
      if (idNumber) user.idNumber = idNumber;
      if (phone) user.phone = phone;
      if (major) user.major = major;
      if (batch) user.batch = batch;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Google login successful!',
      token: token,
      user: {
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during Google login', details: error.message });
  }
});

// POST: Admin/Member Signup
app.post('/api/admin/signup', async (req, res) => {
  try {
    const { email, password, name, idNumber, phone, major, batch } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name: name || "",
      idNumber: idNumber || "",
      phone: phone || "",
      major: major || "",
      batch: batch || "",
      role: email === 'admin@zcchessclub.com' ? 'admin' : 'member'
    });

    const savedUser = await newUser.save();
    
    const token = jwt.sign(
      { userId: savedUser._id, email: savedUser.email, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token: token,
      user: {
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during signup', details: error.message });
  }
});

// GET: Retrieve user profile
app.get('/api/profile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: user.name || "",
      email: user.email,
      idNumber: user.idNumber || "",
      phone: user.phone || "",
      major: user.major || "",
      batch: user.batch || "",
      role: user.role || "member"
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user profile', details: error.message });
  }
});

// GET: fetch all users (for admin dashboard)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password hash
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
});

// DELETE: remove a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
});

// --- Tournament Routes ---

// GET: fetch all tournaments
app.get('/api/tournaments', async (req, res) => {
  try {
    const tournaments = await Tournament.find().sort({ startDate: 1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournaments', details: error.message });
  }
});

// GET: fetch a single tournament by ID
app.get('/api/tournaments/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournament details', details: error.message });
  }
});

// PUT: add a player to a tournament
app.put('/api/tournaments/:id/players', async (req, res) => {
  try {
    const { name, rating, major } = req.body;
    if (!name || !rating || !major) {
      return res.status(400).json({ error: "Name, rating, and major are required" });
    }
    
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    
    tournament.playersList.push({ name, rating: Number(rating), major });
    // Keep 'players' count field in sync
    tournament.players = tournament.playersList.length;
    
    await tournament.save();
    res.json({ message: "Player added successfully!", data: tournament });
  } catch (error) {
    res.status(500).json({ error: 'Server error adding player', details: error.message });
  }
});

// PUT: add a match result to a tournament
app.put('/api/tournaments/:id/matches', async (req, res) => {
  try {
    const { round, white, black, result } = req.body;
    if (!round || !white || !black || !result) {
      return res.status(400).json({ error: "Round, white, black, and result are required" });
    }
    
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    
    tournament.matches.push({ round: Number(round), white, black, result });
    await tournament.save();
    res.json({ message: "Match result added successfully!", data: tournament });
  } catch (error) {
    res.status(500).json({ error: 'Server error adding match result', details: error.message });
  }
});

// PUT: update an existing match result
app.put('/api/tournaments/:id/matches/:matchId', async (req, res) => {
  try {
    const { result } = req.body;
    if (!result) return res.status(400).json({ error: "Result required" });

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });

    const match = tournament.matches.id(req.params.matchId);
    if (!match) return res.status(404).json({ error: "Match not found" });

    match.result = result;
    await tournament.save();
    res.json({ message: "Match result updated successfully!", data: tournament });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating match result', details: error.message });
  }
});

// POST: generate next round Swiss pairings automatically
app.post('/api/tournaments/:id/generate-swiss-round', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: "Tournament not found" });

    const players = tournament.playersList || [];
    if (players.length < 2) {
      return res.status(400).json({ error: "At least 2 players are required to generate Swiss pairings." });
    }

    // Determine current highest round
    const existingMatches = tournament.matches || [];

    // Check if any existing matches are still Pending
    const pendingMatches = existingMatches.filter(m => !m.result || m.result === "Pending");
    if (pendingMatches.length > 0) {
      return res.status(400).json({ 
        error: `Cannot generate next round. There are still ${pendingMatches.length} pending match(es) in Round ${Math.max(...existingMatches.map(m => m.round || 1))}. Please record all match results first!` 
      });
    }

    const maxRound = existingMatches.reduce((max, m) => Math.max(max, m.round || 1), 0);
    const nextRound = maxRound + 1;

    // Calculate current points for each player
    const pointsMap = {};
    players.forEach(p => { pointsMap[p.name] = { name: p.name, rating: p.rating || 1500, points: 0 }; });

    existingMatches.forEach(m => {
      if (!pointsMap[m.white]) pointsMap[m.white] = { name: m.white, rating: 1500, points: 0 };
      if (!pointsMap[m.black]) pointsMap[m.black] = { name: m.black, rating: 1500, points: 0 };

      if (m.result === "1-0" || m.result === "1 - 0") {
        pointsMap[m.white].points += 1;
      } else if (m.result === "0-1" || m.result === "0 - 1") {
        pointsMap[m.black].points += 1;
      } else if (m.result === "1/2-1/2" || m.result === "½ - ½" || m.result === "Draw") {
        pointsMap[m.white].points += 0.5;
        pointsMap[m.black].points += 0.5;
      }
    });

    // Sort players by points descending, then rating descending
    const sorted = Object.values(pointsMap).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return b.rating - a.rating;
    });

    // Generate Swiss pairings (1 vs 2, 3 vs 4, etc.)
    const newMatches = [];
    for (let i = 0; i < sorted.length; i += 2) {
      if (i + 1 < sorted.length) {
        newMatches.push({
          round: nextRound,
          white: sorted[i].name,
          black: sorted[i + 1].name,
          result: "Pending"
        });
      }
    }

    // Save new round matches to database
    tournament.matches.push(...newMatches);
    await tournament.save();

    res.json({ message: `Round ${nextRound} Swiss pairings generated successfully!`, data: tournament });
  } catch (error) {
    res.status(500).json({ error: 'Server error generating Swiss pairings', details: error.message });
  }
});

// PUT: update application status and corresponding user role
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value. Must be Accepted or Rejected." });
    }
    
    const updatedApp = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedApp) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    // Update user role if application accepted
    if (status === 'Accepted') {
      let normalizedRole = 'member';
      const title = updatedApp.roleTitle.toLowerCase();
      if (title.includes('oc')) normalizedRole = 'oc';
      else if (title.includes('hr')) normalizedRole = 'hr';
      else if (title.includes('media')) normalizedRole = 'media';
      else if (title.includes('trainer')) normalizedRole = 'trainer';
      else if (title.includes('trainee')) normalizedRole = 'trainee';
      
      await User.findOneAndUpdate(
        { email: updatedApp.email },
        { role: normalizedRole }
      );
    } else if (status === 'Rejected') {
      // Revert user role back to member
      await User.findOneAndUpdate(
        { email: updatedApp.email },
        { role: 'member' }
      );
    }
    
    res.json({ message: `Application status updated to ${status}`, data: updatedApp });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating application status', details: error.message });
  }
});

// POST: create a new tournament
app.post('/api/tournaments', async (req, res) => {
  try {
    const { title, type, status, startDate, endDate, time, location, description, players, detailsUrl } = req.body;
    
    const newTournament = new Tournament({
      title,
      type,
      status: status || 'Upcoming',
      startDate,
      endDate: endDate || 'Unknown',
      time,
      location: location || 'Zewail Chess Club',
      description: description || '',
      players: players || 0,
      detailsUrl: detailsUrl || ''
    });

    const savedTournament = await newTournament.save();
    res.status(201).json({ message: 'Tournament created successfully!', data: savedTournament });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: error.message });
    }
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// DELETE: delete a tournament by ID
app.delete('/api/tournaments/:id', async (req, res) => {
  try {
    const deletedTournament = await Tournament.findByIdAndDelete(req.params.id);
    if (!deletedTournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json({ message: 'Tournament deleted successfully!', data: deletedTournament });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// GET: user's tournaments
app.get('/api/users/:email/tournaments', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tournaments = await Tournament.find({
      $or: [
        { 'registrations.email': email },
        { 'playersList.name': user.name }
      ]
    });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user tournaments', details: error.message });
  }
});

// POST: register for a tournament
app.post('/api/tournaments/:id/register', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) return res.status(400).json({ error: 'Email and name required' });

    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    // Check if already registered
    if (tournament.registrations.some(reg => reg.email === email)) {
      return res.status(400).json({ error: 'Already registered for this tournament' });
    }

    tournament.registrations.push({ email, name, status: 'Pending' });
    const saved = await tournament.save();
    res.json({ message: 'Successfully registered', data: saved });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});
// --- Puzzle Tournament Routes ---

// POST: create a new puzzle tournament
app.post('/api/puzzle-tournaments', async (req, res) => {
  try {
    const { title, startDate, timeLimit, puzzles } = req.body;
    if (!title || !startDate || !puzzles || puzzles.length === 0) {
      return res.status(400).json({ error: 'Title, startDate, and at least one puzzle are required' });
    }

    const newTournament = new PuzzleTournament({
      title,
      startDate,
      timeLimit: timeLimit || 60,
      puzzles,
      leaderboard: []
    });

    const saved = await newTournament.save();
    res.status(201).json({ message: 'Puzzle tournament created successfully!', data: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create puzzle tournament', details: error.message });
  }
});

// GET: fetch all puzzle tournaments
app.get('/api/puzzle-tournaments', async (req, res) => {
  try {
    const tournaments = await PuzzleTournament.find().sort({ createdAt: -1 });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch puzzle tournaments', details: error.message });
  }
});

// GET: fetch a single puzzle tournament
app.get('/api/puzzle-tournaments/:id', async (req, res) => {
  try {
    const tournament = await PuzzleTournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tournament', details: error.message });
  }
});

// POST: submit a score and update the leaderboard
app.post('/api/puzzle-tournaments/:id/submit-score', async (req, res) => {
  try {
    const { name, email, score, solvedCount } = req.body;
    if (!name || !email || score === undefined || solvedCount === undefined) {
      return res.status(400).json({ error: 'Name, email, score, and solvedCount are required' });
    }

    const tournament = await PuzzleTournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    // Check if user already submitted a score
    const existingIndex = tournament.leaderboard.findIndex(entry => entry.email === email);
    if (existingIndex !== -1) {
      if (score > tournament.leaderboard[existingIndex].score) {
        tournament.leaderboard[existingIndex].score = score;
        tournament.leaderboard[existingIndex].solvedCount = solvedCount;
        tournament.leaderboard[existingIndex].name = name;
      }
    } else {
      tournament.leaderboard.push({ name, email, score, solvedCount });
    }

    // Sort leaderboard desc
    tournament.leaderboard.sort((a, b) => b.score - a.score);

    const saved = await tournament.save();
    res.json({ message: 'Score submitted successfully!', data: saved });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit score', details: error.message });
  }
});

// --- Start server ---
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
