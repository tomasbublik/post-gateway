import web from './routes/web'
import api from './routes/api'
import {DATABASE_CONNECTION_URL} from "./const";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var overview = require('./routes/overview');
var sendRequest = require('./routes/send_letter');
var ticket = require('./routes/ticket');

const insecure = require('insecure');
var db = require('./services/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/overview', overview);
app.use('/send-request', sendRequest);
app.use('/ticket', ticket);
app.use('/web', web);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

insecure();

console.log('This must be 0');
console.log(process.env.NODE_TLS_REJECT_UNAUTHORIZED); // => '0'

// Connect to Mongo on start
/*db.connect('mongodb://localhost:27017', function(err) {
    if (err) {
        console.log('Unable to connect to Mongo');
        //process.exit(1)
    } else {
        console.log("Connected successfully to Mongo server");
    }
});*/


db.connectAsync(DATABASE_CONNECTION_URL).then((result) => {
    if (result) {
        console.log("Connected successfully to Mongo server with result: ", result)
    } else {
        console.log("Connected successfully to Mongo server");
    }
}, (error) => {
    console.log('Unable to connect to Mongo', error);
});

module.exports = app;