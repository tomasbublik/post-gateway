import {readFileBase64} from "../../utils/file_utils";

export default class WebLettersController {

    constructor(lettersService) {
        this.lettersService = lettersService;
    }

    async showLetters(req, res, leftMenu) {
        let loadedLetters = await this.lettersService.getAllLetters();
        res.render('letters', {
            title: 'List of received letters',
            letters: loadedLetters,
            menuName: leftMenu,
        })
    }

    async showLetterDetail(req, res, letterId, leftMenu) {
        let letter = await this.lettersService.loadLetterDetail(letterId);
        console.log("What is the requested letter id?: " + letterId);
        res.render('letter-detail', {
            title: 'This will be the letter detail page',
            letter: letter,
            menuName: leftMenu,
        })
    }

    async getLetterPdf(req, res, letterId) {
        let fileContent = "";
        try {
            fileContent = await readFileBase64('files/' + letterId + '.pdf');
        } catch (e) {
            console.log("Error during letter loading: " + e);
        }

        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="filename.pdf"'
        });

        const download = Buffer.from(fileContent.toString('utf-8'), 'base64');
        res.end(download);
    }
}