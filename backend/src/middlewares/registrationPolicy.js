// backend/src/middlewares/registrationPolicy.js
module.exports = function registrationPolicy(req, res, next) {
  try {
    const { email, role } = req.body || {};

    if (!email || !email.endsWith('@immoavenue.tn')) {
      return res.status(400).json({ message: "Email doit se terminer par @immoavenue.tn" });
    }

    // Public register can ONLY create Client or Employe
    if (!['Client', 'Employe'].includes(role)) {
      return res
        .status(403)
        .json({ message: "Inscription publique limitée aux rôles Client ou Employe" });
    }

    next();
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
