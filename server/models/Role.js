module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      responsibilities: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tableName: 'roles'
    }
  );
