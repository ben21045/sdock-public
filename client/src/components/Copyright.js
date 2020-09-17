import {
    Typography
  } from '@material-ui/core';

import React from 'react';

export default function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        {'Benjamin Chang'}{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }