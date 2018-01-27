export default class WebController {

    showIndex(req, res, leftMenu) {
        res.render('index', {title: 'This will be the new index', menuName: leftMenu
        })
    }

    showStatistics(req, res, leftMenu) {
        res.render('index', {title: 'This will be the new index', menuName: leftMenu
        })
    }
}