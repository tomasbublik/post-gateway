import {LETTER_NEW_STATE} from "../const";

export default class DataUtils {

    static appendDateAndTypeToData(input, type) {
        let data = {
            date: new Date().toISOString(), type: type, data: input
        };
        return data;
    }

    static appendDateTypeAndNewSateToLetter(letter, type) {
        let data = {
            dateCreated: new Date().toISOString(),
            type: type, state: LETTER_NEW_STATE,
            dateSent: null,
            ...JSON.parse(letter)
        };
        return data;
    }
}