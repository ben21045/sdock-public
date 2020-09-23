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

function formatChartValues(chartLabels,matrixValues){
    chartLabels=chartLabels;
    let formattedData=[];
    
    let i;
    function round(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    } 
    for (i = chartLabels.length-1; i >=0; i--) {
        
        formattedData.push({
            name:chartLabels[i],
            data: matrixValues[i].length>0 
            ? matrixValues[i].map(val => round(val,3))
            : []
        })   

    }
    return formattedData
}

export default (props)=> {
    
  const chartData = props.data;
  console.log(chartData)
  const chartXLabels = chartData.tickers;
  const chartValues = formatChartValues(chartXLabels,chartData.corr_matrix);
 
  //CHART OPTIONS
  let chartVisProps = {
    
    series: chartValues,
    
    options: {
        xaxis: {
            type: 'category',
            categories: chartXLabels
        },
        colors: ["#008FFB"],
        title: {
            text: 'Portfolio Correlation'
          },
        theme:{
            mode:'dark'
        },
        
    }
  }
  //END CHART OPTIONS

  


  return (
    <Fragment>
      <ReactApexChart options={chartVisProps.options} series={chartVisProps.series} align="center" type="heatmap" />
    </Fragment>
    );

}
