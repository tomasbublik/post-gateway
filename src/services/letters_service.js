import Letter from '../models/letter';
import {prepareXmlWithData, writeFile, readFile, readFileBase64, deleteFile} from "../utils/file_utils";
import mongo from 'mongodb';
import {FILES_DIR, PDF_EXTENSION} from "../const";

const ObjectId = mongo.ObjectID;

export default class LettersService {

    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    async getAllReceivedLetters() {
        let lettersFromDb = await this.databaseService.getLettersWithState("NEW");
        return this.createLettersList(lettersFromDb);
    }

    async getAllSentLetters() {
        let lettersFromDb = await this.databaseService.getLettersWithState("SENT");
        return this.createLettersList(lettersFromDb);
    }

    createLettersList(lettersFromDb) {
        let letters = [];

        for (let val of lettersFromDb) {
            letters.push(this.createLetter(val));
        }

        return letters;
    }

    createLetter(dbVal) {
        if (dbVal != null) {
            let letterVal = dbVal.letter;
            return new Letter(
                dbVal._id,
                letterVal.external_id,
                letterVal.sender_name,
                letterVal.sender_street,
                letterVal.sender_house_number,
                letterVal.sender_city,
                letterVal.sender_zip_code,
                letterVal.destination_name,
                letterVal.destination_street,
                letterVal.destination_house_number,
                letterVal.destination_city,
                letterVal.destination_zip_code,
                new Date(dbVal.dateCreated),
                dbVal.state,
                dbVal.dateSent);
        }
    }

    createDbObjectFromLetter(letter) {
        return {
            _id: letter.id,
            state: letter.state,
            dateSent: letter.dateSent
        };
    }

    async updateLetterAfterSent(letter) {
        await this.databaseService.updateLetter(this.createDbObjectFromLetter(letter));
    }

    async getLetterDetail(letterId) {
        let letter = await this.databaseService.getLetterDetail(letterId);

        return letter.table[0].data;
    }

    async loadLetterDetail(letterId) {
        let letterDbData = await this.databaseService.getLetterDetail(letterId);
        if (letterDbData == null) {
            throw new Error("No letter found error");
        }

        return this.createLetter(letterDbData);
    }

    async deleteLetter(letterId) {
        try {
            const filePath = FILES_DIR + letterId + PDF_EXTENSION;
            deleteFile(filePath);
        } catch (e) {
            console.log("Unable to delete file: " + filePath);
        }
        return await this.databaseService.deleteLetter(letterId);
    }

    async constructXmlPostLetter(letterId) {
        let letter = await this.loadLetterDetail(letterId);
        let xmlFileContent = "";
        try {
            xmlFileContent = await readFile(FILES_DIR + 'first_letter.xml');
        } catch (e) {
            console.log("Error during template loading: " + e);
        }
        let attachmentFileContent = "";
        try {
            attachmentFileContent = await readFileBase64(FILES_DIR + letterId + PDF_EXTENSION);
        } catch (e) {
            console.log("Error during letter loading: " + e);
        }

        return await prepareXmlWithData(letter, xmlFileContent, attachmentFileContent);
    }

    async persistLetter(letter, fileData) {
        let dbResult;
        if (letter != null) {
            dbResult = await this.databaseService.saveLetter(letter);
        }
        let id = ObjectId(dbResult.insertedIds[0].id).toString();
        if (fileData != null) {
            await writeFile(FILES_DIR + id + PDF_EXTENSION, fileData);
        }

        return id;
    }

    async getLetterState(externalId) {
        let letter = await this.getLetterByExternalId(externalId);

        return {external_id: letter.externalId, state: letter.state, date_sent: letter.dateSent};
    }

    async getLettersStates(externalIds) {
        let letters = {};
        let key = 'letters';
        letters[key] = [];

        for (let externalId of externalIds) {
            let letter = await this.getLetterByExternalId(externalId);
            letters[key].push({external_id: letter.externalId, state: letter.state, date_sent: letter.dateSent});
        }

        return letters;
    }

    async getLetterByExternalId(externalId) {
        let letterDbData = await this.databaseService.getLetterDetailByExternalId(externalId);
        if (letterDbData == null) {
            throw new Error("No letter by externalId: " + externalId + " found error");
        }
        return this.createLetter(letterDbData);
    }

    async getNumberOfLettersByState(state) {
        let lettersNumber = 0;
        try {
            lettersNumber = await this.databaseService.getNumberOfLettersWithState(state);
        } catch (e) {
            console.log(e);
        }
        return lettersNumber;
    }
}