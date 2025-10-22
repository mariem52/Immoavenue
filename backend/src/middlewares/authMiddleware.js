// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Reservation = require('../models/Reservation');

exports.verifyToken = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    if (token.startsWith('Bearer ')) token = token.slice(7);

    // 1) Décoder d'abord le token (s'il est malformé, on catchera l'erreur)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2) Cas spécial admin: backend créé un token avec id = "admin"
    if (decoded && decoded.id === 'admin') {
      req.user = {
        _id: 'admin',
        email: process.env.ADMIN_EMAIL,
        nom: process.env.ADMIN_NOM,
        prenom: process.env.ADMIN_PRENOM,
        role: 'Admin',
      };
      return next();
    }

    // 3) Cas normal: chercher l'utilisateur en DB
    const user = await User.findById(decoded.id).select('-motDePasse');
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user;
    next();
  } catch (err) {
    // token invalide ou autre erreur
    console.error('authMiddleware verifyToken error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.verifyRole = (...allowed) => {
  if (Array.isArray(allowed[0])) allowed = allowed[0];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ message: 'Access denied' });
    next();
  };
};

exports.verifyReservationOwner = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Réservation introuvable' });

    const isOwner = reservation.userId.toString() === req.user._id.toString();
    const isManager = ['Admin', 'ChefProjet'].includes(req.user.role);

    if (!isOwner && !isManager) return res.status(403).json({ message: 'Accès refusé' });
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
