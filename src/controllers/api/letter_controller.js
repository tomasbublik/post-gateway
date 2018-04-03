import MultiPartFormParser from "../../utils/multipart_form_parser";

const PAGE_TITLE = 'API Insert letter page';
const view = 'insert_letter';

export default class LetterController {
    constructor(databaseService, letterService) {
        this.databaseService = databaseService;
        this.letterService = letterService;
    }

    static get(req, res) {
        res.render(view, {title: PAGE_TITLE});
    }

    async insert(req, res, next) {
        console.log('Insert letter request received');

        let multipartFormParser = new MultiPartFormParser(req);

        let parseResult = await multipartFormParser.parseRequest();

        if (parseResult === 'OK') {
            await this.letterService.persistLetter(multipartFormParser.letter, multipartFormParser.fileData);
        } else {
            res.status(500).json('Letter data empty');
            return next(parseResult);
        }

        console.log('About to send the answer');

        res.json({response_code: 'Saved successfully', ...parseResult});
    }

    async checkState(req, res, externalId) {
        console.log('External check state request received for external id: ' + externalId);
        try {
            let letterIdAndState = await this.letterService.getLetterState(externalId);

            res.json(letterIdAndState);
        } catch (e) {
            res.json({error: e.toString()});
        }
    }
}