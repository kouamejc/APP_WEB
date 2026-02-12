const express = require('express');
const { Notification } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des notifications.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, title, body, type, read } = req.body;
    if (!id || !title) {
      return res.status(400).json({ error: 'id et title sont requis.' });
    }
    const notification = await Notification.create({
      id,
      title,
      body: body || '',
      type: type || 'info',
      read: !!read
    });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de creation de la notification.' });
  }
});

router.patch('/mark-all-read', async (req, res) => {
  try {
    await Notification.update({ read: true }, { where: {} });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise a jour des notifications.' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { read } = req.body;
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification introuvable.' });
    }
    await notification.update({ read: !!read });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise a jour de la notification.' });
  }
});

module.exports = router;
