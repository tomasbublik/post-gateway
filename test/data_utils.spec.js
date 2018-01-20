import DataUtils from "../src/utils/data_utils";

/*// Import chai.
let chai = require('chai'),
    path = require('path');

// Tell chai that we'll be using the "should" style assertions.
chai.should();*/

describe('DataUtils', () => {
    describe('#appendDateAndTypeToData', () => {

        it('appends data to given JSON', () => {
            let enhancedData = DataUtils.appendDateAndTypeToData({testName: 'some_data'}, 'some_type');
            assertData(enhancedData);
        });

    });
});

function assertData(data) {
    /*assert(response);
    assert(response.stan);
    assert.equal(response.responseCode, "000");*/
    assert(data != null);
    assert(data.table[0].type != null);
    assert(data.table[0].date != null);
}
