import {saveLetter} from "../../services/db_service";

const PAGE_TITLE = 'API Insert letter page';
const view = 'insert_letter';

export default class LetterController {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    static get(req, res) {
        res.render(view, {title: PAGE_TITLE});
    }

    async insert(req, res, next) {
        console.log('Insert letter request received');
        let incomingLetter = req.body.letter;
        let result;
        if (incomingLetter != null) {
            result = await this.databaseService.saveLetter(req.body.letter);
        } else {
            res.status(500).json('Letter data empty');
            return next(err);
        }

        console.log('About to send the answer');

        res.json({response_code: 'Saved successfully', ...result})
    }
}