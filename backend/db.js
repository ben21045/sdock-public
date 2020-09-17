const Pool = require('pg').Pool;
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {v4:uuidv4} = require('uuid');


const pool = new Pool()
pool.on('error', function (err) {
	console.error('idle client error', err.message, err.stack)
})

module.exports = {
	pool,
	query: (text, params, callback) => {
		return pool.query(text, params, callback)
	}
}
