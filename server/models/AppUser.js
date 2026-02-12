module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'AppUser',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'collaborateur'
      }
    },
    {
      tableName: 'utilisateurs'
    }
  );
