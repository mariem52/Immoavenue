const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Redirection vers Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback après login Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const user = req.user;

      // Génère un token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

      // Redirection vers frontend avec TOUTES les infos nécessaires
      const params = new URLSearchParams({
        token,
        role: user.role || "Client",
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email,
        userId: user._id.toString(),
      });

      res.redirect(`${process.env.FRONTEND_URL}/google-success?${params.toString()}`);
    } catch (err) {
      console.error(err);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=google`);
    }
  }
);

module.exports = router;
