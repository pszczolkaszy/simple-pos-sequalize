const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'MySqlPass', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
