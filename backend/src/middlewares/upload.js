const multer = require("multer");
const path = require("path");

// Dossier de destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/projects");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Seulement les images sont autorisées"));
  }
};

const uploadImages = multer({ storage, fileFilter }).single("image"); // <-- juste une image

const handleUploadErrors = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

module.exports = { uploadImages, handleUploadErrors };
