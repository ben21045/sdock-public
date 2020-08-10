const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session)


module.exports = (app, passport, pool) => {
    app.use(express.json()); 

    app.use(session({
		store: new pgSession({
			pool
		}),
		secret: 'hello',
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }
    }))
    app.use(passport.initialize())
	app.use(passport.session())

}