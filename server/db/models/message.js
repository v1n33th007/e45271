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
  readAt: {
    type: Sequelize.DATE,
    allowNull: true,
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

Message.updateReadAt = async function (message, readAt) {
  await Message.update(
    { readAt },
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
