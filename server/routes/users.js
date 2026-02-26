const express = require('express');
const { AppUser } = require('../models');

const router = express.Router();

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

router.get('/', async (req, res) => {
  try {
    const users = await AppUser.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des utilisateurs.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, firstName, lastName, email, phone, city, role } = req.body;
    if (!firstName || !lastName || !email || !phone || !city) {
      return res.status(400).json({ error: 'Champs requis manquants.' });
    }
    const emailExists = await AppUser.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({ error: 'Email deja utilise.' });
    }
    const phoneExists = await AppUser.findOne({ where: { phone } });
    if (phoneExists) {
      return res.status(409).json({ error: 'Telephone deja utilise.' });
    }
    const user = await AppUser.create({
      id: id || createId(),
      firstName,
      lastName,
      email,
      phone,
      city,
      role: role || 'collaborateur'
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur de creation de l'utilisateur." });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, city, role } = req.body;
    const user = await AppUser.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    if (email && email !== user.email) {
      const emailExists = await AppUser.findOne({ where: { email } });
      if (emailExists) {
        return res.status(409).json({ error: 'Email deja utilise.' });
      }
    }
    if (phone && phone !== user.phone) {
      const phoneExists = await AppUser.findOne({ where: { phone } });
      if (phoneExists) {
        return res.status(409).json({ error: 'Telephone deja utilise.' });
      }
    }

    await user.update({
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      email: email ?? user.email,
      phone: phone ?? user.phone,
      city: city ?? user.city,
      role: role ?? user.role
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur de mise a jour de l'utilisateur." });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await AppUser.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    await user.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erreur de suppression de l'utilisateur." });
  }
});

module.exports = router;
