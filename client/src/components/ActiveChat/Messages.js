import React, { useEffect } from 'react';
import { Box } from '@material-ui/core';
import { SenderBubble, OtherUserBubble } from '.';
import moment from 'moment';

const Messages = (props) => {
  const {
    messages,
    otherUser,
    userId,
    lastReadMessage,
    postReadStatus,
    lastReadMessageByOtherUser,
  } = props;

  useEffect(() => {
    if (messages) {
      const lastUnreadMessage = messages.findLast((message) => {
        return (
          message.id > (lastReadMessage?.id ?? 0) &&
          message.senderId !== userId &&
          !message.readAt
        );
      });
      if (lastUnreadMessage) {
        postReadStatus({
          messageId: lastUnreadMessage.id,
          readAt: moment().format(),
        });
      }
    }
  }, [messages, lastReadMessage, postReadStatus, userId]);

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
