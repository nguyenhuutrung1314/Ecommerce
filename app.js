var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var router = express.Router();
const ejsLint = require('ejs-lint');
var session = require('express-session');
var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/productRouter');
var loainuochoaRouter =require('./routes/loainuochoa');
var searchRouter=require('./routes/search');
//var loainuochoaRouter = require('./routes/loainuochoa');
var AdminRouter= require('./routes/admin');
var gianhangRouter= require('./routes/admin/gianhang');
var dathangRouter=require('./routes/dat-hang');
var DathangRouter=require('./routes/dathang');
var thongkeRouter=require('./routes/admin/thongke');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({ // Config session
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 600000000000000 }
}))

app.use(passport.initialize()); // init passport
app.use(passport.session()); // gán session cho passport.
require('./routes/Passport')(app, passport); // Gọi file config passport ra v
// à truyền vào 2 đối tượng app và passport. function(app, passport)

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: "Shh, its a secret!" }));


app.use((req, res, next) => { // set user vào ré.locals để gọi ra ở view với cú pháp <%- user %>
  res.locals.user = req.user;
  next();
});

app.use(indexRouter);
app.use(usersRouter);
app.use(productRouter);
app.use(loainuochoaRouter);
app.use(searchRouter);
app.use(AdminRouter);
app.use(gianhangRouter);
app.use(dathangRouter);
app.use(DathangRouter);
app.use(thongkeRouter);

//dangky

var user = require('./routes/signup')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/dangnhap',user.login);
app.use('/dangky',user.signup);


app.post('/dangky', user.signup);//call for signup post
//dangnhap
flash = require("connect-flash")
app.use(flash());




require('./routes/Passport')(app,passport);

var login = require('./routes/login')
app.use(login);


//

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.get('/favicon.ico', (req, res) => res.status(204));
app.listen(8000);