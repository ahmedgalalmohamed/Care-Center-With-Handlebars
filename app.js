var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const express_hbs = require('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');
var app = express();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//connect db
mongoose.connect('mongodb://localhost/Care_Center', (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Connect Database")
    }
})
require('./config/passport');
//connect db
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//

// view engine setup
app.engine('.hbs' , express_hbs({defaultLayout:'layout', extname:'.hbs',helpers:{
    add:function(val){
        return val+1;
    },
    retchar:function(val){
       return val.slice(1,5);
    }
}}));
app.set('view engine', '.hbs');
const oneDay = 1000 * 60 * 60 * 24;
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({secret:'ahmed123&*!',saveUninitialized:true,cookie: { maxAge: oneDay },resave:true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++




//Use Pages
app.use('/', indexRouter);
app.use('/users', usersRouter);
//Use Pages


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