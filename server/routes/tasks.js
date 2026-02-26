const express = require('express');
const { Task } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { assignedTo, projectId } = req.query;
    const where = {};
    if (assignedTo) where.assignedTo = assignedTo;
    if (projectId) where.projectId = projectId;
    const tasks = await Task.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des taches.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      projectId,
      status,
      dueDate,
      assignedTo,
      assignedToName
    } = req.body;
    if (!id || !title) {
      return res.status(400).json({ error: 'id et title sont requis.' });
    }
    const task = await Task.create({
      id,
      title,
      description: description || null,
      projectId: projectId || null,
      assignedTo: assignedTo || null,
      assignedToName: assignedToName || null,
      status: status || 'todo',
      dueDate: dueDate || null
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de creation de la tache.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      projectId,
      status,
      dueDate,
      assignedTo,
      assignedToName
    } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tache introuvable.' });
    if ('title' in req.body && !title) {
      return res.status(400).json({ error: 'title est requis.' });
    }
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description || null;
    if (projectId !== undefined) updates.projectId = projectId || null;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo || null;
    if (assignedToName !== undefined) updates.assignedToName = assignedToName || null;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) updates.dueDate = dueDate || null;
    await task.update(updates);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise a jour de la tache.' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'status est requis.' });
    }
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Tache introuvable.' });
    await task.update({ status });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise a jour du statut.' });
  }
});

router.delete('/:id', async (req, res) => {
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
