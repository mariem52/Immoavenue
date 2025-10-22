// backend/src/routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
  deleteMessage,
    // ... vos fonctions existantes ...
  markMessagesAsRead,      // ← Ajouter
  getNewMessagesCount      // ← Ajouter
} = require("../controllers/messageController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");


// Envoyer un message (user connecté)
router.post("/", verifyToken, createMessage);


// Admin routes
router.get("/", verifyToken, verifyRole("Admin"), getMessages);
router.delete("/:id", verifyToken, verifyRole("Admin"), deleteMessage);

// Nouvelles routes
router.put('/mark-read', verifyToken, markMessagesAsRead);
router.get('/count/new', verifyToken, getNewMessagesCount);
module.exports = router;
