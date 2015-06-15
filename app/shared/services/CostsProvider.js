var Backbone = require('backbone');

class CostsProvider extends Backbone.Model {
    constructor() {
        this._data = [{
            date: "2015-01-01",
            value: 7
        }, {
            date: "2015-01-02",
            value: 11
        }, {
            date: "2015-01-03",
            value: 14
        }, {
            date: "2015-01-04",
            value: 10
        }, {
            date: "2015-01-05",
            value: 8
        }, {
            date: "2015-01-06",
            value: 15
        }, {
            date: "2015-01-07",
            value: 16
        }, {
            date: "2015-01-10",
            value: 19
        }, {
            date: "2015-01-11",
            value: 16
        }];
        super();
    }

    data() {
        return this._data;
    }
}

module.exports = new CostsProvider();