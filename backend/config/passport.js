
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy

module.exports = (passport, db) => {
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
		},
		function(email, password, cb) {
			email=email.trim().toLowerCase();
			db.query('SELECT id, email, password FROM users WHERE email=$1', [email], (err, result) => {
				if(err) {
					console.error('Error when selecting user on login', err)
					return cb(err)
				}

				if(result.rows.length > 0) {
					const first = result.rows[0]
					bcrypt.compare(password, first.password, function(err, res) {
						if(res) {
							cb(null, {id: first.id, email:first.email});
						} else {
							cb(null, false);
						}
					})
				} else {
					cb(null, false)
				}
			})
		}))

		passport.serializeUser((user, done) => {
			done(null, user)
		})

		passport.deserializeUser((user, cb) => {

			db.query('SELECT id,email FROM users WHERE id = $1', [user.id], (err, results) => {
				if(err) {
					console.error('Error when selecting user on session deserialize', err)
					return cb(err)
				}

				cb(null, {id: results.rows[0].id,email: results.rows[0].email})
			})
		})
}