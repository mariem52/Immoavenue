// src/controllers/favorisController.js
const Favoris = require('../models/Favoris');

// Create favorite
exports.createFavoris = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user._id;

    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    const exists = await Favoris.findOne({ userId, projectId });
    if (exists) return res.status(400).json({ message: "Ce projet est déjà en favoris" });

    const fav = await Favoris.create({ userId, projectId });
    const populated = await Favoris.findById(fav._id).populate('projectId').populate('userId', 'nom prenom email');
    res.status(201).json(populated);
  } catch (err) {
    console.error('createFavoris error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Delete favorite
exports.deleteFavoris = async (req, res) => {
  try {
    const fav = await Favoris.findById(req.params.id);
    if (!fav) return res.status(404).json({ message: "Favori non trouvé" });

    if (fav.userId.toString() !== req.user._id.toString() && !['Admin','ChefProjet'].includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    // Use findByIdAndDelete to be safe
    await Favoris.findByIdAndDelete(fav._id);

    res.json({ message: "Favori supprimé" });
  } catch (err) {
    console.error('deleteFavoris error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get favorites
exports.getFavoris = async (req, res) => {
  try {
    if (req.user.role === 'Client') {
      const list = await Favoris.find({ userId: req.user._id }).populate('projectId');
      return res.json(list);
    } else {
      const list = await Favoris.find().populate('projectId').populate('userId', 'nom prenom email');
      return res.json(list);
    }
  } catch (err) {
    console.error('getFavoris error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get by id
exports.getFavorisById = async (req, res) => {
  try {
    const fav = await Favoris.findById(req.params.id).populate('projectId').populate('userId', 'nom prenom email');
    if (!fav) return res.status(404).json({ message: "Favori non trouvé" });

    if (req.user.role === 'Client' && fav.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    res.json(fav);
  } catch (err) {
    console.error('getFavorisById error:', err);
    res.status(500).json({ message: err.message });
  }
};
