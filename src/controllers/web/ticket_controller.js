import {sendRequest} from "../../services/post_service";
import {CREDENTIALS, PDF_EXTENSION} from "../../const";
import * as fs from "fs";

const POSTAL_TICKET_IDENTIFICATION = 'postal_ticket';
const PAGE_TITLE = 'Postal ticket';
const view = 'ticket';

export default class TicketController {

    showTickets(req, res, leftMenu) {
        res.render(view, {title: PAGE_TITLE, postal_number: '', menuName: leftMenu});
    }

    async sendTicketRequest(req, res, leftMenu) {
        console.log('Postal number request received');

        let postalNumber = req.body.postal_number;
        if (!postalNumber) {
            postalNumber = '';
        }
        const renderOptions = {
            title: PAGE_TITLE,
            postal_number: postalNumber, menuName: leftMenu
        };

        let responseData = await sendRequest(res, 'https://online3.postservis.cz/dopisonline/podlist.php', {
            ...CREDENTIALS,
            'podcislo': postalNumber,
            'typvystupu': 'D',
        }, POSTAL_TICKET_IDENTIFICATION, view, renderOptions);

        let file = fs.createWriteStream(postalNumber + PDF_EXTENSION);
        res.pipe(file);
        file.write(responseData.dataBuffer, () => {
            file.end();
            let fileToDownload = postalNumber + PDF_EXTENSION;
            //Makes no sense to write all the data file into the html page
            res.download(fileToDownload);
        });
    }
}