export default class Letter {

    constructor(id,
                externalId,
                senderName,
                senderStreet,
                senderHouseNumber,
                senderCity,
                senderZipCode,
                destinationName,
                destinationStreet,
                destinationHouseNumber,
                destinationCity,
                destinationZipCode,
                dateCreated,
                state) {
        this.id = id;
        this.externalId = externalId;
        this.senderName = senderName;
        this.senderStreet = senderStreet;
        this.senderHouseNumber = senderHouseNumber;
        this.senderCity = senderCity;
        this.senderZipCode = senderZipCode;
        this.destinationName = destinationName;
        this.destinationStreet = destinationStreet;
        this.destinationHouseNumber = destinationHouseNumber;
        this.destinationCity = destinationCity;
        this.destinationZipCode = destinationZipCode;
        this.dateCreated = dateCreated;
        this.state = state;
    }
}