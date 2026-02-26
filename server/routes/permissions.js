const express = require('express');
const { Permission } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [['label', 'ASC']]
    });
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des permissions.' });
  }
});

module.exports = router;
