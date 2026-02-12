const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'users route ok' }));

module.exports = router;
