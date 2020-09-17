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

function joinXY(xData,yData){
  const joinedData=xData.map(function(x,yi){
    return [x,yData[yi]];
  })
  return joinedData;
}

export default (props)=> {
  const classes = useStyles();
  const allChartData=props.data;
  //console.log(allChartData);
  const [selectedInterval,setInterval]=React.useState('intraday')

  //CHART OPTIONS
  let chartVisProps = {
    series: [{
      name: "Price",
      data: joinXY(allChartData[selectedInterval].chartXValues,allChartData[selectedInterval].chartCloseValues)
    }],
    options: {
      colors: ['#ffd727'],
      chart: {
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Stock Prices',
        align: 'left'
      },
      grid: {
        show:false,
        //row: {
          //colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          //opacity: 0.5
        //},
        padding: {
          top:0,
          left:0,
          bottom:0,
          right:0
        }
      },
      yaxis: {
        labels:{
          show: false
        }
      },
      xaxis: {
        type: 'datetime'
      },
      stroke:{
        lineCap:'round',
        width:2
      },
      theme:{
        mode:'dark'
      },
    }
  }
  //END CHART OPTIONS

  //pass selected interval data
  const handlePlotTab=(e,selectedInterval)=>{
    chartVisProps['series']= [{
      name: "Price",
      data: joinXY(allChartData[selectedInterval].chartXValues,allChartData[selectedInterval].chartCloseValues),
    }]
    
    setInterval(selectedInterval);
  }


  return (
    <Fragment>
      <ReactApexChart options={chartVisProps.options} series={chartVisProps.series} align="center" />
      <Tabs variant="fullWidth" onChange={handlePlotTab} className={classes.tabContainer} value={selectedInterval}>
        <Tab label="Intraday" className={classes.tab} value='intraday'/>
        <Tab label="Daily" className={classes.tab} value='daily'/>
        <Tab label="Weekly" className={classes.tab} value='weekly'/>
        <Tab label="Monthly" className={classes.tab} value='monthly'/>
      </Tabs>
    </Fragment>
    );

}
