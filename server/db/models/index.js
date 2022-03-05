const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const Group = require("./group");
const GroupUsers = require("./groupUsers");
const ReadReceipts = require("./readReceipts");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Group.hasOne(Conversation);
User.hasMany(GroupUsers);
Group.hasMany(GroupUsers);
User.hasMany(ReadReceipts);
Message.hasMany(ReadReceipts);

module.exports = {
  User,
  Conversation,
  Message,
};
