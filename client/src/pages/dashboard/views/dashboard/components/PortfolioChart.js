import React, { Component,Fragment } from "react";
import ReactApexChart from "react-apexcharts";
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'



const useStyles = makeStyles((theme) => ({
  tabContainer: {
    marginTop: -theme.spacing(3),
    minHeight: '5%'
  },
  tab: {
    paddingTop: '0',
    paddingBottom:'0',
    paddingLeft:'0',
    paddingRight:'0',
    minWidth: '10%', // a number of your choice
    minHeight: '5%'
  }
}));



export default (props)=> {
  const classes = useStyles();
  const chartData=props.data;
  function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
   }  
  const valueArray=chartData.map(stock=>round(stock.price*stock.quantity,2));
  const symbolArray=chartData.map(stock=>stock.symbol);
  //CHART OPTIONS
  let chartVisProps = {
    
    series: valueArray,
    
    options: {
        labels: symbolArray,
        legend:{
            width:80
        },
        theme:{
            mode:'dark'
        },
    }
  }
  //END CHART OPTIONS

  


  return (
    <Fragment>
      <ReactApexChart options={chartVisProps.options} series={chartVisProps.series} labels={chartVisProps.labels}  align="center" type="donut" />
    </Fragment>
    );

}
