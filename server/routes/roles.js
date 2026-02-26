const express = require('express');
const { Role, Permission, RolePermission } = require('../models');

const router = express.Router();

const normalizeResponsibilities = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

router.get('/', async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{ model: Permission, through: { attributes: [] } }],
      order: [['name', 'ASC']]
    });
    const payload = roles.map((role) => ({
      id: role.id,
      name: role.name,
      category: role.category,
      description: role.description,
      responsibilities: normalizeResponsibilities(role.responsibilities),
      permissions: role.Permissions || []
    }));
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: 'Erreur de lecture des roles.' });
  }
});

router.put('/:id/permissions', async (req, res) => {
  try {
    const { permissionIds } = req.body;
    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({ error: 'permissionIds est requis.' });
    }
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role introuvable.' });

    await RolePermission.destroy({ where: { roleId: role.id } });
    if (permissionIds.length > 0) {
      const rows = permissionIds.map((permissionId) => ({
        roleId: role.id,
        permissionId
      }));
      await RolePermission.bulkCreate(rows);
    }

    const updated = await Role.findByPk(role.id, {
      include: [{ model: Permission, through: { attributes: [] } }]
    });
    res.json({
      id: updated.id,
      name: updated.name,
      category: updated.category,
      description: updated.description,
      responsibilities: normalizeResponsibilities(updated.responsibilities),
      permissions: updated.Permissions || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de mise a jour des permissions.' });
  }
});

module.exports = router;
