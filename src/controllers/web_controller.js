export default class WebController {

    showIndex(req, res) {
        //res.status(403).send({status: 'ERROR', msg: 'Failed to process index'});
        res.render('index', {title: 'This will be the new index'})
    }
}