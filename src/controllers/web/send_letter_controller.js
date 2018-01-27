import {readFile, readFileBase64} from "../../utils/file_utils";
import {sendRequest} from "../../services/post_service";
import {CREDENTIALS} from "../../const";

const DOMParser = require('xmldom').DOMParser;

const LETTER_TYPE_IDENTIFICATION = 'letter';
const PAGE_TITLE = 'Letter sending';
const view = 'send-letter';

export default class SendLetterController {

    showPage(req, res, leftMenu) {
        res.render(view, {title: PAGE_TITLE, menuName: leftMenu});
    }

    async sendLetter(req, res, leftMenu) {
        console.log('Send request received');

        let fileContent = await prepareXmlWithData('files/first_letter.xml');

        const renderOptions = {
            title: PAGE_TITLE, menuName: leftMenu
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
    }
}

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