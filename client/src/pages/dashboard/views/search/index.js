import React, {Fragment, useEffect} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import SearchBar from "material-ui-search-bar";
import StockChart from './components/StockChart';
//import Deposits from './Deposits';
//import Orders from './Orders';
import { useCookies } from 'react-cookie';
import {useHistory,useRouteMatch} from 'react-router-dom';
import PurchasePanel from './components/PurchasePanel';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
  },
  searchBar:{
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp, 
      duration: theme.transitions.duration.shortest
    })
  },
  chartGridItem:{
    order:3,
    [theme.breakpoints.up('sm')]: {
      order:2
    },
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp, 
      duration: theme.transitions.duration.shortest
    })  
  },
  purchaseGridItem:{
    order:2,
    [theme.breakpoints.up('sm')]: {
      order:3
    },
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.sharp, 
      duration: theme.transitions.duration.shortest
    }),
  },
  
  

}));


let purchaseProps={
  symbol:"",
  price:0,
  timestamp: Date.now()
}


export default (props)=> {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const searchVal = props.match.params.symbol;
  const [cookie,setCookie] = useCookies('isLoggedIn');
  const history = useHistory();
  const chartDataParams={
    symbol : "",
    chartXValues : [],
    chartCloseValues : [],
    chartOpenValues:[],
    chartHighValues:[],
    chartLowValues:[]
  };
  const [allChartData, setAllChartData] = React.useState({
    intraday: chartDataParams,
    daily: chartDataParams,
    weekly: chartDataParams,
    monthly: chartDataParams
  });
  
  useEffect(() => {
  
    let status;
    fetch('/api/search',{
      credentials: 'include',
      method: 'POST',
      body:    JSON.stringify({searchVal:searchVal}),
      headers: { 'Content-Type': 'application/json',
                 },
    })
        .then(response => {
          status=response.status;
          return response.json();
        })
        .then(function (data) {
            if(status===200){
              
              console.log("Received Stock Data");
            
              
              purchaseProps={
                symbol: (data.intraday.symbol).toUpperCase(),
                price: data.intraday.chartCloseValues[0],
                timestamp: data.intraday.chartXValues[0],
              }
              console.log(data.intraday.chartXValues);
              setAllChartData(data)

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
      },[]);
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
      <Fragment>
        
        <Grid container spacing={3} justify="center">
            
            {/* Chart */}
            <Grid item md={7} sm={9} xs={12} className={classes.chartGridItem} >
           
              <Paper className={fixedHeightPaper}>
                <StockChart data={allChartData}/> 
                
              </Paper>
            </Grid>
            <Grid item md={3} sm={3} xs={8} className={classes.purchaseGridItem}>
              <Paper className={fixedHeightPaper}>
                <PurchasePanel purchaseInfo={purchaseProps}/>
              </Paper>
            </Grid>
        </Grid>
          
    </Fragment>  
  );
}