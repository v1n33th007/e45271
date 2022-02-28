export function getNewConversationListAfterAdd(
  conversations,
  recipientId,
  message
) {
  return conversations.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.messages = [...convo.messages, message];
      newConvo.latestMessageText = message.text;
      newConvo.id = message.conversationId;
      return newConvo;
    } else {
      return convo;
    }
  });
}

export function getUpdatedConversationListAfterAdd(conversations, data) {
  const { message, sender = null } = data;
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...conversations];
  }

  return conversations.map((convo) => {
    if (convo.id === message.conversationId) {
      const newConvo = { ...convo };
      newConvo.messages = [...convo.messages, message];
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
}

export function getSortedMessages(data) {
  return data.map((newData) => {
    const { messages } = newData;
    const sortedMessages = messages.sort((a, b) => {
      const date1 = new Date(a.createdAt);
      const date2 = new Date(b.createdAt);
      return date1 - date2;
    });
    return { ...newData, messages: sortedMessages };
  });
}
