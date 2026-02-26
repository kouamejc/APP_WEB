const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = require('./Project')(sequelize, DataTypes);
const Task = require('./Task')(sequelize, DataTypes);
const Discussion = require('./Discussion')(sequelize, DataTypes);
const Message = require('./Message')(sequelize, DataTypes);
const Notification = require('./Notification')(sequelize, DataTypes);
const AppUser = require('./AppUser')(sequelize, DataTypes);
const Role = require('./Role')(sequelize, DataTypes);
const Permission = require('./Permission')(sequelize, DataTypes);
const RolePermission = require('./RolePermission')(sequelize, DataTypes);

Project.hasMany(Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

Task.hasMany(Discussion, { foreignKey: 'taskId', onDelete: 'CASCADE' });
Discussion.belongsTo(Task, { foreignKey: 'taskId' });

Discussion.hasMany(Message, {
  foreignKey: 'discussionId',
  as: 'messages',
  onDelete: 'CASCADE'
});
Message.belongsTo(Discussion, { foreignKey: 'discussionId' });

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'roleId',
  otherKey: 'permissionId'
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permissionId',
  otherKey: 'roleId'
});


module.exports = {
  sequelize,
  Project,
  Task,
  Discussion,
  Message,
  Notification,
  AppUser,
  Role,
  Permission,
  RolePermission
};
