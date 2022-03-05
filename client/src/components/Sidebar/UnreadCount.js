import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  boxStyle: {
    marginRight: '20px',
  },
  unreadCount: {
    fontSize: '10px',
    color: '#FFFFFF',
    letterSpacing: -0.17,
    backgroundColor: '#3F92FF',
    borderRadius: '10px',
    padding: '3px 7px',
    fontWeight: 'bold',
  },
}));

const UnreadCount = ({ conversation }) => {
  const classes = useStyles();
  const { unreadMessagesCount } = conversation;

  if (!unreadMessagesCount) return null;

  return (
    <Box className={classes.boxStyle}>
      <Typography className={classes.unreadCount}>
        {unreadMessagesCount}
      </Typography>
    </Box>
  );
};

export default UnreadCount;
