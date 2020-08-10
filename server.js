const express = require('express');
const passport = require('passport');
const db = require('./backend/db');
const app = express();

require('dotenv').config();

port=process.env.APIPORT||4000;
require('./backend/config/passport')(passport, db)
require('./backend/config/express')(app, passport, db.pool)
require('./backend/config/routes')(app, passport, db)


const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`)
}
);

server.on('close', () => {
	console.log('Closed express server')

	db.pool.end(() => {
		console.log('Shut down connection pool')
	})
})