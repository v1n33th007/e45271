import React, { useCallback, useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Grid, CssBaseline, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SidebarContainer } from '../components/Sidebar';
import { ActiveChat } from '../components/ActiveChat';
import { SocketContext } from '../context/socket';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
}));

const Home = ({ user, logout }) => {
  const history = useHistory();

  const socket = useContext(SocketContext);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addSearchedUsers = (users) => {
    const currentUsers = {};

    // make table of current users so we can lookup faster
    conversations.forEach((convo) => {
      currentUsers[convo.otherUser.id] = true;
    });

    const newState = [...conversations];
    users.forEach((user) => {
      // only create a fake convo if we don't already have a convo with this user
      if (!currentUsers[user.id]) {
        let fakeConvo = { otherUser: user, messages: [] };
        newState.push(fakeConvo);
      }
    });

    setConversations(newState);
  };

  const clearSearchedUsers = () => {
    setConversations((prev) => prev.filter((convo) => convo.id));
  };

  const saveMessage = async (body) => {
    const { data } = await axios.post('/api/messages', body);
    return data;
  };

  const saveReadStatus = async (body) => {
    const { data } = await axios.post('/api/messages/updateReadStatus', body);
    return data;
  };

  const sendMessage = (data, body) => {
    socket.emit('new-message', {
      message: data.message,
      recipientId: body.recipientId,
      sender: data.sender,
    });
  };

  const postMessage = async (body) => {
    try {
      const data = await saveMessage(body);
      if (!body.conversationId) {
        addNewConvo(body.recipientId, data.message);
      } else {
        addMessageToConversation(data);
      }
      sendMessage(data, body);
    } catch (error) {
      console.error(error);
    }
  };

  const sendReadReceipt = (data) => {
    socket.emit('read-receipt', data);
  };

  const addLastReadMessageAndCount = useCallback((conversations) => {
    return (conversations ?? []).map((conversation) => {
      const { messages, otherUser } = conversation;
      const lastReadMessage = messages.findLast((message) => {
        return message.senderId === otherUser.id && message.readAt;
      });
      const lastReadMessageByOtherUser = messages.findLast((message) => {
        return message.senderId !== otherUser.id && message.readAt;
      });
      return {
        ...conversation,
        lastReadMessage,
        lastReadMessageByOtherUser,
        unreadMessages: messages.filter(
          (message) => message.senderId === otherUser.id && !message.readAt
        ).length,
      };
    });
  }, []);

  const updateConversationsWithReadMessageData = useCallback(
    (conversations, conversationId, messageId, readAt, userId) => {
      return conversations.map((convo) => {
        if (convo.id === conversationId) {
          const newMessages = (convo.messages ?? []).map((message) => {
            if (
              message.id <= messageId &&
              !message.readAt &&
              message.senderId === (userId ?? 0)
            ) {
              return { ...message, readAt };
            } else {
              return message;
            }
          });
          return { ...convo, messages: newMessages };
        } else {
          return convo;
        }
      });
    },
    []
  );

  const postReadStatus = async (body) => {
    try {
      const { conversationId, readAt, messageId, userId } =
        await saveReadStatus(body);
      const newConversations = updateConversationsWithReadMessageData(
        conversations,
        conversationId,
        messageId,
        readAt,
        userId
      );
      const lastReadAndMesssageCountData =
        addLastReadMessageAndCount(newConversations);
      setConversations(lastReadAndMesssageCountData);
      sendReadReceipt({
        conversationId,
        readAt,
        messageId,
        userId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addNewConvo = useCallback(
    (recipientId, message) => {
      const newConversations = conversations.map((convo) => {
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
      setConversations(newConversations);
    },
    [setConversations, conversations]
  );

  const addMessageToConversation = useCallback(
    (data) => {
      // if sender isn't null, that means the message needs to be put in a brand new convo
      const { message, sender = null } = data;
      if (sender !== null) {
        const newConvo = {
          id: message.conversationId,
          otherUser: sender,
          messages: [message],
        };
        newConvo.latestMessageText = message.text;
        setConversations((prev) => [newConvo, ...prev]);
        return;
      }

      const newConversationList = conversations.map((convo) => {
        if (convo.id === message.conversationId) {
          const newConvo = { ...convo };
          newConvo.messages = [...convo.messages, message];
          newConvo.latestMessageText = message.text;
          return newConvo;
        } else {
          return convo;
        }
      });
      const conversationListUpdated =
        addLastReadMessageAndCount(newConversationList);
      setConversations(conversationListUpdated);
    },
    [setConversations, conversations, addLastReadMessageAndCount]
  );

  const setActiveChat = (username) => {
    setActiveConversation(username);
  };

  const addOnlineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  const removeOfflineUser = useCallback((id) => {
    setConversations((prev) =>
      prev.map((convo) => {
        if (convo.otherUser.id === id) {
          const convoCopy = { ...convo };
          convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
          return convoCopy;
        } else {
          return convo;
        }
      })
    );
  }, []);

  const updateReadReceiptDataFromSocket = useCallback(
    ({ conversationId, readAt, messageId, userId }) => {
      const newConversations = updateConversationsWithReadMessageData(
        conversations,
        conversationId,
        messageId,
        readAt,
        userId
      );
      const lastReadAndMesssageCountData =
        addLastReadMessageAndCount(newConversations);
      setConversations(lastReadAndMesssageCountData);
    },
    [
      addLastReadMessageAndCount,
      conversations,
      updateConversationsWithReadMessageData,
    ]
  );

  // Lifecycle

  useEffect(() => {
    // Socket init
    socket.on('add-online-user', addOnlineUser);
    socket.on('remove-offline-user', removeOfflineUser);
    socket.on('new-message', addMessageToConversation);
    socket.on('read-receipt', updateReadReceiptDataFromSocket);

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off('add-online-user', addOnlineUser);
      socket.off('remove-offline-user', removeOfflineUser);
      socket.off('new-message', addMessageToConversation);
      socket.off('read-receipt', updateReadReceiptDataFromSocket);
    };
  }, [
    addMessageToConversation,
    addOnlineUser,
    removeOfflineUser,
    socket,
    updateReadReceiptDataFromSocket,
  ]);

  useEffect(() => {
    // when fetching, prevent redirect
    if (user?.isFetching) return;

    if (user && user.id) {
      setIsLoggedIn(true);
    } else {
      // If we were previously logged in, redirect to login instead of register
      if (isLoggedIn) history.push('/login');
      else history.push('/register');
    }
  }, [user, history, isLoggedIn]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/api/conversations');
        const sortedData = data.map((conversation) => {
          const { messages } = conversation;
          const sortedMessages = messages.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          return { ...conversation, messages: sortedMessages };
        });
        const lastReadAndMesssageCountData =
          addLastReadMessageAndCount(sortedData);
        setConversations(lastReadAndMesssageCountData);
      } catch (error) {
        console.error(error);
      }
    };
    if (!user.isFetching) {
      fetchConversations();
    }
  }, [user, addLastReadMessageAndCount]);

  const handleLogout = async () => {
    if (user && user.id) {
      await logout(user.id);
    }
  };

  return (
    <>
      <Button onClick={handleLogout}>Logout</Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer
          conversations={conversations}
          user={user}
          clearSearchedUsers={clearSearchedUsers}
          addSearchedUsers={addSearchedUsers}
          setActiveChat={setActiveChat}
        />
        <ActiveChat
          activeConversation={activeConversation}
          conversations={conversations}
          user={user}
          postMessage={postMessage}
          postReadStatus={postReadStatus}
        />
      </Grid>
    </>
  );
};

export default Home;
