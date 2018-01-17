import { saveLetter } from '../services/db_service';
import { react } from 'babel-types';

const express = require('express');
var router = express.Router();

const PAGE_TITLE = 'Insert letter page';
const view = 'insert_letter';

router.get('/', function (req, res, next) {
  res.render(view, {title: PAGE_TITLE});
});

router.post('/', async function (req, res) {
    console.log('Insert letter request received');
    
    await saveLetter(req.body.letter);

    console.log('About to show the screen');
    res.render(view, { title: PAGE_TITLE });
  });

module.exports = router;
