

const { check, validationResult } = require('express-validator');
const createError = require('http-errors');

const stocks = require('../stocks');
module.exports= (app, passport, db)=>{

	const users = require('../users')(db,validationResult, passport)
	


	//Routes
	app.post('/api/login', users.login);
	app.post('/api/logout', users.logout);
	app.post('/api/signup',[check('firstname').isLength({ min: 1 }),
		check('lastname').isLength({ min: 1 }),
		check('email').isEmail(),
		check('password').isLength({ min: 1 })]
		,users.signup );
	app.post('/api/ping',(req, res) => {
		res.status(200).send("pong!");
	});
	//requires login
	app.get('/api/user',users.isLoggedIn, users.user);
	app.get('/api/user/portfolio',users.isLoggedIn,users.getPortfolio);
	app.post('/api/user/symbol/:symbol/quantity/:quantity',users.isLoggedIn,users.setPortfolio)
	app.post('/api/search',users.isLoggedIn, stocks.search);
	
	
	//handle routes not found
	app.use(function(req, res, next) {
		next(createError(404,"route not found"))
	});
	//handling errors
    app.use(function (err, req, res, next) {
		console.log('Error status: ', err.status);
		console.log('Message: ', err.message);
		console.log('\n');
		return res.status(err.status||500).json({
			status: err.status,
			message: err.message,
			stack: err.stack
		  });
		
	});

}