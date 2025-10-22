// backend/src/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/statsController');

router.get('/admin', verifyToken, verifyRole('Admin'), ctrl.adminStats);
router.get('/reservations/last7days', verifyToken, verifyRole('Admin', 'ChefProjet'), ctrl.reservationsLast7Days);

module.exports = router;
