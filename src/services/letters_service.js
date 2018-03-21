import Letter from '../models/letter';
import {prepareXmlWithData, writeFile, readFile, readFileBase64, deleteFile} from "../utils/file_utils";
import mongo from 'mongodb';
import {FILES_DIR, PDF_EXTENSION} from "../const";

const ObjectId = mongo.ObjectID;

export default class LettersService {

    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    async getAllLetters() {
        let lettersFromDb = await this.databaseService.getLettersForChecking();
        let letters = [];

        for (let val of lettersFromDb) {
            letters.push(this.createLetter(val));
        }

        return letters;
    }

    createLetter(dbVal) {
        if (dbVal != null) {
            let dataVal = dbVal.letter;
            return new Letter(
                dbVal._id,
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
                new Date(dbVal.date),
                dbVal.state);
        }
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
        let letterDbData = await this.databaseService.getLetterDetailByExternalId(externalId);
        if (letterDbData == null) {
            throw new Error("No letter by externalId: " + externalId + " found error");
        }
        let letter = this.createLetter(letterDbData);

        return {external_id: letter.external_id, state: letter.state};
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