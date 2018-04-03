import {newLettersSize} from "./services/post_service";

const Handlebars = require('handlebars');
const HandlebarsIntl = require('handlebars-intl');

exports.setupHandlebars =  function () {
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
        const template = Handlebars.compile('{{formatRelative value}}');
        //const template = Handlebars.compile('{{formatDate value "short"}}');

        const compiled = template(context, {
            data: {intl: intlData}
        });

        return compiled;
    });
};

exports.setLettersNumber = async function setLettersNumber(req, res, next) {
    res.locals.session = req.session;
    if (req.path === '/') return next();
    let numberOfNewLetters = await newLettersSize();
    req.session.lettersNumber = numberOfNewLetters;
    //TODO
    //authenticate user
    next();
};