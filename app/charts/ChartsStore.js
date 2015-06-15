var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var Store = require('../shared/libs/Store');
var constants = require('./constants');

class ChartsModel extends Store.Model {
    constructor() {
        this.charts = [];
        this.chartsColors = function() {
            return null;
        };
        super();
    }

    initialize() {
        super();
    }

    handleDispatch(payload) {
        switch (payload.actionType) {
            case constants.CHARTS_LOAD:
                this.charts = payload.charts;
                this.chartsColors = function(idx) {
                    return payload.chartsColors[idx];
                };
                break;
        }
    }
}

module.exports = new ChartsModel();
