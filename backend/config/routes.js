

const { check, validationResult } = require('express-validator');

module.exports= (app, passport, db)=>{
	const users = require('../users')(db,validationResult)
	app.post('/api/login', passport.authenticate('local'), users.login)
	app.post('/api/logout', users.logout)
	app.post('/api/signup',[check('firstname').isLength({ min: 1 }),
	check('lastname').isLength({ min: 1 }),
	check('email').isEmail(),
	check('password').isLength({ min: 1 })]
	,users.signup );

    app.use(function (err, req, res, next) {
		if (err.message && (~err.message.indexOf('not found'))) {
			return next()
		}

		console.error(err.stack)

		return res.status(500).json({error: 'Error on backend occurred.'})
	})

	app.use(function (req, res) {
		const payload = {
			url: req.originalUrl,
			error: 'Not found'
		}
		if (req.accepts('json')) return res.status(404).json(payload)

		res.status(404).render('404', payload)
	})
}