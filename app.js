var createError = require('http-errors');
var express = require('express');
var minifyHTML = require('express-minify-html-2');
var compression = require('compression');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var uglifyJs = require("uglify-js");
var fs = require('fs');

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');

var app = express();

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

var appPluginFiles = [
  fs.readFileSync('public/js/jquery-3.4.1.min.js', "utf8"),
  fs.readFileSync('public/js/bootstrap.min.js', "utf8"),
  fs.readFileSync('public/js/slick.min.js', "utf8"),
  fs.readFileSync('public/js/owl.carousel.min.js', "utf8"),
  fs.readFileSync('public/js/slick-animation.min.js', "utf8"),
  fs.readFileSync('public/js/jquery.magnific-popup.min.js', "utf8"),  
];
var uglified = uglifyJs.minify(appPluginFiles, { compress : false });
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

app.use('/', indexRouter);
app.use('/admin', adminRouter);

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
