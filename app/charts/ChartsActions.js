var constants = require('./constants');
var dispatch = require('../shared/helpers/dispatch');
var _ = require('lodash');

var revenueProvider = require('../shared/services/RevenueProvider');
var costsProvider = require('../shared/services/CostsProvider');
var ProfitService = require('../shared/services/ProfitService');

module.exports = {
    load: function() {
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
        var charts = [{
            name: 'revenue',
            values: revenueValues,
            color: '#009688'
        }, {
            name: 'costs',
            values: costsValues,
            color: '#F44336'
        }, {
            name: 'profit',
            values: profitValues,
            color: '#2196F3'
        }];

        var colors = _.map(charts, function (chart) {
            return chart.color;
        });

        dispatch(constants.CHARTS_LOAD, {
            charts: charts,
            chartsColors: colors
        });
    }
};
