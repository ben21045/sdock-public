const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bodyParser = require('body-parser');

module.exports = (app, passport, pool) => {
	
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	
    app.use(session({
		store: new pgSession({
			pool
		}),
		secret: 'hello',
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 24 * 60 * 60 * 1000 }
    }))
    app.use(passport.initialize())
	app.use(passport.session())

}