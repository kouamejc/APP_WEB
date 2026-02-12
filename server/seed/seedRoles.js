const { Role, Permission, RolePermission, AppUser } = require('../models');

const createId = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const roles = [
  {
    id: 'chef_projet',
    name: 'Chef de projet / Manager',
    category: 'Pilotage',
    description: 'Pilotage des projets et coordination des equipes.',
    responsibilities: [
      'Cree et gere les projets',
      'Attribue et supervise les taches',
      'Consulte les rapports d\'avancement',
      'Organise les equipes',
      'Planifie via le calendrier',
      'Pilote via le tableau de bord global'
    ]
  },
  {
    id: 'collaborateur',
    name: "Membre de l'equipe / Collaborateur",
    category: 'Execution',
    description: 'Execution des taches et contribution au projet.',
    responsibilities: [
      'Consulte ses taches assignees',
      'Met a jour le statut des taches',
      'Participe aux discussions',
      'Recoit et consulte les notifications',
      'Visualise le calendrier de ses activites',
      'Accede a son tableau de bord personnel'
    ]
  },
  {
    id: 'administrateur',
    name: 'Administrateur',
    category: 'Gouvernance',
    description: 'Supervision globale et administration des acces.',
    responsibilities: [
      'Gere les equipes (creation, modification, suppression)',
      'Configure les droits d\'acces aux projets',
      'Supervise l\'ensemble des activites',
      'Genere des rapports globaux',
      'Administre les notifications systeme'
    ]
  },
  {
    id: 'client',
    name: 'Client / Partie prenante externe',
    category: 'Lecture seule',
    description: 'Consultation des informations en lecture seule.',
    responsibilities: [
      'Consulte l\'avancement des projets (lecture seule)',
      'Accede aux rapports qui le concernent',
      'Participe a certaines discussions specifiques'
    ]
  },
  {
    id: 'observateur',
    name: 'Observateur / Auditeur',
    category: 'Controle',
    description: 'Audit et controle sans modification.',
    responsibilities: [
      'Visualise les rapports',
      'Consulte le tableau de bord sans pouvoir modifier'
    ]
  }
];

const permissions = [
  { id: 'projects.manage', key: 'projects.manage', label: 'Gerer les projets' },
  { id: 'tasks.assign', key: 'tasks.assign', label: 'Attribuer les taches' },
  { id: 'reports.view', key: 'reports.view', label: 'Consulter les rapports' },
  { id: 'teams.manage', key: 'teams.manage', label: 'Gerer les equipes' },
  { id: 'calendar.plan', key: 'calendar.plan', label: 'Planifier le calendrier' },
  { id: 'dashboard.global', key: 'dashboard.global', label: 'Piloter le tableau de bord global' },
  { id: 'tasks.view_own', key: 'tasks.view_own', label: 'Consulter ses taches' },
  { id: 'tasks.update_status', key: 'tasks.update_status', label: 'Mettre a jour le statut' },
  { id: 'discussions.participate', key: 'discussions.participate', label: 'Participer aux discussions' },
  { id: 'notifications.view', key: 'notifications.view', label: 'Consulter les notifications' },
  { id: 'calendar.view', key: 'calendar.view', label: 'Visualiser le calendrier' },
  { id: 'dashboard.personal', key: 'dashboard.personal', label: 'Tableau de bord personnel' },
  { id: 'projects.view', key: 'projects.view', label: 'Consulter l\'avancement des projets' },
  { id: 'reports.view_own', key: 'reports.view_own', label: 'Consulter ses rapports' },
  { id: 'discussions.limited', key: 'discussions.limited', label: 'Discussions specifique' },
  { id: 'activities.supervise', key: 'activities.supervise', label: 'Superviser les activites' },
  { id: 'reports.generate', key: 'reports.generate', label: 'Generer les rapports globaux' },
  { id: 'notifications.admin', key: 'notifications.admin', label: 'Administrer les notifications systeme' },
  { id: 'access.manage', key: 'access.manage', label: 'Configurer les droits d\'acces' },
  { id: 'dashboard.readonly', key: 'dashboard.readonly', label: 'Tableau de bord en lecture seule' }
];

const rolePermissions = {
  chef_projet: [
    'projects.manage',
    'tasks.assign',
    'reports.view',
    'teams.manage',
    'calendar.plan',
    'dashboard.global'
  ],
  collaborateur: [
    'tasks.view_own',
    'tasks.update_status',
    'discussions.participate',
    'notifications.view',
    'calendar.view',
    'dashboard.personal'
  ],
  administrateur: [
    'projects.manage',
    'tasks.assign',
    'reports.view',
    'teams.manage',
    'calendar.plan',
    'dashboard.global',
    'activities.supervise',
    'reports.generate',
    'notifications.admin',
    'access.manage'
  ],
  client: [
    'projects.view',
    'reports.view_own',
    'discussions.limited'
  ],
  observateur: [
    'reports.view',
    'dashboard.readonly'
  ]
};

const ensureRolePermissions = async () => {
  for (const role of roles) {
    await Role.upsert({
      id: role.id,
      name: role.name,
      category: role.category,
      description: role.description,
      responsibilities: JSON.stringify(role.responsibilities)
    });
  }

  for (const permission of permissions) {
    await Permission.upsert(permission);
  }

  for (const [roleId, permKeys] of Object.entries(rolePermissions)) {
    for (const permissionId of permKeys) {
      await RolePermission.findOrCreate({
        where: { roleId, permissionId },
        defaults: { roleId, permissionId }
      });
    }
  }
};

const ensureAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'kouameprunelle@gmail.com';
  const adminPhone = process.env.ADMIN_PHONE || '0711093358';
  const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const adminLastName = process.env.ADMIN_LAST_NAME || 'Principal';
  const adminCity = process.env.ADMIN_CITY || 'Abidjan';

  const existing = await AppUser.findOne({
    where: { email: adminEmail }
  });
  const existingByPhone = existing
    ? null
    : await AppUser.findOne({ where: { phone: adminPhone } });
  const target = existing || existingByPhone;
  if (!target) {
    await AppUser.create({
      id: createId(),
      firstName: adminFirstName,
      lastName: adminLastName,
      email: adminEmail,
      phone: adminPhone,
      city: adminCity,
      role: 'administrateur'
    });
    return;
  }
  await target.update({
    firstName: adminFirstName,
    lastName: adminLastName,
    email: adminEmail,
    phone: adminPhone,
    city: adminCity,
    role: 'administrateur'
  });
};

const seedRolesAndAdmin = async () => {
  await ensureRolePermissions();
  await ensureAdminUser();
};

module.exports = { seedRolesAndAdmin };
