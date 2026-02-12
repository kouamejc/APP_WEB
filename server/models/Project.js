module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Project',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'projets'
    }
  );
