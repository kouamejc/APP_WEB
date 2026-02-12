module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Notification',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'info'
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      tableName: 'notifications'
    }
  );
