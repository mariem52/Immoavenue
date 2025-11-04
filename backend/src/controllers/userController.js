const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ✅ Générer token JWT normal
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ Générer token email pour vérification
const generateEmailToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// ✅ Transporter email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Envoyer un mail de vérification
const sendVerificationEmail = async (user, token) => {
  const url = `${process.env.FRONTEND_URL}/verify/${token}`;
  await transporter.sendMail({
    from: `"Immo Avenue" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Vérifiez votre compte",
    html: `<p>Bonjour ${user.nom},</p>
           <p>Merci de créer un compte. Cliquez ici pour vérifier :</p>
           <a href="${url}">${url}</a>`,
  });
};

// 📌 REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role } = req.body;

    if (email === process.env.ADMIN_EMAIL) {
      return res.status(400).json({ message: "Admin déjà défini dans .env" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

    const user = await User.create({ nom, prenom, email, motDePasse, role });
    const token = generateEmailToken(user._id);
    await sendVerificationEmail(user, token);

    res.status(201).json({ message: "Utilisateur créé. Vérifiez votre email pour activer le compte." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 VERIFY EMAIL
exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "Compte vérifié avec succès ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    if (email === process.env.ADMIN_EMAIL) {
      if (motDePasse !== process.env.ADMIN_PASSWORD) {
        return res.status(400).json({ message: "Mot de passe incorrect (admin)" });
      }
      return res.json({
        token: generateToken("admin"),
        _id: "admin",
        nom: process.env.ADMIN_NOM,
        prenom: process.env.ADMIN_PRENOM,
        email,
        role: "Admin",
      });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const match = await user.matchPassword(motDePasse);
    if (!match) return res.status(400).json({ message: "Mot de passe incorrect" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Veuillez vérifier votre email avant de vous connecter." });
    }

    res.json({
      token: generateToken(user._id),
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Liste users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select("-motDePasse");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json({ message: "Utilisateur supprimé ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Editer profil
exports.updateProfile = async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) user.email = email;

    await user.save();
    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Changer mot de passe (⚠️ on ne touche pas !)
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const match = await user.matchPassword(oldPassword);
    if (!match) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    user.motDePasse = newPassword; // sera hashé par le pre-save hook
    await user.save();

    res.json({ message: "Mot de passe modifié avec succès ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Mot de passe oublié → envoi d’un mail avec token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Génère un token valable 15 min
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"Immo Avenue" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Réinitialisation du mot de passe",
      html: `
        <p>Bonjour ${user.nom || ""},</p>
        <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>⚠️ Ce lien expire dans 15 minutes.</p>
      `,
    });

    res.json({ message: "Lien de réinitialisation envoyé ✅" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 📌 Réinitialisation du mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // 🚀 Pas de bcrypt.hash ici → le pre-save hook s'en occupe
    user.motDePasse = newPassword;
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès ✅" });
  } catch (err) {
    res.status(500).json({ message: "Lien invalide ou expiré ❌", error: err.message });
  }
};

// Marquer les utilisateurs comme lus
exports.markUsersAsRead = async (req, res) => {
  try {
    // Ici vous devriez implémenter la logique pour marquer les utilisateurs comme lus
    // Pour l'instant, on retourne juste un succès
    res.json({ message: "Users marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer le comptage des nouveaux utilisateurs
exports.getNewUsersCount = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    // Implémentez votre logique pour les nouveaux utilisateurs
    res.json({ total: totalUsers, new: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Update user (Admin)
exports.updateUser = async (req, res) => {
  try {
    const { nom, prenom, email, role } = req.body;
    const userId = req.params.id;

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ message: "Cet email est déjà utilisé par un autre utilisateur" });
      }
    }

    // Mettre à jour les champs
    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    // Retourner l'utilisateur mis à jour sans le mot de passe
    const updatedUser = await User.findById(userId).select("-motDePasse");
    
    res.json({
      message: "Utilisateur mis à jour avec succès ✅",
      user: updatedUser
    });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour", error: err.message });
  }
};

// 🔹 EXPORT token pour authRoutes
exports.generateToken = generateToken;
