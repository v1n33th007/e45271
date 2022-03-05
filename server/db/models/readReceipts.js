const Sequelize = require("sequelize");
const db = require("../db");

const ReadReceipts = db.define("readReceipts", {
  isRead: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = ReadReceipts;
