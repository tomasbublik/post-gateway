import * as express from "express";
import WebController from "../controllers/web_controller";

const router = express.Router();
const webController = new WebController();

router.get('/index', function (req, res) {
    webController.showIndex(req, res);
});

module.exports = router;