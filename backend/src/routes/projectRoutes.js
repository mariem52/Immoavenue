const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");

// Ajouter un projet
router.post("/", verifyToken, verifyRole("Admin", "ChefProjet"), projectController.createProject);

// Modifier un projet
router.put("/:id", verifyToken, verifyRole("Admin", "ChefProjet"), projectController.updateProject);

// Supprimer un projet
router.delete("/:id", verifyToken, verifyRole("Admin", "ChefProjet"), projectController.deleteProject);

// Consulter tous les projets
router.get("/", projectController.getAllProjects);

// Consulter un projet par ID
router.get("/:id", projectController.getProjectById);

module.exports = router;
