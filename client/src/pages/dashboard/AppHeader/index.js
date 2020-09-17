import React, {Fragment} from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { fade, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {drawerWidth} from '../constants';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SearchBar from "material-ui-search-bar";
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid';
import StockSearchBar from './StockSearchBar';
import {
  useRouteMatch,
  useHistory
} from "react-router-dom";
import { useCookies } from 'react-cookie';



const useStyles = makeStyles((theme) => ({
  root: {
    
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  
  
 
  
}));

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const AppHeader = (props) =>{ 
  const classes = useStyles();
  const open=props.isDrawerOpen;
  
  let match = useRouteMatch("/:view/:symbol?");
  const viewName=match.params.view;
  const symbol=!!match.params.symbol?match.params.symbol.toUpperCase():null;
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [cookie,setCookie] = useCookies('isLoggedIn');
  const handleClickAccountBtn = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setCookie('isLoggedIn',false);
    history.push('/login');
  }
  const handleBack = () => {
    history.push('/dashboard');
  };
  return(
    <div className={classes.root}>
    <AppBar position="fixed" className={clsx(classes.appBar, open && classes.appBarShift)}>
        {/*<Toolbar position="fixed" className={classes.toolbar}>*/}
        <Grid container direction="row" alignItems="center" justify="space-around">
          {/*
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          */}
          
          {viewName=='dashboard'?
          <Fragment>
            <Grid item>
              <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.title}>
                {capitalizeFirstLetter(props.name)}
              </Typography>
            </Grid>
            <Grid item>
              <StockSearchBar/>
            </Grid>
          </Fragment>
          :(viewName=='search'?
          <Fragment>
            <Grid item>
              <IconButton color="inherit" onClick={handleBack} >
                <ArrowBackIosIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography component="h1" variant="h4" color="inherit" noWrap className={classes.title}>
                {symbol}
              </Typography>
            </Grid>
          </Fragment>
          :null)
          }
          <Grid item>
            <IconButton color="inherit" onClick={handleClickAccountBtn}>
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Switch User</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Grid> 
        </Grid>
        {/*</Toolbar>*/}
      </AppBar>
      
     
    </div>
  );
};

export default AppHeader;