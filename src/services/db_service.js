"use strict";

import {to_json} from "xmljson/lib/index";
import * as db from "./db";
import DataUtils from "../utils/data_utils";
import {DATABASE_NAME} from "../const";
import mongo from 'mongodb';

const ObjectId = mongo.ObjectID;

export default class DatabaseService {

    constructor(databaseName = DATABASE_NAME) {
        this.databaseName = databaseName;
    }

    saveRequest(inputData, type) {
        const collection = db.getCollectionFromDB(this.databaseName, 'requests');
        let data = DataUtils.appendDateAndTypeToData(inputData, type);
        collection.insert(data, function (err, result) {
            if (err != null) {
                console.log('Failed to save request with error: ' + JSON.stringify(err));
            } else {
                console.log("Request inserted into the collection");
            }
        });
    }

    saveResponse(inputData, type) {
        const collection = db.getCollectionFromDB(this.databaseName, 'responses');
        to_json(inputData, function (error, inputData) {
            const data = DataUtils.appendDateAndTypeToData(inputData, type);
            collection.insert(data, function (err, result) {
                if (err != null) {
                    console.log('Failed to save response with error: ' + JSON.stringify(err));
                } else {
                    console.log("Response inserted into the collection");
                }
            });
        });
    }

    async saveLetter(letter) {
        const collection = db.getCollectionFromDB(this.databaseName, 'letters');
        const data = DataUtils.appendDateTypeAndNewSateToLetter(letter, 'letter');
        return new Promise(function (resolve, reject) {
            collection.insert(data, function (err, result) {
                if (err != null) {
                    console.log('Failed to save letter with error: ' + JSON.stringify(err));
                    reject(err);
                } else {
                    console.log("Letter inserted into the collection");
                    resolve(result);
                }
            });
        });
    }

    async updateLetter(letter) {
        const collection = db.getCollectionFromDB(this.databaseName, 'letters');
        return new Promise(function (resolve, reject) {
            collection.update({_id: letter.letterId}, letter, function (err, result) {
                if (err != null) {
                    console.log('Failed to update letter with error: ' + JSON.stringify(err));
                    reject(err);
                } else {
                    console.log("Letter updated");
                    resolve(result);
                }
            });
        });
    };

    async saveOrUpdateOrder(order) {
        const collection = db.getCollectionFromDB(this.databaseName, 'orders');
        let orderLoaded = await this.getOrderByLetterId();
        if (typeof orderLoaded !== 'undefined' && orderLoaded != null) {
            return new Promise(function (resolve, reject) {
                collection.update({letterId: order.letterId}, order, function (err, result) {
                    if (err != null) {
                        console.log('Failed to update order with error: ' + JSON.stringify(err));
                        reject(err);
                    } else {
                        console.log("Order updated into the collection");
                        resolve(result);
                    }
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                collection.insert(order, function (err, result) {
                    if (err != null) {
                        console.log('Failed to insert order with error: ' + JSON.stringify(err));
                        reject(err);
                    } else {
                        console.log("Order inserted into the collection");
                        resolve(result);
                    }
                });
            });
        }
    }

    async getLettersForChecking() {
        const collection = db.getCollectionFromDB(this.databaseName, 'letters');
        return new Promise(function (resolve, reject) {
            collection.find({state: "NEW"}).toArray(function (err, result) {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async getOrderByLetterId(letterId) {
        const collection = db.getCollectionFromDB(this.databaseName, 'orders');
        return new Promise(function (resolve, reject) {
            collection.findOne({letterId: letterId}, function (err, result) {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async getNumberOfLettersWithState(queriedState) {
        const collection = db.getCollectionFromDB(this.databaseName, 'letters');
        return new Promise(function (resolve, reject) {
            collection.count({state: queriedState}, function (err, result) {
                if (err != null) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async getLetterDetail(letterId) {
        const collection = db.getCollectionFromDB(this.databaseName, 'letters');
        return new Promise(function (resolve, reject) {
            try {
                let objectId = ObjectId(letterId);
                collection.findOne({_id: objectId}, function (err, document) {
                    if (err != null) {
                        reject(err);
                    } else {
                        //console.log(document);
                        resolve(document);
                    }
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    async deleteLetter(letterId) {
        const collection = db.getCollectionFromDB(this.databaseName, 'letters');
        return new Promise(function (resolve, reject) {
            try {
                let objectId = ObjectId(letterId);
                collection.deleteOne({_id: objectId}, function (err, document) {
                    if (err != null) {
                        reject(err);
                    } else {
                        //console.log(document);
                        resolve(document);
                    }
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    async getLetterDetailByExternalId(externalId) {
        const collection = db.getCollectionFromDB(this.databaseName, 'letters');
        return new Promise(function (resolve, reject) {
            try {
                collection.findOne({"letter.external_id": externalId}, function (err, document) {
                    if (err != null) {
                        reject(err);
                    } else {
                        console.log(document);
                        resolve(document);
                    }
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }
}