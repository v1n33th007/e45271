const Sequelize = require("sequelize");
const db = require("../db");

const Group = db.define("group", {
  groupName: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false,
  },
  groupDescription: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true,
  },
});

module.exports = Group;
