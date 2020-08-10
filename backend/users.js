
const bcrypt = require('bcrypt');
const { pool } = require('./db');
const { v4: uuidv4 } = require('uuid');



module.exports = (db,validationResult) =>{
    function login (req, res) {
        const { user } = req

        res.json(user)
    };

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
            return res.status(422).json({ errors: errors.array() });
        }
        pass=req.body.password;
        email=req.body.email;
        firstname=req.body.firstname;
        lastname=req.body.lastname;
        uuid=uuidv4();

        const saltRounds = 10; //the higher the better - the longer it takes to generate & compare
        console.log(pass);
        bcrypt.hash(pass, saltRounds,function(err, hash) {
            console.log(hash);

            // Store hash in your password DB.
            db.query('INSERT INTO users (id,first_name, last_name, email, password) VALUES ($1,$2,$3,$4,$5)',
            [uuid,firstname,lastname,email,hash], (err, result) => {
                if (err){
                    console.log(err.stack);
                } else{
                    res.sendStatus(200);
                }
            });
            
            
        });
        
    };
    return {login:login,logout:logout, signup:signup};
}