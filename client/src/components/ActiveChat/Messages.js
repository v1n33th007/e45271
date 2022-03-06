import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const {
    messages,
    otherUser,
    userId,
    postReadStatus,
    lastReadMessageByOtherUser,
    lastUnreadMessage,
  } = props;

  useEffect(() => {
    if (lastUnreadMessage) {
      postReadStatus({
        messageId: lastUnreadMessage.id,
        isRead: true,
        conversationId: lastUnreadMessage.conversationId,
        senderId: lastUnreadMessage.senderId,
      });
    }
  }, [postReadStatus, lastUnreadMessage]);

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format('h:mm');

        return message.senderId === userId ? (
          <SenderBubble
            id={message.id}
            key={message.id}
            text={message.text}
            time={time}
            lastReadMessageByOtherUser={lastReadMessageByOtherUser}
            otherUser={otherUser}
          />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
