"use strict";
import {saveRequest, saveResponse} from "./db_utils";

var request = require('request');
//to debug the input and output data
//require('request-debug')(request);
var pd = require('pretty-data').pd;

// Set the headers
const headers = {
    'User-Agent': 'Super Agent/0.0.1',
    'Host': 'online3.postservis.cz',
    'Content-Type': 'multipart/form-data',
    'Expect': '100-continue',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
};

let options = {
    uri: 'https://online3.postservis.cz/dopisonline/donApi.php',
    debugId: 5,
    timeout: 5000,
    method: 'POST',
    headers: headers,
    formData: ""
};

exports.sendRequest = async function (res, uri, formData, dbIdentification, view, externalOptions) {
    options.formData = formData;
    options.uri = uri;

    if (view === 'ticket' || view === 'overview') {
        options.headers["Content-Type"] = 'application/x-www-form-urlencoded';
    }

    saveRequest(options, dbIdentification);
    let streamBuffers = [];

    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {

            if (!error && response.statusCode == 200) {
                // Print out the response body
                //console.log(body)
            }
            if (error != null) {
                console.log(error);
                reject(error);
            }
            let bodyResponse = '';
            if (body != null) {
                bodyResponse = pd.xml(body);
                saveResponse(body, dbIdentification);
            }
            let responseHeaders = '';
            if (response != null && response.headers != null) {
                responseHeaders = pd.json(JSON.stringify(response.headers));
            }
            let renderOptions = {
                error: 'Error: ' + error,
                bodyResponse: 'Response body: ' + bodyResponse,
                headers: 'Headers: ' + responseHeaders,
                respBody: 'Body: ' + body,
                dataBuffer: Buffer.concat(streamBuffers)
            };

            resolve({...renderOptions, ...externalOptions});
        })
            .on('data', function (data) {
                // decompressed data as it is received
                //console.log('decoded chunk: ' + data)
                streamBuffers.push(data);
            }).on('response', function (response) {
            // unmodified http.IncomingMessage object
            response.on('data', function (data) {
                // compressed data as it is received
                console.log('received ' + data.length + ' bytes of compressed data')
            })
        }).on('end', function () {
        });
    });
};
