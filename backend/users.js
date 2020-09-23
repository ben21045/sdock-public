
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Email = require('email-templates');
const createError = require('http-errors');
const fetch = require('node-fetch');
const eachOfSeries = require("async/eachOfSeries");

const sendConfirmation =(email, firstname)=>{
    const emailObj = new Email({
        views: {root: __dirname},
        preview:false,
        message: {
          from: 'Ben@sdockcentral.com'
        },
        // uncomment below to send emails in development/test env:
        send: true,
        transport: {
            host: 'smtp.mailtrap.io',
            port: 25,
            auth: {
                user: '3f94b9fc84e495',
                pass: '5cf9213a60cc7b'
             },
            secure: false,
            tls: {
                rejectUnauthorized: false
            }
        }
      });


    emailObj
    .send({
        template: 'confirmation',
        message: {
            to: email
        },
        locals: {
            name: firstname
        }
    })
    .then(console.log)
    .catch(console.error);
}

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

//historical data
/*
const getBatchHistorical = (stockList)=>{
    let symbols=stockList.map(stock=>stock.symbol);
    symbols = symbols.join(',');
    
    return query(symbols,quote,'5m')
    .then(response => response.json())
    .then(data => {
        let i=0;
        stockInfo={};
        for (const key in data){
            currentStock=stockList[i];
            stockInfo[currentStock.symbol]={price: data[key].quote.latestPrice,timestamp: data[key].quote.latestTime}
            i++
        }
        return stockInfo;
    })
    .catch((error)=>{
        console.log(error)  
        next(createError(500,error));
      });
}
*/
module.exports = (db,validationResult, passport) =>{
    function login(req, res, next) {
        
		passport.authenticate('local', function(err, user, info) {
			
			if (err) { return next(err); }
			if (!user) {return next( createError(401,'User not found.')); }
            req.logIn(user, function (err) { // <-- Log user in
                if(!err){
                    req.session.save((err) => {
                        if (err) {
                                return next(err);
                        }

                        return res.status(200).json( user );
                    });
                }
            });
            
			})(req, res, next);
		}

    function logout (req, res, next) {
        req.session.destroy((err) => {
            if(err) return next(err)

            req.logout()

            res.sendStatus(200)
        })
    };
    
    function signup (req, res, next) {
    
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(errors);
            next(createError(422,"Invalid signup details",{errors:errors.array()}));
        }
        const pass=req.body.password;
        const email=req.body.email;
        const firstname=req.body.firstname;
        const lastname=req.body.lastname;
        const uuid=uuidv4();

        const saltRounds = 10; //the higher the better - the longer it takes to generate & compare
        
        bcrypt.hash(pass, saltRounds,function(err, hash) {
            console.log("Storing user...");

            // Store hash in your password DB.
            db.query('INSERT INTO users (id,first_name, last_name, email, password) VALUES ($1,initcap($2),initcap($3),lower($4),$5)',
            [uuid,firstname,lastname,email,hash], (err, result) => {
                if (err){
                    console.log("error has occured");
                    if(err.constraint=='email_unique'){
                        return next(createError(409,"This email already exists"));
                    }
                    return next(err);
                } else{
                    console.log("user successfully stored into DB")
                    return res.status(200).json("sign up successful!");
                    //sendConfirmation(email,firstname);
                    
                 }
            });
            
            
        });
        
    };
    function isLoggedIn(req,res,next){
        if(req.user){
            next();
        }else{
            next(createError(401,'User is not authenticated'));
        }
    }
    function user(req, res, next){
        return res.status(200).json({
            user: req.user.id
        });
    }
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
    

    return {login:login,logout:logout, signup:signup, isLoggedIn:isLoggedIn ,user:user, getPortfolio:getPortfolio, updatePortfolio:updatePortfolio, addPortfolioItem:addPortfolioItem};
}