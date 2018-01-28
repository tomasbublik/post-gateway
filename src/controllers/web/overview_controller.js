import {CREDENTIALS} from "../../const";
import {sendRequest} from "../../services/post_service";

const DELIVERIES_IDENTIFICATION = 'deliveries_overview';
const view = 'overviews';
const PAGE_TITLE = 'Deliveries overview';

export default class OverviewController {

    showOverviews(req, res, leftMenu) {
        res.render(view, {title: PAGE_TITLE, date: getCurrentDateFormatted(), delivery_number: '', menuName: leftMenu});
    }

    async sendOverviewRequest(req, res, leftMenu) {

        console.log('Delivery request received');

        let deliveryNumber = req.body.delivery_number;
        if (!deliveryNumber) {
            deliveryNumber = '';
        }
        const renderOptions = {
            title: 'This is the letters overview page',
            date: req.body.date,
            delivery_number: deliveryNumber,
            menuName: leftMenu
        };

        let responseData = await sendRequest(res, 'https://online3.postservis.cz/dopisonline/donPrehledZak.php', {
            ...CREDENTIALS,
            'zasilka': deliveryNumber,
            'datum': req.body.date
        }, DELIVERIES_IDENTIFICATION, view, renderOptions);

        res.render(view, responseData);
    }
}

function getCurrentDateFormatted() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!

    const yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + mm + dd;
}
