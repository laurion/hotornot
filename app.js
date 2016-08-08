var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ParseServer = require('parse-server').ParseServer;
var routes = require('./routes/index');
var session = require('express-session')
// var users = require('./routes/users');
// var voted = require('./routes/voted');

const app = module.exports = express(); // ok
var api = new ParseServer({
  databaseURI: 'mongodb://intersect:4wabbit4@ds033015.mlab.com:33015/hotornot',
  masterKey: '1o6z9ePR3qPnRU0jHIP4iWToNzkANKIr3UNHwelq',
  appId: 'utXysazDczvny5sBUme5HZIzfUrybjppWIc8aVGb', //Add your master key here. Keep it secret!
  serverURL: 'http://tiberiupopovici.eu-west-1.elasticbeanstalk.com/parse',
  liveQuery: {
    classNames: ["Posts", "Comments","User"] // List of classes to support for query subscriptions
  }
});
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);
// if(module.hot) {

//   var acceptedDepencies = ['./routing-app'];

//   module.hot.accept(acceptedDepencies, function() {
//     // require again...
//     require('./routing-app');
//   });
// }
app.use(session({
    secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
    resave: false,
    saveUninitialized: true
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(require('express-promise')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/veted', voted)
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
