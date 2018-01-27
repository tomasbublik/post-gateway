import {saveLetter} from "../../services/db_service";

const PAGE_TITLE = 'API Insert letter page';
const view = 'insert_letter';

export default class LetterController {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    get(req, res) {
        res.render(view, {title: PAGE_TITLE});
    }

    async insert(req, res) {
        console.log('Insert letter request received');

        await this.databaseService.saveLetter(req.body.letter);

        console.log('About to show the screen');
        res.render(view, {title: PAGE_TITLE});
    }
}