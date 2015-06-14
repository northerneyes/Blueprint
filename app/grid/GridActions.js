var constants = require('./constants');
var dispatch = require('../shared/helpers/dispatch');

module.exports = {
    load: function () {
        var gridData = {
            cols: ['date', 'revenue', 'cost'],
            rows: [{
                date: '2015-01-01',
                revenue: 14,
                cost: 7
            }, {
                date: '2015-01-02',
                revenue: 21,
                cost: 11
            }, {
                date: '2015-01-03',
                revenue: 31,
                cost: 14
            }]
        };
        dispatch(constants.GRID_LOAD, {
            gridData: gridData
        });

    }
};
