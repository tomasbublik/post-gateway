import {sendRequest} from "../../services/post_service";
import {CREDENTIALS} from "../../const";

const LETTER_TYPE_IDENTIFICATION = 'letter';
const PAGE_TITLE = 'Letter sending';
const view = 'letter-detail';

export default class SendLetterController {

    constructor(lettersService) {
        this.lettersService = lettersService;
    }

    showPage(req, res, leftMenu) {
        res.render(view, {title: PAGE_TITLE, menuName: leftMenu});
    }

    async sendLetter(req, res, leftMenu) {
        let letterId = req.body.letterId;
        console.log('Send request received for id: ' + letterId);

        let fileContent = await this.lettersService.constructXmlPostLetter(letterId);

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