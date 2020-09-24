import React, {Fragment, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Portfolio from './components/Portfolio';
import { useCookies } from 'react-cookie';
import {useHistory} from 'react-router-dom';
import PortfolioChart from './components/PortfolioChart'
import CorrelationChart from './components/CorrelationChart'
//import Chart from './Chart';
//import Deposits from './Deposits';
//import Orders from './Orders';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    maxHeight: 500,
  },
  appBarSpacer: theme.mixins.toolbar,
  
}));



export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [portfolioItems, setPortfolioItems] = React.useState({});
  const [correlationData, setCorrelationData] = React.useState({tickers:[],corr_matrix:[]});
  const [cookie,setCookie] = useCookies('isLoggedIn');
  const history = useHistory();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  let status;
  function getPortfolioCorrelation(portfolio){
    let status;
    fetch('/api/python/portfolio/correlation',{
      method: 'POST',
      body:    JSON.stringify(portfolio),
      headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
          status=response.status;
          return response.json();
        })
        .then(function (data) {
            if(status===200){
              console.log("Generated Correlation");
              setCorrelationData(data);
            }else{
              
              if(status==401){
                setCookie('isLoggedIn',false);
                history.push('/login')
              }  
              throw data
            }
        })
        .catch(function (error) {
          console.log(error);
          
        });
  }
  useEffect(() => {
    fetch('/api/user/portfolio',{
      credentials: 'include',
      method: 'GET',
    })
        .then(response => {
          status=response.status;
          return response.json();
        })
        .then(function (data) {
            if(status===200){
              console.log("Received Portfolio");
              getPortfolioCorrelation(data)
              setPortfolioItems(data)
              
            }else{
              
              if(status==401){
                setCookie('isLoggedIn',false);
                history.push('/login')
              }  
              throw data
            }
        })
        .catch(function (error) {
          console.log(error);
          
        });
  }
  
  ,[]);
  return (
        <Container maxWidth="lg" >
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} sm={10} md={6} lg={5}>
              <Paper className={fixedHeightPaper}>
                <PortfolioChart data={portfolioItems}/>
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <Paper className={fixedHeightPaper}>
                
                <Portfolio stocks={portfolioItems}/>
                
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12} sm={10} md={8}>
              <Paper className={classes.paper}>
                 <CorrelationChart data={correlationData}/>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
          </Box>
        </Container>
  );
}