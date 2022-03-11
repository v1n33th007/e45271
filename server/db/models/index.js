const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const ConversationUsers = require("./conversationUsers");
const ReadReceipt = require("./readReceipt");

// associations

Message.belongsTo(Conversation);
Conversation.hasMany(Message);
Conversation.belongsToMany(User, {
  through: ConversationUsers,
});
Message.belongsToMany(User, {
  through: ReadReceipt,
});

module.exports = {
  User,
  Conversation,
  Message,
};
