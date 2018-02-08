"use strict";

import DatabaseService from "../src/services/db_service";
import {DATABASE_CONNECTION_URL, TEST_DATABASE_NAME} from "../src/const";
import db from "../src/services/db";

let databaseService = new DatabaseService(TEST_DATABASE_NAME);
import OrdersService from '../src/services/orders_service';
import * as assert from "assert";

let ordersService = new OrdersService(databaseService);

const orderXml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
    "<zakazka>\n" +
    "  <chyby stav=\"0\"></chyby>\n" +
    "  <typvyplatneho>169</typvyplatneho>\n" +
    "  <typtisku>0</typtisku>\n" +
    "  <obalkac4>0</obalkac4>\n" +
    "  <tiskpoukazky>0</tiskpoukazky>\n" +
    "  <kod_objednavky>20180207150228_30014</kod_objednavky>\n" +
    "  <podaci_cislo>RR2590145705F</podaci_cislo>\n" +
    "  <podaci_posta>370 20</podaci_posta>\n" +
    "  <datum_podani>2018-02-07</datum_podani>\n" +
    "  <cena>31.32 Kč</cena>\n" +
    "  <pocet_listu>2</pocet_listu>\n" +
    "  <pocet_stranek>3</pocet_stranek>\n" +
    "  <xmlsoubor>first_letter.xml</xmlsoubor>\n" +
    "  <soubory>\n" +
    "    <soubor name=\"test.pdf\">\n" +
    "      <pozice>1</pozice>\n" +
    "      <pocet_stranek>2</pocet_stranek>\n" +
    "      <typtisku>0</typtisku>\n" +
    "    </soubor>\n" +
    "    <soubor name=\"atachment.pdf\">\n" +
    "      <pozice>2</pozice>\n" +
    "      <pocet_stranek>1</pocet_stranek>\n" +
    "      <typtisku>0</typtisku>\n" +
    "    </soubor>\n" +
    "  </soubory>\n" +
    "</zakazka>";

describe('OrdersService', () => {

    describe('orders creation: ', () => {
        it('should create not null Order object when xml is given', async () => {
            let order = await ordersService.createOrderFromXml(orderXml);

            expect(order).not.to.be.null;
            expect(order).not.to.be.undefined;
        });

        it('should match the Order with xml object when xml is given', async () => {
            let order = await ordersService.createOrderFromXml(orderXml);

            expect(order.state).to.equal("0");
            expect(order.payoutType).to.equal("169");
            expect(order.printType).to.equal("0");
            expect(order.c4Envelope).to.equal("0");
            expect(order.voucherType).to.equal("0");
            expect(order.orderCode).to.equal("20180207150228_30014");
            expect(order.ticketNumber).to.equal("RR2590145705F");
            expect(order.postNumber).to.equal("370 20");
            expect(order.orderDate).to.equalDate(new Date(2018, 1, 7));
        });
    });
});