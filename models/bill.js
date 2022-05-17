const Sequelize = require('sequelize');
const moment = require('moment');
moment.locale('pl'); 
const sequelize = require('../util/database');

const Bill = sequelize.define('bill', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  totalPrice: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('createdAt')).format(
        'H:mm DD.MM.YYYY',
      );
    },
  },
});

module.exports = Bill;
