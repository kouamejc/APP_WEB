module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Message',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      discussionId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      author: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Vous'
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      tableName: 'messages'
    }
  );
