module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Discussion',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: 'discussions'
    }
  );
