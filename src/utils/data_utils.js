export default class DataUtils {

    static appendDateAndTypeToData(input, type) {
        let data = {
            table: []
        };
        data.table.push({date: new Date().toISOString(), type: type, data: input});
        return data;
    }
}