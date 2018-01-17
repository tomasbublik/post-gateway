import {sendRequest} from "../sender";
import {CREDENTIALS} from "../const";

var express = require('express');
var router = express.Router();

const DELIVERIES_IDENTIFICATION = 'deliveries_overview';
const PAGE_TITLE = 'Deliveries overview';

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('overview', {title: PAGE_TITLE, date: getCurrentDateFormatted(), delivery_number: ''});

});
router.post('/', async function (req, res) {
    console.log('Delivery request received');

    let deliveryNumber = req.body.delivery_number;
    if (!deliveryNumber) {
        deliveryNumber = '';
    }
    const view = 'overview';
    const renderOptions = {
        title: PAGE_TITLE,
        date: req.body.date,
        delivery_number: deliveryNumber
    };

    let responseData = await sendRequest(res, 'https://online3.postservis.cz/dopisonline/donPrehledZak.php', {
        ...CREDENTIALS,
        'zasilka': deliveryNumber,
        'datum': req.body.date
    }, DELIVERIES_IDENTIFICATION, view, renderOptions);

    res.render(view, responseData);
});

function getCurrentDateFormatted() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + mm + dd;
}

module.exports = router;
