module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Permission',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'permissions'
    }
  );
