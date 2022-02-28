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

export function getSortedMessages(conversations) {
  return conversations.map((conversation) => {
    const { messages } = conversation;
    const sortedMessages = messages.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    return { ...conversation, messages: sortedMessages };
  });
}
