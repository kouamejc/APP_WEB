require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const projectsRoutes = require('./routes/projects');
const tasksRoutes = require('./routes/tasks');
const discussionsRoutes = require('./routes/discussions');
const notificationsRoutes = require('./routes/notifications');
const teamsRoutes = require('./routes/teams');
const authRoutes = require('./routes/auth');
const { seedRolesAndAdmin } = require('./seed/seedRoles');

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.APP_URL ? [process.env.APP_URL] : true,
    allowedHeaders: ["Content-Type", "x-user-role"]
  })
);

app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/discussions', discussionsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/auth', authRoutes);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Serveur fonctionnel', timestamp: new Date() });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    const shouldAlter = process.env.DB_SYNC_ALTER === 'true';
    if (shouldAlter) {
      await sequelize.sync({ alter: true });
    } else {
      await sequelize.sync();
    }
    await seedRolesAndAdmin();
    console.log('✅ Connexion à la base de données établie');
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

startServer();
