var Backbone = require('backbone');

class RevenueProvider extends Backbone.Model {
    constructor() {
        this._data = [{
            date: "2015-01-01",
            value: 14
        }, {
            date: "2015-01-02",
            value: 21
        }, {
            date: "2015-01-03",
            value: 31
        }, {
            date: "2015-01-04",
            value: 16
        }, {
            date: "2015-01-05",
            value: 18
        }, {
            date: "2015-01-08",
            value: 29
        }, {
            date: "2015-01-09",
            value: 36
        }, {
            date: "2015-01-10",
            value: 42
        }, {
            date: "2015-01-11",
            value: 33
        }];
        super();
    }

    data() {
        return this._data;
    }
}

module.exports = new RevenueProvider();