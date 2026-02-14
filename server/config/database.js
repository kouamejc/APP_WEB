const { Sequelize } = require('sequelize');

const useSsl = `${process.env.DB_SSL || ''}`.toLowerCase() === 'true';
const rejectUnauthorized =
  `${process.env.DB_SSL_REJECT_UNAUTHORIZED || ''}`.toLowerCase() !== 'false';
const sslConfig = useSsl
  ? {
      rejectUnauthorized,
      ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA } : {})
    }
  : undefined;

const sequelize = new Sequelize(
  process.env.DB_NAME || 'taskflow',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
    ...(sslConfig ? { dialectOptions: { ssl: sslConfig } } : {})
  }
);

module.exports = { sequelize };
