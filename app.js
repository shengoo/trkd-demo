var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

var tokenService = require('./trkd/TokenService');
Promise.resolve(tokenService.getToken()).then(data => {console.log(data)})
// tokenService.CreateToken();

// tokenService.validateToken('14AF8DFFD2DBB3DFF05067B75EA27488BBEBAC031AC1FE0382F1BFBDDC0C8CDC23BB190DE21552FE739B07F2BCC1DF0C1999D2CABF9B8DC742105B8DC166B4F4A48A3EDE83B48748D691A77A8F8FC8A6D5FADC35298A842C2A33A6B1EF6545F2');
// var obj = {
//     name: 'trkd-demo'
// }
//
var fs = require('fs');
// fs.writeFile("./test", JSON.stringify(obj), function(err) {
//     if(err) {
//         return console.log(err);
//     }
//
//     console.log("The file was saved!");
// });
var dir = './cache';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
fs.writeFile('./cache/test', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});


var time = new Date("2017-10-17T08:10:37.0142147Z");
// console.log(Date.now() < time)

// console.log(fs.existsSync('./cache/token'))

module.exports = app;
