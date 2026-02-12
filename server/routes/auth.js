const express = require('express');
const { AppUser } = require('../models');
const router = express.Router();

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

router.get('/', (req, res) => res.json({ message: 'auth route ok' }));

router.post('/register', async (req, res) => {
  try {
    const { id, nom, prenoms, email, telephone, ville } = req.body;
    if (!nom || !prenoms || !email || !telephone || !ville) {
      return res.status(400).json({ error: 'Champs requis manquants.' });
    }

    const emailExists = await AppUser.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({ error: 'Email deja utilise.' });
    }
    const phoneExists = await AppUser.findOne({ where: { phone: telephone } });
    if (phoneExists) {
      return res.status(409).json({ error: 'Telephone deja utilise.' });
    }

    const user = await AppUser.create({
      id: id || createId(),
      firstName: prenoms,
      lastName: nom,
      email,
      phone: telephone,
      city: ville,
      role: 'collaborateur'
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur inscription.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, telephone } = req.body;
    if (!email || !telephone) {
      return res.status(400).json({ error: 'Email et telephone requis.' });
    }
    const user = await AppUser.findOne({
      where: { email, phone: telephone }
    });
    if (!user) return res.status(401).json({ error: 'Identifiants invalides.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur connexion.' });
  }
});

module.exports = router;
