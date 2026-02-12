const express = require('express');
const { Task } = require('../models');

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
    const tasks = await Task.findAll({ order: [['createdAt', 'DESC']] });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des taches.' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const { id, title, projectId, status, dueDate } = req.body;
    if (!id || !title) {
      return res.status(400).json({ error: 'id et title sont requis.' });
    }
    const task = await Task.create({
      id,
      title,
      projectId: projectId || null,
      status: status || 'todo',
      dueDate: dueDate || null
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de creation de la tache.' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { title, projectId, status, dueDate } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tache introuvable.' });
    await task.update({
      title,
      projectId: projectId || null,
      status,
      dueDate: dueDate || null
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise a jour de la tache.' });
  }
});

router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tache introuvable.' });
    await task.update({ status });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise a jour du statut.' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tache introuvable.' });
    await task.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de suppression de la tache.' });
  }
});

module.exports = router;
