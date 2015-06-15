var constants = require('./constants');
var dispatch = require('../shared/helpers/dispatch');
var _ = require('lodash');

var revenueProvider = require('../shared/services/RevenueProvider');
var costsProvider = require('../shared/services/CostsProvider');
var ProfitService = require('../shared/services/ProfitService');



module.exports = {
    load: function() {
        this.profitService = new ProfitService(revenueProvider, costsProvider);
        var data = this.profitService.data();

        var gridData = {
            cols: ['date', 'revenue', 'cost', 'profit'],
            rows: data
        };

        var revenueValues = _.map(revenueProvider.data(), function(item) {
            return {
                x: new Date(item.date),
                y: item.value
            };
        });

        dispatch(constants.GRID_LOAD, {
            gridData: gridData,
            charts: [{
                name: 'revenue',
                values: revenueValues
            }]
        });
    },
    filter: function(col) {
        var gridData = {
            cols: ['date', 'revenue', 'cost', 'profit'],
            rows: this.profitService.filter(col)
        };

        dispatch(constants.GRID_FILTER, {
            gridData: gridData
        });
    }
};