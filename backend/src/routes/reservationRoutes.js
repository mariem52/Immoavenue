const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyToken, verifyRole, verifyReservationOwner } = require('../middlewares/authMiddleware');

// ⚠️ IMPORTANT: La route /me doit être AVANT /:id pour éviter les conflits
// Créer une réservation (Client uniquement)
router.post('/', verifyToken, verifyRole('Client'), reservationController.createReservation);

// Récupérer mes réservations (Client) - DOIT ÊTRE AVANT /:id
router.get('/me', verifyToken, verifyRole('Client'), reservationController.getMyReservations);

// Récupérer toutes les réservations (Admin / ChefProjet)
router.get('/', verifyToken, verifyRole(['Admin','ChefProjet']), reservationController.getReservations);

// Récupérer une réservation par ID
router.get('/:id', verifyToken, reservationController.getReservationById);

// Modifier une réservation (propriétaire ou manager)
router.put('/:id', verifyToken, verifyReservationOwner, reservationController.updateReservation);

// Supprimer une réservation (propriétaire ou manager)
router.delete('/:id', verifyToken, verifyReservationOwner, reservationController.deleteReservation);

module.exports = router;