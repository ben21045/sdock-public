function calculateReturns(weeklyPrices){
    weeklyReturns=[];
    for (const i = 1; i < weeklyPrices.length; i++) {
        weeklyReturns.push((weeklyPrices[i]-weeklyPrices[i-1])/weeklyPrices[i-1]);
    }
    return weeklyReturns;
}

function mean(array){
    return (array.reduce(function(a, b){
        return a + b;
        }, 0))/array.length*1.0;
}

//takes weekly prices and turns into covariance
function returnsBasedCov(weeklyPrices1,weeklyPrices2){
    //first calculate weekly returns
    returns1=calculateReturns(weeklyPrices1);
    returns2=calculateReturns(weeklyPrices2);
    n=returns1.length;
    array.reduce(function(a, b){
        return (returns1-mean(returns1))*(returns2-mean(returns2))/(n-1);
        }, 0);
}
