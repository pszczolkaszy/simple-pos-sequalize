const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const BillItem = sequelize.define('billItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: Sequelize.INTEGER,
  },
});

module.exports = BillItem;
