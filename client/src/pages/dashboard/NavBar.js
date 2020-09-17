import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box
} from '@material-ui/core';
import {Menu as MenuIcon} from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import { mainListItems, secondaryListItems } from './ListItems';
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {drawerWidth} from './constants';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    overflow: 'visible',
    position: 'fixed',
    zIndex: theme.zIndex.drawer+100
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(0),
    },
  }

}));

const AppHeader = (props) =>{ 
  const classes = useStyles();
  const open=props.isDrawerOpen;

  const handleDrawerClose = () => {
    props.setParentDrawer(false);
  };

  return(
    <div className={classes.root}>
      <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
      <List>{mainListItems}</List>
      {/*
      <Divider />
      <List>{secondaryListItems}</List>
      */}
      
    </Drawer>
    </div>
  );
};

export default AppHeader;