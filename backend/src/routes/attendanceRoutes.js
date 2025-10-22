// backend/src/routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/attendanceController');

// Employé et ChefProjet
router.post('/clock-in',  verifyToken, verifyRole('Employe', 'ChefProjet'), ctrl.clockIn);
router.post('/clock-out', verifyToken, verifyRole('Employe', 'ChefProjet'), ctrl.clockOut);
router.get('/me',          verifyToken,                         ctrl.myAttendance);

// Admin / ChefProjet
router.get('/',            verifyToken, verifyRole('Admin', 'ChefProjet'), ctrl.listAttendance);
router.get('/today-summary', verifyToken, verifyRole('Admin', 'ChefProjet'), ctrl.todaySummary);

module.exports = router;
