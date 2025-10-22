const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  role: { type: String, required: true },
  isVerified: { type: Boolean, default: false }, // ✅ ajout
  dateInscription: { type: Date, default: Date.now }
});

// Vérifier le mot de passe
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.motDePasse);
};

// Hasher avant save
userSchema.pre("save", async function (next) {
  if (!this.isModified("motDePasse")) return next();
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
