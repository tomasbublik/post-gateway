import {FILES_DIR, PDF_EXTENSION} from "../const";

const fs = require('fs');
const DOMParser = require('xmldom').DOMParser;

const readFile = (path, opts = 'utf8') =>
    new Promise((res, rej) => {
        if (fs.existsSync(path)) {
            fs.readFile(path, opts, (err, data) => {
                if (err) {
                    rej(err);
                }
                else {
                    res(data);
                }
            });
        } else {
            rej(new Error("No such file"));
        }
    });

const readFileBase64 = (path, opts = 'base64') =>
    new Promise((res, rej) => {
        if (fs.existsSync(path)) {
            fs.readFile(path, opts, (err, data) => {
                if (err) {
                    rej(err);
                }
                else {
                    res(data);
                }
            });
        } else {
            rej(new Error("No such file"));
        }
    });

const writeFile = (path, data, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.writeFile(path, data, opts, (err) => {
            if (err) {
                rej(err);
            }
            else {
                res(data);
            }
        });
    });

const deleteFile = (path) => {
    if (fs.existsSync(path)) {
        fs.unlink(path, (err) => {
            if (err) {
                throw err;
            }
            console.log("Deleted file: " + path);
        });
    }
};

const prepareXmlWithData = (letter, xmlTemplate, attachmentContent) =>
    new Promise(async (res, rej) => {
        try {
            let jpgLogoFileContent = "";
            try {
                jpgLogoFileContent = await readFileBase64(FILES_DIR + 'logo.jpg');
            } catch (e) {
                console.log("Logo file loading failure: " + e);
            }
            let testFileContent = "";
            try {
                testFileContent = await readFileBase64(FILES_DIR + 'test' + PDF_EXTENSION);
            } catch (e) {
                console.log("Test file loading failure: " + e);
            }

            let doc = new DOMParser().parseFromString(xmlTemplate, 'application/xml');
            doc.getElementsByTagName('odsobrazek')[0].childNodes[0].data = jpgLogoFileContent;
            doc.getElementsByTagName('dataSoubor')[0].childNodes[0].data = attachmentContent;
            doc.getElementsByTagName('dataSoubor')[1].childNodes[0].data = testFileContent;

            doc.getElementsByTagName('odsfirma')[0].childNodes[0].data = letter.senderName;
            doc.getElementsByTagName('odsulice')[0].childNodes[0].data = letter.senderStreet;
            doc.getElementsByTagName('odscp')[0].childNodes[0].data = letter.senderHouseNumber;
            doc.getElementsByTagName('odsobec')[0].childNodes[0].data = letter.senderCity;
            doc.getElementsByTagName('odspsc')[0].childNodes[0].data = letter.senderZipCode;

            doc.getElementsByTagName('adrosoba')[0].childNodes[0].data = letter.destinationName;
            doc.getElementsByTagName('adrulice')[0].childNodes[0].data = letter.destinationStreet;
            doc.getElementsByTagName('adrcp')[0].childNodes[0].data = letter.destinationHouseNumber;
            doc.getElementsByTagName('adrobec')[0].childNodes[0].data = letter.destinationCity;
            doc.getElementsByTagName('adrpsc')[0].childNodes[0].data = letter.destinationZipCode;

            console.log('File content after modification: ');
            //console.log(doc.toString());
            res(doc.toString());
        } catch (e) {
            console.log("Error during xml post letter creation: " + e);
            rej(e);
        }
    });

module.exports = {
    readFile,
    readFileBase64,
    writeFile,
    prepareXmlWithData,
    deleteFile
};