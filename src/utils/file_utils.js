const fs = require('fs');

const readFile = (path, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) rej(err);
            else res(data)
        })
    });

const readFileBase64 = (path, opts = 'base64') =>
    new Promise((res, rej) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) rej(err);
            else res(data)
        })
    });

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) rej(err);
            else res()
        })
    });

/**
 * Old approach if there is one static file only
 */
function createStreamFromFile(fileName) {
    let inputXmlStream = fs.createReadStream(fileName);
    inputXmlStream.on('data', function (chunk) {
        console.log("Stream: Data from file: ");
        //console.log(chunk);
        inputXmlStream.destroy();
    }).on('end', function () {
        // This may not been called since we are destroying the stream
        // the first time 'data' event is received
        console.log('Stream: All the data in the file has been read');
        inputXmlStream.close();
    }).on('close', function (err) {
        console.log('Stream: Stream has been destroyed and file has been closed');
    });
    return inputXmlStream;
}

function logInputFile() {
    fs.readFile('files/first_letter.xml', {encoding: 'utf-8'}, function (err, data) {
        if (!err) {
            console.log('Input file data: ' + data);
        } else {
            console.log(err);
        }
    });
}

module.exports = {
    readFile,
    readFileBase64,
    writeFile
};
