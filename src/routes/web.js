import * as express from "express";
import WebController from "../controllers/web/web_controller";
import TicketController from "../controllers/web/ticket_controller";
import OverviewController from "../controllers/web/overview_controller";
import SendLetterController from "../controllers/web/send_letter_controller";
import WebLettersController from "../controllers/web/web_letters_controller";
import DatabaseService from "../services/db_service";
import { DATABASE_NAME } from "../const";
import LettersService from "../services/letters_service";

const router = express.Router();
const webController = new WebController();
const ticketController = new TicketController();
const overviewController = new OverviewController();
const databaseService = new DatabaseService(DATABASE_NAME);
const lettersService = new LettersService(databaseService);
const sendLetterController = new SendLetterController(lettersService);
const webLettersController = new WebLettersController(lettersService);

let lettersMenuName = 'letters-menu';
let statisticsMenuName = 'statistics-menu';

router.get('/index', function (req, res) {
    webController.showIndex(req, res, lettersMenuName);
});

router.get('/statistics', function (req, res) {
    webController.showStatistics(req, res, statisticsMenuName);
});

router.get('/overview', function (req, res) {
    overviewController.showOverviews(req, res, lettersMenuName);
});

router.post('/overview', async function (req, res) {
    await overviewController.sendOverviewRequest(req, res, lettersMenuName);
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

router.get('/letters', async function (req, res) {
    await webLettersController.showLetters(req, res, lettersMenuName)
});

router.get('/letter-detail/:letter_id', async function (req, res) {
    await webLettersController.showLetterDetail(req, res, req.params.letter_id, lettersMenuName)
});

module.exports = router;