module.exports = function(app, passport){
var LocalStrategy = require("passport-local").Strategy;
flash = require("connect-flash")


var mysql = require('mysql');

var connection = mysql.createConnection({
				  host     : 'localhost',
				  user     : 'root',
                  password : '',
                  database:'quanlybanhang'
				});



function ketnoi(){
    var mysql = require('mysql2/promise');
    var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'quanlybanhang',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    });
    return pool;
    }


passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //passback entire req to call back
	},async function (req, email, password, done){ 

        var pool=ketnoi();
        pool.query("SELECT * FROM users WHERE email ='" + email+"'",function(err, results){
            if(err){done(err)};

            if(!results.length || !( results[0].password == password)){ 
                return done(null, false,req.flash('message','Email hoặc mật khẩu không đúng!'));//email k ton tai hoặc pass sai
            }
            // toString()
            // console.log(results[0].password);
            // const hash = results[0].password;
            // bcrypt.compare(password, hash, function(err, res,req){
            // if(res==true)
            //     return done(null,{user_id: result[0].id});
            // else
            //     return done ( null, false);
            //     //,req.flash('message',' mật khẩu sai!')
            // });
            
            return done(null, results[0]);	//thành công
        }
    )
    }
));
passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    var pool =ketnoi();
    connection.query("select * from users where id = "+ id, function (err, results){
        done(err, results[0]);
    });
});

}