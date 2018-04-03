import {to_json} from "xmljson/lib/index";
import * as db from "../db";

exports.saveRequest = function (inputData, type) {
    const collection = db.getCollectionFromDB('postData', 'requests');
    let data = appendDateAndTypeToData(inputData, type);
    collection.insert(data, function (err) {
        if (err != null) {
            console.log('Failed to save request with error: ' + JSON.stringify(err));
        } else {
            console.log("Request inserted into the collection");
        }
    });
};

exports.saveResponse = function (inputData, type) {
    const collection = db.getCollectionFromDB('postData', 'responses');
    to_json(inputData, function (error, inputData) {
        const data = appendDateAndTypeToData(inputData, type);
        collection.insert(data, function (err) {
            if (err != null) {
                console.log('Failed to save response with error: ' + JSON.stringify(err));
            } else {
                console.log("Response inserted into the collection");
            }
        });
    });
};

function appendDateAndTypeToData(input, type) {
    let data = {
        table: []
    };
    data.table.push({date: new Date().toISOString(), type: type, data: input});
    return data;
}
