import * as express from "express";
import WebController from "../controllers/web/web_controller";
import TicketController from "../controllers/web/ticket_controller";
import OverviewController from "../controllers/web/overview_controller";
import SendLetterController from "../controllers/web/send_letter_controller";

const router = express.Router();
const webController = new WebController();
const ticketController = new TicketController();
const overviewController = new OverviewController();
const sendLetterController = new SendLetterController();
let lettersMenuName = 'letters-menu';
let statisticsMenuName = 'statistics-menu';

router.get('/index', function (req, res) {
    webController.showIndex(req, res, lettersMenuName);
});

router.get('/statistics', function (req, res) {
    webController.showStatistics(req, res, statisticsMenuName);
});

router.get('/letters', function (req, res) {
    overviewController.showLetters(req, res, lettersMenuName);
});

router.post('/letters', async function (req, res) {
    await overviewController.sendLettersRequest(req, res, lettersMenuName);
});

router.post('/ticket', async function (req, res) {
    await ticketController.sendTicketRequest(req, res, lettersMenuName);
});

router.get('/ticket', function (req, res) {
    ticketController.showTickets(req, res, lettersMenuName)
});

router.post('/send-letter', async function (req, res) {
    await sendLetterController.sendLetter(req, res, lettersMenuName);
});

router.get('/send-letter', function (req, res) {
    sendLetterController.showPage(req, res, lettersMenuName)
});

module.exports = router;