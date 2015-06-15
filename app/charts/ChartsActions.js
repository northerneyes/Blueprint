var constants = require('./constants');
var dispatch = require('../shared/helpers/dispatch');
var _ = require('lodash');

var revenueProvider = require('../shared/services/RevenueProvider');
var costsProvider = require('../shared/services/CostsProvider');
var ProfitService = require('../shared/services/ProfitService');

module.exports = {
    load: function() {
        // this.profitService = new ProfitService(revenueProvider, costsProvider);
        // var data = this.profitService.data();

        var revenueValues = _.map(revenueProvider.data(), function(item) {
            return {
                x: new Date(item.date),
                y: item.value
            };
        });

        var costsValues = _.map(costsProvider.data(), function(item) {
            return {
                x: new Date(item.date),
                y: item.value
            };
        });

        this.profitService = new ProfitService(revenueProvider, costsProvider);
        var profitValues = _.filter(this.profitService.data(), function(p) {
            return p.profit;
        }).map(function(item) {
            return {
                x: new Date(item.date),
                y: item.profit
            };
        });

        dispatch(constants.CHARTS_LOAD, {
            charts: [{
                name: 'revenue',
                values: revenueValues
            }, {
                name: 'costs',
                values: costsValues
            }, {
                name: 'profit',
                values: profitValues
            }],
            chartsColors: [
                '#009688',
                '#F44336',
                '#2196F3'
            ]
        });
    }
};