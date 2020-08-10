import React, { Fragment } from 'react';
import {
  CssBaseline,
  withStyles,
  ThemeProvider,
  Typography,
  Box,
} from '@material-ui/core';

import {
  Alert,
  AlertTitle
} from '@material-ui/lab';

import { createMuiTheme } from '@material-ui/core/styles';
import deepOrange from '@material-ui/core/colors/deepOrange';
import amber from '@material-ui/core/colors/amber';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";


import AppHeader from './components/AppHeader';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';


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
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        SDock
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary:  deepOrange,
    secondary: amber
  } 
});

const App = ({ classes }) => (
  <ThemeProvider theme={theme}>
  <Router>
    
      <Fragment>
        <CssBaseline />
        
        
        
        {/*<main className={classes.main}>*/}
        <Switch>
              <Route exact path="/">
                <AppHeader />
                  <Home />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/signup">
                <SignUp />
              </Route>
              <Route path="*">
                <NoMatch />
              </Route>
        </Switch>
        
        <Box mt={5}>
          <Copyright />
        </Box>
        {/*</main>*/}
      </Fragment> 
  </Router>
  </ThemeProvider>
);

//export default withStyles(styles)(App);
export default App;