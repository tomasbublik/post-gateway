export default class Order {

    constructor(id,
                letterId,
                state,
                payoutType,
                printType,
                c4Envelope,
                voucherType,
                orderCode,
                ticketNumber,
                postNumber,
                orderDate,
                price,
                listsNumber,
                pagesNumber,
                xmlFileName,
                files) {
        this.id = id;
        this.letterId = letterId;
        this.state = state;
        this.payoutType = payoutType;
        this.printType = printType;
        this.c4Envelope = c4Envelope;
        this.voucherType = voucherType;
        this.orderCode = orderCode;
        this.ticketNumber = ticketNumber;
        this.postNumber = postNumber;
        this.orderDate = orderDate;
        this.price = price;
        this.listsNumber = listsNumber;
        this.pagesNumber = pagesNumber;
        this.xmlFileName = xmlFileName;
        this.files = files;
    }
}