import {sendRequest} from "../../services/post_service";
import {CREDENTIALS, LETTER_SENT_STATE} from "../../const";

const LETTER_TYPE_IDENTIFICATION = 'letter';
const PAGE_TITLE = 'Letter sending';
const view = 'letter-detail';

export default class SendLetterController {

    constructor(lettersService, ordersService, databaseService) {
        this.lettersService = lettersService;
        this.ordersService = ordersService;
        this.databaseService = databaseService;
    }

    showPage(req, res, leftMenu) {
        res.render(view, {title: PAGE_TITLE, menuName: leftMenu});
    }

    async sendLetter(req, res, leftMenu) {
        let letterId = req.body.letterId;
        console.log('Send request received for id: ' + letterId);

        let fileContent = await this.lettersService.constructXmlPostLetter(letterId);

        let letter = await this.lettersService.loadLetterDetail(letterId);
        const renderOptions = {
            title: PAGE_TITLE, letter: letter, menuName: leftMenu
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

        await updateDbData.call(this, responseData, letter, letterId);

        res.render(view, responseData);
    }
}

async function updateDbData(responseData, letter, letterId) {
    let order = await this.ordersService.createOrderFromXml(responseData.bodyResponse);
    if (order.state === "0") {
        letter.state = LETTER_SENT_STATE;
        letter.dateSent = new Date().toISOString();
        await this.lettersService.updateLetterAfterSent(letter);
    }
    order.letterId = letterId;
    let dbResult = await this.databaseService.saveOrUpdateOrder(order);
    return dbResult;
}