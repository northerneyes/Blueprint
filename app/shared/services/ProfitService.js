var Backbone = require('backbone');
var _ = require('lodash');

// _(revenue.concat(costs)).groupBy(function (p) {
//  return p.date
// }).map(function (value, key) {
//  return {
//      date: key,
//      revenue: value[0].value,
//      costs: value[1] ? value[1].value : '-'
//  };
// }).value();

class ProfitService extends Backbone.Model {
    constructor(revenueProvider, costsProvider) {
        this.revenueProvider = revenueProvider;
        this.costsProvider = costsProvider;

        this.revenue = _(this.revenueProvider.data()).map(function(r) {
            return {
                date: r.date,
                revenue: r.value
            };
        }).value();

        this.costs = _(this.costsProvider.data()).map(function(r) {
            return {
                date: r.date,
                cost: r.value
            };
        }).value();

        this._data = this.merge(this.revenue, this.costs);
        super();
    }

    merge(revenue, costs) {
        var that = this;
        var result = _(revenue.concat(costs)).groupBy(function(p) {
                return p.date;
            })
            .map(function(values, key) {
                var value = that.mergeFunc(values);
                var profit = value.revenue - value.cost;
                return _.extend(value, {
                    date: key,
                    profit: profit
                });
            }).value();
        return result;
    }

    mergeFunc(items) {
        // Custom merge function ORs together non-object values, recursively
        // calls itself on Objects.
        var merger = function(a, b) {
            if (_.isObject(a)) {
                return _.merge({}, a, b, merger);
            } else {
                return a || b;
            }
        };

        // Allow roles to be passed to _.merge as an array of arbitrary length
        var args = _.flatten([{}, items, merger]);
        return _.merge.apply(_, args);
    }

    data() {
        return this._data;
    }

    filter(col){
        return _.sortBy(this._data, col);
    }
}

module.exports = ProfitService;