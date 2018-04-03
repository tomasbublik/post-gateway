import {readFile, readFileBase64} from "../file_utils";
import {sendRequest} from "../sender";
import {CREDENTIALS} from "../const";

const express = require('express');
var router = express.Router();
var DOMParser = require('xmldom').DOMParser;

const LETTER_TYPE_IDENTIFICATION = 'letter';
const PAGE_TITLE = 'Letter sending';

/* GET send request page. */
router.get('/', function (req, res) {
    res.render('send_request', {title: PAGE_TITLE});
});

router.post('/', async function (req, res) {
    console.log('Request received');

    let fileContent = await prepareXmlWithData('files/first_letter.xml');

    const view = 'send_request';
    const renderOptions = {
        title: PAGE_TITLE
    };

    let responseData = await sendRequest(res, 'https://online3.postservis.cz/dopisonline/donApi.php', {
        ...CREDENTIALS,
        'soubor': {
            value: fileContent,
            options: {
                filename: 'first_letter.xml',
                contentType: 'multipart/form-data'
            }
        }
    }, LETTER_TYPE_IDENTIFICATION, view, renderOptions);

    res.render(view, responseData);
});

async function prepareXmlWithData(fileName) {
    const xmlFileContent = await readFile(fileName);
    const jpgLogoFileContent = await readFileBase64('files/logo.jpg');
    const attachmentFileContent = await readFileBase64('files/attachment.pdf');
    const testFileContent = await readFileBase64('files/test.pdf');

    let doc = new DOMParser().parseFromString(xmlFileContent, 'application/xml');
    doc.getElementsByTagName('odsobrazek')[0].childNodes[0].data = jpgLogoFileContent;
    doc.getElementsByTagName('dataSoubor')[0].childNodes[0].data = attachmentFileContent;
    doc.getElementsByTagName('dataSoubor')[1].childNodes[0].data = testFileContent;

    console.log('File content after modification: ');
    //console.log(doc.toString());
    return doc.toString();
}

module.exports = router;
