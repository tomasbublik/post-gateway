import express from 'express';
import LetterController from "../controllers/api/letter_controller";
import DatabaseService from "../services/db_service";
import {DATABASE_NAME} from "../const";

const router = express.Router();
const databaseService = new DatabaseService(DATABASE_NAME);
const letterController = new LetterController(databaseService);

router.get('/', function (req, res) {
    letterController.get(req, res);
});

router.post('/insert', async function (req, res) {
    await letterController.insert(req, res);
});

module.exports = router;