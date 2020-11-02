const createError = require('http-errors');
const express = require('express');
const minifyHTML = require('express-minify-html-2');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const uglifyJs = require("uglify-js");
const fs = require('fs');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');
const aboutRouter = require('./routes/about');
// const jobs = require('./cron/job');


const setuppassport = require('./setuppassport');
const app = express();
setuppassport();

require('./models/db');


// view engine setup
app.use(minifyHTML({
  override:      true,
  exception_url: false,
  htmlMinifier: {
      removeComments:            true,
      collapseWhitespace:        true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes:     true,
      removeEmptyAttributes:     true,
      minifyJS:                  true,
      minifyCSS:                 true
  }
}));
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const appPluginFiles = [
  fs.readFileSync('public/js/jquery-3.4.1.min.js', "utf8"),
  fs.readFileSync('public/js/bootstrap.min.js', "utf8"),
  fs.readFileSync('public/js/slick.min.js', "utf8"),
  fs.readFileSync('public/js/owl.carousel.min.js', "utf8"),
  fs.readFileSync('public/js/slick-animation.min.js', "utf8"),
  fs.readFileSync('public/js/jquery.magnific-popup.min.js', "utf8"),  
];
const uglified = uglifyJs.minify(appPluginFiles, { compress : false });
fs.writeFile('public/main/churchStreaming.min.js', uglified.code, function (err){
  if(err) {
  console.log(err);
} else {
  console.log('Script generated and saved: churchStreaming.min.js');
}
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/',session({
  name: 'user_sid',
  secret: "JHGF>,./?;;LJ8#$?,KL:>>>,,KJJJDHE",
  resave: true,
  saveUninitialized: true,
  cookie: {
  }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/about', aboutRouter);

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

// jobs.start()

module.exports = app;
