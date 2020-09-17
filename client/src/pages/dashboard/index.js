import React, {Fragment} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import AppHeader from './AppHeader';
import NavBar from './NavBar';
import {Box,Container, Backdrop} from '@material-ui/core';
import {
  Switch,
  Route,
  useLocation,
  matchPath,
  useRouteMatch
} from "react-router-dom";
import Dashboard from './views/dashboard';
import Search from './views/search';
import NoMatch from '../../components/NoMatch'

const drawerWidth = 240;


let viewName=''
function SetView(props){
  viewName=props.name;
  
  return null;
}
const useStyles = makeStyles((theme) => ({
  
  appBarSpacer: theme.mixins.toolbar,
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: theme.zIndex.drawer
  },

  content: {
    display:"flex",
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  appBarSpacer: theme.mixins.toolbar,
  
}));
export default (prevMatch)=> {
  const classes = useStyles();
  let location = useLocation();
  let { path, url } = useRouteMatch();
  const match = matchPath(location.pathname, {
    path: "/dashboard/:view",
    exact: true,
    strict: false
  });
  const [open, setOpen] = React.useState(false);
  const handleDrawer = (isOpen) => {
    setOpen(isOpen);
  };
  const handleClose = () => {
    //console.log("closing");
    setOpen(false);
  };
  
  //console.log(location.pathname +"/")
  return (
    
    <Fragment >
      <Backdrop className={classes.backdrop} open={open} onClick={handleClose}/>
      <AppHeader name={match? match.params.view:'Dashboard'} setParentDrawer={handleDrawer} isDrawerOpen={open}/>
      {/*<NavBar setParentDrawer={handleDrawer} isDrawerOpen={open}/>
      */}
      <main className={classes.content}  >
        

        <Container className={classes.container}>
        
        <div className={classes.appBarSpacer}  />
        
        <Box px="2%">
          <Switch>
              <Route exact path={"/dashboard/"} render={()=> (<Dashboard/>)} />
              <Route exact path={"/search/:symbol"} render={(props)=> (<Search {...props}/>)} />
              <Route path="*" render={()=> (<NoMatch/>)}/>
          </Switch>
        </Box>
        </Container>
      </main> 
    </Fragment>
    
  );
}