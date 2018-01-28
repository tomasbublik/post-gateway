import Letter from '../models/letter';

export default class LettersService {

    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    async getAllLetters() {
        let lettersFromDb = await this.databaseService.getLettersForChecking();
        let letters = [];

        for (let val of lettersFromDb) {
            let dataFromDb = val.table[0].data;
            if (dataFromDb != null) {
                let jsonLetter = JSON.parse(dataFromDb);
                let dataVal = jsonLetter.letter;
                let letter = new Letter(
                    val._id,
                    dataVal.external_id,
                    dataVal.sender_name,
                    dataVal.sender_street,
                    dataVal.sender_house_number,
                    dataVal.sender_city,
                    dataVal.sender_zip_code,
                    dataVal.destination_name,
                    dataVal.destination_street,
                    dataVal.destination_house_number,
                    dataVal.destination_city,
                    dataVal.destination_zip_code,
                    new Date(val.table[0].date));
                letters.push(letter);
            }
        }

        return letters;
    }

    async getLetterDetail(letterId) {
        let letter = await this.databaseService.getLetterDetail(letterId);
        return letter.table[0].data;
    }
}