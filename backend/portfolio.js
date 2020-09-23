
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const fetch = require('node-fetch');
const eachOfSeries = require("async/eachOfSeries");

const query = (symbols,types,range='') => {
    const base = "https://cloud.iexapis.com";
    const token = process.env.IEX_CLOUD_TOKEN;
    //const types = "quote";
    
    return fetch(base + "/stable/stock/market"+ "/batch?" + new URLSearchParams({ token, types})+"&symbols="+symbols);
}
const getBatchQuote = (stockList)=>{
    let symbols=stockList.map(stock=>stock.symbol);
    symbols = symbols.join(',');
    return query(symbols,'quote')
    .then(response => response.json())
    .then(data => {
        let i=0;
        stockInfo={};
        for (const key in data){
            currentStock=stockList[i];
            stockInfo[currentStock.symbol]={quantity: currentStock.quantity,price: data[key].quote.latestPrice,timestamp: data[key].quote.latestTime}
            i++
        }
        return stockInfo;
    })
    .catch((error)=>{
        console.log(error)  
        next(createError(500,error));
      });
}


module.exports = (db) =>{
    function getPortfolio(req,res,next){
        const email=req.user.email;
        db.query('SELECT symbol,quantity FROM portfolio WHERE (email=$1)',[email], (err, result) => {
            if (err){
                console.log("error has occured");
                next(err);
            }
            if(result.rows.length > 0) {
                const portfolio=getBatchQuote(result.rows).then(portfolio => {
                    return res.status(200).json(portfolio);
                }); 
            }else{
                next(createError())
            }
        })
    }

    function updatePortfolio(req,res,next){
        stocks=req.body;
        
        eachOfSeries(stocks,
        (stockInfo,symbol,cb)=>{
            const quantity=stockInfo.quantity;
            const email=req.user.email;
            if(quantity>=0){
                db.query('UPDATE portfolio SET quantity=($3) WHERE (email=($1) AND symbol=($2))',[email,symbol,quantity] ,(err)=>{
                    if (err){
                        
                        return cb(err);
                    }
                    cb()
                })
            }else{
                db.query('DELETE FROM portfolio WHERE (email=($1) AND symbol=($2))',[email,symbol] ,(err)=>{
                    if (err){
                        
                        return cb(err);
                    }
                    cb()
                })
            }
        },
        (err)=>{
            if(err){
                console.log("error has occured");
                return next(err);
            }else{
                return res.sendStatus(200);
            }
        });
        
    }

    function addPortfolioItem(req,res,next){
        const symbol=req.params.symbol;
        const email=req.user.email;

        
        db.query(
            'INSERT INTO portfolio (email, symbol,quantity) \
            VALUES ($1,UPPER($2),0) \
            ON CONFLICT (email,symbol) \
            DO \
                NOTHING',[email,symbol], (err, result) => {
            if (err){
                console.log("error has occured");
                return next(err);
            }else{
                console.log("success!");
                return res.sendStatus(200)
            }
        })
    }
    return { getPortfolio:getPortfolio, updatePortfolio:updatePortfolio, addPortfolioItem:addPortfolioItem};
}