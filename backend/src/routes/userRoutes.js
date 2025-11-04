const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  listUsers,
  deleteUser,
  verifyUser,
  updateProfile,
  updateUser, 
  changePassword,
  forgotPassword,
  resetPassword,
  markUsersAsRead,      // ← Ajouter cette fonction
  getNewUsersCount      // ← Ajouter cette fonction
} = require("../controllers/userController");
const { verifyToken } = require("../middlewares/authMiddleware");

// Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyUser);

// Profile management
router.put("/edit", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);

// Users (Admin)
router.get("/", verifyToken, listUsers);
router.delete("/:id", verifyToken, deleteUser);
router.put("/:id", verifyToken, updateUser);
// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ CORRECTION : Utiliser les fonctions importées directement
router.put('/mark-read', verifyToken, markUsersAsRead);
router.get('/count/new', verifyToken, getNewUsersCount);

module.exports = router;