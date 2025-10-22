const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const path = require('path');

// Load env
dotenv.config();

// Routes existantes
const reservationRoutes = require('./routes/reservationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const favorisRoutes = require('./routes/favorisRoutes');
const messageRoutes = require("./routes/messageRoutes");

// 🔹 Nouvelles routes
const employeeRoutes = require('./routes/employeeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes'); // Google OAuth

// 🔹 Passport config
require('./config/passport'); // fichier où tu configures GoogleStrategy

const app = express();

// Middlewares
app.use(cors());

// ⚡ Augmenter la taille du JSON et urlencoded
app.use(express.json({ limit: '50mb' })); // JSON payload jusqu'à 50mb
app.use(express.urlencoded({ limit: '50mb', extended: true })); // form-urlencoded

// Sessions pour passport
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * ✅ Servir les fichiers statiques
 * Ici on dit à Express : quand quelqu’un demande `/uploads/...`,
 * va chercher dans `backend/src/uploads/...`
 */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Routes existantes
app.use('/api/reservations', reservationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favoris', favorisRoutes);
app.use("/api/messages", messageRoutes);

// 🔹 Nouvelles
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/stats', statsRoutes);

// 🔹 Auth Google
app.use('/api/auth', authRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
