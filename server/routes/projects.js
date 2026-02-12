const express = require('express');
const { Project, Task } = require('../models');

const router = express.Router();

const requireAdmin = (req, res, next) => {
  const raw = `${req.header('x-user-role') || ''}`.toLowerCase();
  const role = raw === 'admin' ? 'administrateur' : raw;
  if (role !== 'administrateur') {
    return res.status(403).json({ error: "Acces reserve a l'administrateur." });
  }
  return next();
};

router.get('/', async (req, res) => {
  try {
    const projects = await Project.findAll({ order: [['createdAt', 'DESC']] });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des projets.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { id, name, description } = req.body;
    if (!id || !name) {
      return res.status(400).json({ error: 'id et name sont requis.' });
    }
    const project = await Project.create({ id, name, description });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de creation du projet.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Projet introuvable.' });
    await project.update({ name, description });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise a jour du projet.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Projet introuvable.' });
    await Task.destroy({ where: { projectId: project.id } });
    await project.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de suppression du projet.' });
  }
});

module.exports = router;
