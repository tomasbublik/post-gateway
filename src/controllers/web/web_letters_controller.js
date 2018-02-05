export default class WebLettersController {

    constructor(lettersService) {
        this.lettersService = lettersService;
    }

    async showLetters(req, res, leftMenu) {
        let loadedLetters = await this.lettersService.getAllLetters();
        console.log(loadedLetters);
        res.render('letters', {
            title: 'This will be the letters page',
            letters: loadedLetters,
            menuName: leftMenu,
        })
    }

    async showLetterDetail(req, res, letterId, leftMenu) {
        let letter = await this.lettersService.loadLetterDetail(letterId);
        console.log("What is the letter id?: " + letterId);
        res.render('letter-detail', {
            title: 'This will be the letter detail page',
            letter: letter,
            menuName: leftMenu,
        })
    }
}