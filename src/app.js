import web from './routes/web'
import api from './routes/api'
import exphbs from 'express-handlebars';

const Handlebars = require('handlebars');
const HandlebarsIntl = require('handlebars-intl');

import {DATABASE_CONNECTION_URL} from "./const";

let express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const insecure = require('insecure');

const bodyParser = require('body-parser');
const index = require('./routes/index');
let db = require('./services/db');

const app = express();

app.set('views', path.join(__dirname, 'views_html'));
app.set('view engine', 'html');
app.engine('html', exphbs({
    defaultLayout: 'main', extname: '.html',
    layoutsDir: path.join(__dirname, 'views_html', 'layouts'),
    partialsDir: path.join(__dirname, 'views_html', 'includes'),
    helpers: {
        whichLeftMenu: function (name) {
            return name;
        },
        //TODO maybe do it globally
        /*niceDate: function(dateTime) {
            moment(dateTime).format('D MMM YYYY @ H:mm');
        }*/
    }
}));

HandlebarsIntl.registerWith(Handlebars);
Handlebars.registerHelper('customDateFormat', function (value) {
    const context = {
        value: value
    };

    const intlData = {
        "locales": "cs-CZ",
        "formats": {
            "date": {
                "short": {
                    "day": "numeric",
                    "month": "long",
                    "year": "numeric"
                }
            }
        }
    };

    // use the formatDate helper from handlebars-intl
    /*const template = Handlebars.compile('{{formatRelative value}}');*/
    const template = Handlebars.compile('{{formatDate value "short"}}');

    const compiled = template(context, {
        data: {intl: intlData}
    });

    return compiled
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/web', web);
app.use('/api', api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
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