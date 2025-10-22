// src/models/favorisModel.js
const mongoose = require("mongoose");

const favorisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favoris", favorisSchema);
