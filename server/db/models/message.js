const Sequelize = require("sequelize");
const db = require("../db");
const { Op } = require("sequelize");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

Message.findMessage = async function (messageId) {
  const message = await Message.findOne({
    where: {
      id: messageId,
    },
  });

  // return messsage or null if it doesn't exist
  return message;
};

Message.updateIsRead = async function (message, isRead) {
  await Message.update(
    { isRead },
    {
      where: {
        [Op.and]: [
          {
            id: {
              [Op.lte]: message.id,
            },
          },
          {
            senderId: message.senderId,
          },
          {
            conversationId: message.conversationId,
          },
        ],
      },
    }
  );
};

module.exports = Message;
