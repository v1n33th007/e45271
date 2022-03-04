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
  const { unreadMessages } = conversation;

  if (!unreadMessages) return null;

  return (
    <Box className={classes.boxStyle}>
      <Typography className={classes.unreadCount}>{unreadMessages}</Typography>
    </Box>
  );
};

export default UnreadCount;
