const alpha = require('alphavantage')({ key: process.env.ALPHA_VANTAGE_API_KEY });
const createError = require('http-errors');



const parseData =(data,interval,seriesName)=>{
  let finSymbol='';
  let finChartData;
  let adj=false;
  let chartXValuesArray=[];
  let chartCloseValuesArray=[];
  let chartOpenValuesArray=[];
  let chartHighValuesArray=[];
  let chartLowValuesArray=[];
  let chartAdjCloseValuesArray=[];
  finSymbol=data['Meta Data']['2. Symbol'];
  
  for (let key in data[seriesName]){
    chartXValuesArray.push(key);
    chartCloseValuesArray.push(data[seriesName][key]['4. close'])
    chartOpenValuesArray.push(data[seriesName][key]['1. open']);
    chartHighValuesArray.push(data[seriesName][key]['2. high']);
    chartLowValuesArray.push(data[seriesName][key]['3. low']);
    if(data[seriesName][key]['5. adjusted close']){
      adj=true;
      chartAdjCloseValuesArray.push(data[seriesName][key]['5. adjusted close']);
    }
  }
  finChartData={
    symbol:finSymbol,
    chartXValues:chartXValuesArray,
    chartCloseValues:chartCloseValuesArray,
    chartOpenValues:chartOpenValuesArray,
    chartHighValues:chartHighValuesArray,
    chartLowValues:chartLowValuesArray
  };
  if(adj){
    finChartData.chartAdjCloseValuesArray = chartAdjCloseValuesArray;
  }
  return finChartData
}


module.exports = {
  

	search: (req, res,next) => {

    let allChartData={
      intraday:{},
      daily:{},
      weekly:{},
      monthly:{},
    }
    alpha.data.intraday(req.body.searchVal).then(data => {
      allChartData.intraday = parseData(data,'intraday','Time Series (1min)');
    }).then(()=>{
      alpha.data.daily_adjusted(req.body.searchVal).then(data => {
        allChartData.daily=parseData(data,'daily_adjusted','Time Series (Daily)');
      }).then(()=>{
        alpha.data.weekly_adjusted(req.body.searchVal).then(data => {
        allChartData.weekly=parseData(data,'weekly_adjusted','Weekly Adjusted Time Series');
        }).then(()=>{
          alpha.data.monthly_adjusted(req.body.searchVal).then(data => {
          allChartData.monthly=parseData(data,'monthly_adjusted','Monthly Adjusted Time Series');
          }).then(()=>{
            res.status(200).json(allChartData);
          })
          }
        )
      }
      )
    }
    ).catch((error)=>{
      console.log(error)  
      next(createError(500,error));
    });
    
	},

}