import {sendRequest} from "../sender";
import {CREDENTIALS} from "../const";
import * as fs from "fs";

var express = require('express');
var router = express.Router();

const POSTAL_TICKET_IDENTIFICATION = 'postal_ticket';
const PAGE_TITLE = 'Postal ticket';

/* GET users listing. */
router.get('/', function (req, res) {
    res.render('ticket', {title: PAGE_TITLE, postal_number: ''});
});

router.post('/', async function (req, res) {
    console.log('Postal number request received');

    let postalNumber = req.body.postal_number;
    if (!postalNumber) {
        postalNumber = '';
    }
    const view = 'ticket';
    const renderOptions = {
        title: PAGE_TITLE,
        postal_number: postalNumber
    };

    let responseData = await sendRequest(res, 'https://online3.postservis.cz/dopisonline/podlist.php', {
        ...CREDENTIALS,
        'podcislo': postalNumber,
        'typvystupu': 'D',
    }, POSTAL_TICKET_IDENTIFICATION, view, renderOptions);

    let file = fs.createWriteStream(postalNumber + ".pdf");
    res.pipe(file);
    file.write(responseData.dataBuffer, () => {
        file.end();
        let fileToDownload = postalNumber + ".pdf";
        //Makes no sense to write all the data file into the html page
        res.download(fileToDownload);
    });
    //Makes no sense to write all the data file into the html page
    /*responseData.bodyResponse = '';
    responseData.respBody = '';
    res.render(view, responseData);*/
});

module.exports = router;
