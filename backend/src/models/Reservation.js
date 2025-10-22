const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  status: { type: String, enum: ['En attente','Confirmée','Annulée', 'Refusée', 'Terminée'], default: 'En attente' }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);