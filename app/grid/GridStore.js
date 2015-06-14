var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var Store = require('../shared/libs/Store');

class GridModel extends Store.Model {
    constructor() {
        this.cols = ['date', 'revenue', 'cost'];
        this.rows = [
            { date: '2015-01-01', revenue: 14, cost: 7 },
            { date: '2015-01-02', revenue: 21, cost: 11 },
            { date: '2015-01-03', revenue: 31, cost: 14}
        ];
        super();
    }

    initialize() {
        super();
    }

    handleDispatch(/*payload*/) {

    }
}

module.exports = new GridModel();
