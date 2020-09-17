import React, { Fragment, useState, useEffect } from 'react';
import {
  CssBaseline,
  withStyles,
  ThemeProvider,
  Typography,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import cookie from 'react-cookie';
import {
  Alert,
  AlertTitle
} from '@material-ui/lab';
import { createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import purple from '@material-ui/core/colors/purple';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  Redirect
} from "react-router-dom";


import Login from './pages/Login';
import SignUp from './pages/SignUp';
import "./App.css";
import AppLayout from "./pages/dashboard";
import { useCookies } from 'react-cookie';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { deepPurple } from '@material-ui/core/colors';

function NoMatch() {
  let location = useLocation();

  return (
    <Alert variant="filled" severity="error">
      404 - No match for <strong><code>{location.pathname}</code></strong>
    </Alert>
        
  );
}
/*
const styles = theme => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
});
*/


const theme = createMuiTheme({
  palette: {
    primary: { main:'#38314b'}
    ,
    secondary: deepOrange,
    type: "dark"
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    //display: 'flex',
  }
})
);


export default function App (){
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(['isLoggedIn']);

  function handleLoginSuccess() {
    setCookie('isLoggedIn', true);
  }
  const PrivateRoute = ({ component: Component, ...rest }) => {
    
    return (
      
      <Route
        {...rest}
        render={routerProps =>{
          
          return cookies.isLoggedIn ? (
            <Component {...routerProps} />
          ) : (
            <Redirect
              to={{ pathname: "/login", state: { from: routerProps.location } }}
            />
          )
        }
        }
      />
    );
  };
/*   useEffect(() => {
    fetch('/api/user',{
      method: 'get'
    }).then(function (response) {
      if(response.ok){
        setState({
        loggedIn: true,
        user: response.body.user
        });
      }else {
        setState({
        loggedIn: false,
        user: null
        });
      }
    });
    
  }, [state.user]) */




  return (
  
    
  <Router>
      
      <Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          
          <Switch>
              <Route exact path="/">
                  <Redirect to="/dashboard" />
              </Route>
              
              <PrivateRoute path={["/dashboard","/search"]} component={AppLayout} isLoggedIn={cookies.isLoggedIn}/>
              <Route path="/login">
                {!cookies.isLoggedIn && (
                  <Alert severity="warning">
                    You are not logged in. Please sign in!
                  </Alert>
                )}
                <Login onSuccess={handleLoginSuccess}/>
              </Route>
              <Route path="/signup">
                <SignUp />
              </Route>
              <Route path="*">
                <NoMatch />
              </Route>
          </Switch>
      </ThemeProvider>
    </Fragment> 
      
  </Router>
  
  );
}

//export default withStyles(styles)(App);
