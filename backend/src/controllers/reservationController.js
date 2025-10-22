// backend/src/controllers/reservationController.js
const Reservation = require('../models/Reservation');

// Helper pour parser les dates
const parseDate = (d) => d ? new Date(d) : null;

exports.createReservation = async (req, res) => {
  try {
    const { propertyId, dateDebut, dateFin } = req.body;

    // Si dateDebut/dateFin non fournies, on met la date actuelle
    const start = parseDate(dateDebut) || new Date();
    const end = parseDate(dateFin) || new Date();

    if (!propertyId) return res.status(400).json({ message: 'propertyId est requis' });

    const reservation = new Reservation({
      propertyId,
      userId: req.user._id,
      dateDebut: start,
      dateFin: end,
      status: 'En attente'
    });

    await reservation.save();
    await reservation.populate([
      { path: 'propertyId' },
      { path: 'userId', select: 'nom prenom email' }
    ]);

    res.status(201).json(reservation);
  } catch (err) {
    console.error('createReservation error:', err);
    res.status(500).json({ message: 'Erreur serveur', detail: err.message });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('propertyId')
      .populate('userId', 'nom prenom email role')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    console.error('getReservations error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user._id })
      .populate('propertyId')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    console.error('getMyReservations error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('propertyId')
      .populate('userId', 'nom prenom email');
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dans exports.updateReservation, ajoutez cette validation
exports.updateReservation = async (req, res) => {
  try {
    const validStatuses = ['En attente', 'Confirmée', 'Annulée', 'Refusée', 'Terminée'];
    
    if (req.body.status && !validStatuses.includes(req.body.status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    // Le reste du code reste inchangé...
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });

    if (req.body.dateDebut) reservation.dateDebut = new Date(req.body.dateDebut);
    if (req.body.dateFin) reservation.dateFin = new Date(req.body.dateFin);
    if (req.body.status) reservation.status = req.body.status;

    await reservation.save();
    await reservation.populate([
      { path: 'propertyId' },
      { path: 'userId', select: 'nom prenom email' }
    ]);

    res.json(reservation);
  } catch (err) {
    console.error('updateReservation error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });

    await Reservation.findByIdAndDelete(reservation._id);
    res.json({ message: 'Réservation supprimée' });
  } catch (err) {
    console.error('deleteReservation error:', err);
    res.status(500).json({ message: err.message });
  }
};
