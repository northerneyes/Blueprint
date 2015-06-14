var constants = require('./constants');
var dispatch = require('../shared/helpers/dispatch');

// _(revenue.concat(costs)).groupBy(function (p) {
// 	return p.date
// }).map(function (value, key) {
// 	return {
// 		date: key,
// 		revenue: value[0].value,
// 		costs: value[1] ? value[1].value : '-'
// 	};
// }).value();

//получился пропуск значения
// _.merge(revenue, costs, function(r, c){ return  {date: r.date, revenue: r.value, cost: c.value }  });

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
