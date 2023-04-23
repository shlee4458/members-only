const dotenv = require("dotenv").config()
const passport = require("passport") // require the passport module
const session = require('express-session')

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// Set up mongoose connection
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const mongoDB = `${process.env.MONGO_URI}`

const connection = mongoose.createConnection(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Set up session
const MongoStore = require('connect-mongo');
const sessionStore = MongoStore.create({ mongoUrl: mongoDB, collection: 'sessions' });

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
  }
}));

// passport and session

require('./config/passport') // require the entire pasport config module
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
