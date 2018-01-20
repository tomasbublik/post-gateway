"use strict";

import DatabaseService from "../src/services/db_service";
import {DATABASE_CONNECTION_URL, TEST_DATABASE_NAME} from "../src/const";
import db from "../src/services/db";

let databaseService = new DatabaseService(TEST_DATABASE_NAME);

let letter = "{\n" +
    "  \"letter\": {\n" +
    "    \"sender_name\": \"FOXX s.r.o.\",\n" +
    "    \"sender_street\": \"Na Štáhlavce\",\n" +
    "    \"sender_house_number\": \"1255\",\n" +
    "    \"sender_city\": \"Praha 6\",\n" +
    "    \"sender_zip_code\": \"16000\",\n" +
    "    \"destination_name\": \"Monika Neumannová\",\n" +
    "    \"destination_street\": \"Česká\",\n" +
    "    \"destination_house_number\": \"12\",\n" +
    "    \"destination_city\": \"Frýdek Mísek\",\n" +
    "    \"destination_zip\": \"73801\",\n" +
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

describe('DatabaseService', () => {

    before((done) => {
        Promise.all([
            connectToDatabase()
        ]).then(() => {
            done();
        }).catch((error) => {
            done(error);
        })
    });

    describe('data persistence - ', () => {
        it('insert letter into database', async () => {
            let result = await databaseService.saveLetter(letter);
            expect(result).to.not.be.empty;
        });

    });
});