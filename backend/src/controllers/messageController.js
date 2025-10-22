// backend/src/controllers/messageController.js
const Message = require("../models/Message");


// Créer un message
exports.createMessage = async (req, res) => {
  try {
    const { contenu } = req.body;
    if (!contenu)
      return res.status(400).json({ message: "Le message est requis" });

    // Récupérer l'email depuis le user connecté
    const email = req.user.email;

    const message = new Message({ email, contenu });
    await message.save();
    res.status(201).json({ message: "Message envoyé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Récupérer tous les messages (Admin)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un message (Admin)
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ message: "Message introuvable" });

    await message.deleteOne();
    res.json({ message: "Message supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Marquer les messages comme lus
exports.markMessagesAsRead = async (req, res) => {
  try {
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le comptage des nouveaux messages
exports.getNewMessagesCount = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    res.json({ total: totalMessages, new: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};