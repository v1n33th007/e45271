import React from 'react';
import { Badge } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  badgeStyle: {
    marginRight: '20px',
  },
}));

const UnreadCount = ({ conversation }) => {
  const classes = useStyles();

  return (
    <Badge
      className={classes.badgeStyle}
      badgeContent={conversation.unreadMessagesCount}
      color="primary"
    />
  );
};

export default UnreadCount;
