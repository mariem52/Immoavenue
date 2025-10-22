const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  typeLogement: { type: String, required: true }, // Appartement, Maison, Studio, Villa
  status: { type: String, default: "Disponible" }, // Disponible, Vendu, Réservé
  image: { type: String }, // Base64 ou URL string
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema);
