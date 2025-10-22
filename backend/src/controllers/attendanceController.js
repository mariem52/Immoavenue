// backend/src/controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
const endOfDay   = (d) => { const x = new Date(d); x.setHours(23,59,59,999); return x; };

// Employé: pointer l'arrivée
exports.clockIn = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    let att = await Attendance.findOne({ userId: req.user._id, date: today });
    if (att && att.clockIn) return res.status(400).json({ message: 'Déjà pointé (arrivée) pour aujourd’hui' });

    if (!att) att = new Attendance({ userId: req.user._id, date: today, status: 'Present' });
    att.clockIn = new Date();
    await att.save();
    res.status(201).json(att);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Employé: pointer la sortie
exports.clockOut = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const att = await Attendance.findOne({ userId: req.user._id, date: today });
    if (!att || !att.clockIn) return res.status(400).json({ message: 'Aucun pointage d’entrée pour aujourd’hui' });
    if (att.clockOut) return res.status(400).json({ message: 'Déjà pointé (sortie) pour aujourd’hui' });

    att.clockOut = new Date();
    const diffMs = att.clockOut - att.clockIn;
    att.totalHours = Math.round((diffMs / 36e5) * 100) / 100; // 2 décimales
    await att.save();
    res.json(att);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Employé: mes pointages
exports.myAttendance = async (req, res) => {
  try {
    const { month } = req.query; // YYYY-MM
    const filter = { userId: req.user._id };
    if (month) {
      const [y, m] = month.split('-').map(Number);
      const from = new Date(y, m - 1, 1);
      const to   = new Date(y, m, 0, 23, 59, 59, 999);
      filter.date = { $gte: startOfDay(from), $lte: endOfDay(to) };
    }
    const list = await Attendance.find(filter).sort({ date: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Admin/Chef: liste globale
exports.listAttendance = async (req, res) => {
  try {
    const { userId, from, to } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = startOfDay(new Date(from));
      if (to)   filter.date.$lte = endOfDay(new Date(to));
    }
    const list = await Attendance.find(filter)
      .populate('userId', 'nom prenom email role')
      .sort({ date: -1 });
    res.json(list);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Admin/Chef: résumé du jour
exports.todaySummary = async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const present = await Attendance.countDocuments({ date: today, clockIn: { $ne: null } });
    const totalEmployees = await User.countDocuments({ role: 'Employe' });
    res.json({ date: today, present, absent: Math.max(totalEmployees - present, 0), totalEmployees });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
