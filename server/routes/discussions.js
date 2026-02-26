const express = require('express');
const { Discussion, Message } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { taskId } = req.query;
    const where = {};
    if (taskId) where.taskId = taskId;
    const discussions = await Discussion.findAll({
      where,
      include: [{ model: Message, as: 'messages' }],
      order: [['createdAt', 'DESC'], [{ model: Message, as: 'messages' }, 'createdAt', 'ASC']]
    });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des discussions.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, title, message, taskId, author } = req.body;
    if (!id || !title || !message) {
      return res.status(400).json({ error: 'id, title et message sont requis.' });
    }
    const discussion = await Discussion.create({ id, title, taskId: taskId || null });
    await Message.create({
      id: `${id}-m1`,
      discussionId: discussion.id,
      author: author || 'Vous',
      body: message
    });
    const full = await Discussion.findByPk(discussion.id, {
      include: [{ model: Message, as: 'messages' }]
    });
    res.status(201).json(full);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de creation de la discussion.' });
  }
});

router.post('/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const { messageId, author, body } = req.body;
    if (!body) return res.status(400).json({ error: 'body est requis.' });
    const discussion = await Discussion.findByPk(id);
    if (!discussion) return res.status(404).json({ error: 'Discussion introuvable.' });
    const msg = await Message.create({
      id: messageId || `${id}-${Date.now()}`,
      discussionId: id,
      author: author || 'Vous',
      body
    });
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de creation du message.' });
  }
});

module.exports = router;
