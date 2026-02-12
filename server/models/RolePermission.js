module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'RolePermission',
    {
      roleId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      permissionId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      }
    },
    {
      tableName: 'role_permissions'
    }
  );
