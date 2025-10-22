const User = require('../models/User');

// Liste des employés (Employé + ChefProjet)
exports.listEmployees = async (req, res) => {
  try {
    let q = {};
    if (req.query.role) {
      q.role = req.query.role; // ex: Employe ou ChefProjet
    } else {
      q.role = { $in: ["Employe", "ChefProjet"] };
    }
    if (req.query.search) {
      q.$or = [
        { nom: new RegExp(req.query.search, 'i') },
        { prenom: new RegExp(req.query.search, 'i') },
        { email: new RegExp(req.query.search, 'i') },
      ];
    }
    const users = await User.find(q).select('-motDePasse');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Créer un employé (ADMIN)
exports.createEmployee = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse } = req.body;
    if (!email.endsWith("@immoavenue.tn")) {
      return res.status(400).json({ message: "Email doit se terminer par @immoavenue.tn" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });

    const user = new User({ nom, prenom, email, motDePasse, role: 'Employe' });
    await user.save();
    res.status(201).json({ _id: user._id, nom, prenom, email, role: user.role });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Créer un chef projet (ADMIN uniquement)
exports.createChefProjet = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse } = req.body;
    if (!email.endsWith("@immoavenue.tn")) {
      return res.status(400).json({ message: "Email doit se terminer par @immoavenue.tn" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email déjà utilisé' });

    const user = new User({ nom, prenom, email, motDePasse, role: 'ChefProjet' });
    await user.save();
    res.status(201).json({ _id: user._id, nom, prenom, email, role: user.role });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// get / update / delete (idem ton code mais appliqué aux deux rôles si besoin)
exports.getEmployeeById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: { $in: ["Employe", "ChefProjet"] } }).select('-motDePasse');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse } = req.body;
    const user = await User.findOne({ _id: req.params.id, role: { $in: ["Employe", "ChefProjet"] } });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    if (nom) user.nom = nom;
    if (prenom) user.prenom = prenom;
    if (email) {
      if (!email.endsWith("@immoavenue.tn")) {
        return res.status(400).json({ message: "Email doit se terminer par @immoavenue.tn" });
      }
      user.email = email;
    }
    if (motDePasse) user.motDePasse = motDePasse;
    await user.save();

    res.json({ _id: user._id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.params.id, role: { $in: ["Employe", "ChefProjet"] } });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
