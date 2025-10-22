// backend/src/controllers/statsController.js
const Project = require('../models/Project');
const Reservation = require('../models/Reservation');
const Favoris = require('../models/Favoris');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

exports.adminStats = async (req, res) => {
  try {
    const [totalProjects, totalFavoris, totalReservations, resByStatus, totalEmployees, totalClients, presentToday] = await Promise.all([
      Project.countDocuments(),
      Favoris.countDocuments(),
      Reservation.countDocuments(),
      Reservation.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      User.countDocuments({ role: 'Employe' }),
      User.countDocuments({ role: 'Client' }),
      Attendance.countDocuments({ date: new Date(new Date().setHours(0,0,0,0)), clockIn: { $ne: null } }),
    ]);

    const reservationsStatus = { 'En attente': 0, 'Acceptée': 0, 'Refusée': 0 };
    for (const r of resByStatus) reservationsStatus[r._id] = r.count;

    res.json({
      totals: { projects: totalProjects, reservations: totalReservations, favoris: totalFavoris, employees: totalEmployees, clients: totalClients },
      reservationsStatus,
      attendanceToday: { present: presentToday, absent: Math.max(totalEmployees - presentToday, 0) },
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Optionnel: réservations sur 7 jours
exports.reservationsLast7Days = async (req, res) => {
  try {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    const data = await Reservation.aggregate([
      { $match: { createdAt: { $gte: from } } },
      { $group: { _id: { $dateToString: { date: '$createdAt', format: '%Y-%m-%d' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
