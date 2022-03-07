var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Database
const { start_db  } = require('./setup/database') // Database connection created 


// Routes 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var { apiRouter } = require('./apiEndpoints/index')



const _start_db = async function()
{
  try
  {
      // start database 
 await start_db()
  }
  catch(err)
  {
    return console.log(err)
  }

}

_start_db() 


var app = express();



// Authentification
const { start} = require('./setup/loginAuthentification') 


// authentication
const start_app = async function()
{

  try
  {
    start(app)
  }
  catch(err)
  {
    return console.log(err)
  }
 
}

start_app() 


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api',apiRouter)

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


// fatal server error 
process.on('SIGINT',()=>{

  // close database 
  db.close() 

  // exit process 
  process.exit(0)
})



require('dotenv').config() 


console.log(' domain ' +  process.env.DOMAIN ) 


module.exports = app;
