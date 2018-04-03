import multiparty from 'multiparty';
import toString from 'stream-to-string';
import toArray from 'stream-to-array';

let form;

export default class MultiPartFormParser {

    constructor(req) {
        this.req = req;
        this._letter = null;
        this._fileData = null;
    }

    async parseRequest() {
        let request = this.req;
        let letter = this.letter;
        let fileData = this.fileData;
        form = new multiparty.Form();
        return new Promise(function (resolve, reject) {
            // Parts are emitted when parsing the form
            form.on('part', function (part) {
                // You *must* act on the part by reading it
                // NOTE: if you want to ignore it, just call "part.resume()"

                if (!part.filename) {
                    // filename is not defined when this is a field and not a file
                    console.log('got field named ' + part.name);
                    if (part.name === 'letter') {
                        toString(part).then((msg) => {
                            letter = msg;
                            part.resume();
                        });
                    }
                }

                if (part.filename) {
                    // filename is defined when this is a file
                    console.log('got file named from field ' + part.name);
                    toArray(part).then((data) => {
                        fileData = data;
                    });
                    part.resume();
                }

                part.on('error', function (err) {
                    console.log('Error occurred: ' + err);
                    reject(err);
                });
            });
            // Close emitted after form parsed
            form.on('close', function () {
                console.log('Parsing completed!');
                resolve("OK");
            });
            // Parse req
            form.parse(request);
        }).then(
            (result) => {
                this.letter = letter;
                this.fileData = Buffer.concat(fileData);
                return result;
            }).catch((error) => {
            return error;
        });
    }

    get letter() {
        return this._letter;
    }

    set letter(value) {
        this._letter = value;
    }

    get fileData() {
        return this._fileData;
    }

    set fileData(value) {
        this._fileData = value;
    }
}