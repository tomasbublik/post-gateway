import mongo from 'mongodb';
import xml2js from 'xml2js';
import Order from "../models/order";
import OrderFile from "../models/file";
import {PAYROLL_TYPO} from "../const";

const ObjectId = mongo.ObjectID;
let parseString = xml2js.parseString;

export default class OrdersService {

    constructor(databaseService) {
        this.databaseService = databaseService;
    }

    async createOrderFromXml(xmlOrder) {
        if (xmlOrder != null) {
            return new Promise(function (resolve, reject) {
                parseString(xmlOrder, function (err, result) {
                    if (err != null) {
                        reject(err);
                    }
                    console.log(result);

                    let files = [];
                    let zakazka = result.zakazka;
                    for (let s of zakazka.soubory[0].soubor) {
                        console.log(s);
                        let file = new OrderFile(
                            s.$.name,
                            s.pozice[0],
                            s.typtisku[0],
                            s.pocet_stranek[0]
                        );
                        files.push(file);
                    }
                    resolve(new Order(
                        0, 0,
                        zakazka.chyby[0].$.stav,
                        getPayrollTypeFromCode(zakazka.typvyplatneho[0]),
                        zakazka.typtisku[0],
                        zakazka.obalkac4[0],
                        zakazka.tiskpoukazky[0],
                        zakazka.kod_objednavky[0],
                        zakazka.podaci_cislo[0],
                        zakazka.podaci_posta[0],
                        new Date(zakazka.datum_podani[0]),
                        zakazka.cena[0],
                        zakazka.pocet_listu[0],
                        zakazka.pocet_stranek[0],
                        zakazka.xmlsoubor[0],
                        files
                    ));
                });
            });
        }
    }
}

function getPayrollTypeFromCode(code) {
    return PAYROLL_TYPO.get(code);
}