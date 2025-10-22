const Project = require("../models/Project");

// Créer un projet
exports.createProject = async (req, res) => {
  try {
    const { title, description, price, city, address, typeLogement, status, image } = req.body;

    if (!title || !price || !city || !address || !typeLogement) {
      return res.status(400).json({ message: "Tous les champs obligatoires ne sont pas remplis." });
    }

    const newProject = new Project({
      title,
      description,
      price,
      city,
      address,
      typeLogement,
      status: status || "Disponible",
      image: image || "", // string image
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (err) {
    console.error("createProject error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la création du projet." });
  }
};

// Récupérer tous les projets
exports.getAllProjects = async (req, res) => {
  try {
    const filters = {};
    const { city, typeLogement, status, minPrice, maxPrice } = req.query;

    if (city) filters.city = { $regex: city, $options: "i" };
    if (typeLogement) filters.typeLogement = typeLogement;
    if (status) filters.status = status;
    if (minPrice) filters.price = { ...filters.price, $gte: Number(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };

    const projects = await Project.find(filters);
    res.json(projects);
  } catch (err) {
    console.error("getAllProjects error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des projets." });
  }
};

// Récupérer un projet par ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé." });
    res.json(project);
  } catch (err) {
    console.error("getProjectById error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du projet." });
  }
};

// Mettre à jour un projet
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé." });

    const { title, description, price, city, address, typeLogement, status, image } = req.body;

    project.title = title || project.title;
    project.description = description || project.description;
    project.price = price || project.price;
    project.city = city || project.city;
    project.address = address || project.address;
    project.typeLogement = typeLogement || project.typeLogement;
    project.status = status || project.status;
    project.image = image || project.image;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error("updateProject error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du projet." });
  }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Projet non trouvé." });

    await project.deleteOne();
    res.json({ message: "Projet supprimé avec succès." });
  } catch (err) {
    console.error("deleteProject error:", err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression du projet." });
  }
};
