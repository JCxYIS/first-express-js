var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Cookie & Session
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session')
app.use(session({
  secret: 'JC is not a lolicon!!!',
  cookie: {maxAge: 3600 * 1000}, // expires at（milliseconds）
  resave: false,
  saveUninitialized: false
}))

// ROUTES
app.use('/', indexRouter);
app.use('/login', usersRouter);

// mongodb setup
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test20200202');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("[Mongoose] 成功連上mongoDB")});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
