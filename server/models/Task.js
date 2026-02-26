module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      projectId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      assignedTo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      assignedToName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'todo'
      },
      dueDate: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'taches'
    }
  );
