var MongoClient = require('mongodb').MongoClient;

var state = {
    db: null
};

exports.connect = function(url, done) {
    if (state.db) return done();

    MongoClient.connect(url, function(err, db) {
        if (err) return done(err);
        state.db = db;
        done()
    })
};

exports.connectAsync = async function (url) {
    return new Promise(function (resolve, reject) {
        if (state.db) {
            resolve('OK');
        }

        MongoClient.connect(url, function(err, db) {
            if (err) {
                reject(err);
            }
            state.db = db;
            resolve('OK');
        })
    });
};



exports.getDB = function(dbName) {
    return state.db.db(dbName)
};

exports.getCollectionFromDB = function(dbName, collectionName) {
    return state.db.db(dbName).collection(collectionName);
};

exports.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db = null;
            state.mode = null;
            done(err)
        })
    }
};