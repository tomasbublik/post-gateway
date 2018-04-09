"use strict";

import DatabaseService from "../src/services/db_service";
import {DATABASE_CONNECTION_URL, TEST_DATABASE_NAME} from "../src/const";
import db from "../src/services/db";

let databaseService = new DatabaseService(TEST_DATABASE_NAME);
import LettersService from '../src/services/letters_service';
import * as assert from "assert";

let lettersService = new LettersService(databaseService);
let letterId;

const letter = "{\n" +
    "  \"letter\": {\n" +
    "    \"external_id\": \"789456\",\n" +
    "    \"sender_name\": \"Source company Ltd.\",\n" +
    "    \"sender_street\": \"Biskupská\",\n" +
    "    \"sender_house_number\": \"131\",\n" +
    "    \"sender_city\": \"České Budějovice\",\n" +
    "    \"sender_zip_code\": \"37000\",\n" +
    "    \"destination_name\": \"František Omáčka\",\n" +
    "    \"destination_street\": \"Táborská\",\n" +
    "    \"destination_house_number\": \"666\",\n" +
    "    \"destination_city\": \"Tábor\",\n" +
    "    \"destination_zip_code\": \"78964\",\n" +
    "    \"files\": {\n" +
    "      \"file\": [\n" +
    "        {\n" +
    "          \"name\": \"test.pdf\",\n" +
    "          \"data\": \"Base64 data\"\n" +
    "        },\n" +
    "        {\n" +
    "          \"name\": \"atachment.pdf\",\n" +
    "          \"data\": \"Base64 data\"\n" +
    "        }\n" +
    "      ]\n" +
    "    }\n" +
    "  }\n" +
    "}\n";

function connectToDatabase() {
    return Promise.all([
        db.connectAsync(DATABASE_CONNECTION_URL)
    ]);
}

async function persistLetter() {
    letterId = await lettersService.persistLetter(letter);
}

describe('LettersService', () => {

    before((done) => {
        Promise.all([
            connectToDatabase()
        ]).then(() => {
            done();
        }).catch((error) => {
            done(error);
        });
    });

    describe('letter manipulation - ', () => {
        it('should throw error: to short id ', async () => {
            lettersService.constructXmlPostLetter('123456789').catch(err => {
                assert.equal(err.message, 'Argument passed in must be a single String of 12 bytes or a string ' +
                    'of 24 hex characters');
            });
        });

        it('should throw error: no file found ', async () => {
            lettersService.constructXmlPostLetter('123456789101').catch(err => {
                assert.equal(err.message, 'No letter found error');
            });
        });

        it('should create the letter from db ', async () => {
            await persistLetter();
            let xmlToSend = await lettersService.constructXmlPostLetter(letterId);

            expect(xmlToSend).to.not.be.empty;
        });
    });
});