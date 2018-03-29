import express from 'express';
import LetterController from "../controllers/api/letter_controller";
import DatabaseService from "../services/db_service";
import LetterService from "../services/letters_service";
import {DATABASE_NAME} from "../const";

const router = express.Router();
const databaseService = new DatabaseService(DATABASE_NAME);
const letterService = new LetterService(databaseService);
const letterController = new LetterController(databaseService, letterService);

router.get('/insert', function (req, res) {
    LetterController.get(req, res);
});

router.post('/insert', async function (req, res) {
    await letterController.insert(req, res);
});

router.get('/check-state/:external_id', async function (req, res) {
    await letterController.checkState(req, res, req.params.external_id);
});

module.exports = router;