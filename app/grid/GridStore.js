var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var Store = require('../shared/libs/Store');
var constants = require('./constants');

class GridModel extends Store.Model {
    constructor() {
        this.cols = [];
        this.rows = [];
        super();
    }

    initialize() {
        super();
    }

    handleDispatch(payload) {
        switch (payload.actionType) {
            case constants.GRID_LOAD:
            {
                this.cols = payload.gridData.cols;
                this.rows = payload.gridData.rows;
                break;
            }

        }
    }
}

module.exports = new GridModel();
