// src/routes/favorisRoutes.js
const express = require("express");
const router = express.Router();
const favorisController = require("../controllers/favorisController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Ajouter un favori (client)
router.post("/", verifyToken, favorisController.createFavoris);

// Supprimer un favori (client)
router.delete("/:id", verifyToken, favorisController.deleteFavoris);

// Voir tous les favoris (admin ou client)
router.get("/", verifyToken, favorisController.getFavoris);

// Voir un favori par ID
router.get("/:id", verifyToken, favorisController.getFavorisById);

module.exports = router;
