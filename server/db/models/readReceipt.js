const db = require("../db");
const Sequelize = require("sequelize");

const ReadReceipt = db.define("readReceipt", {
  isRead: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = ReadReceipt;
