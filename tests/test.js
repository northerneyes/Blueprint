require('should');

describe('revenueProvider', function () {
    var revenueProvider = require('../app/shared/services/RevenueProvider');
    describe("#data()", function() {
        it('should return data correctly', function (done) {
            var item = revenueProvider.data()[0];
            item.date.should.equal('2015-01-01');
            item.value.should.equal(14);

            done();
        });
    });
});

describe('costsProvider', function () {
    var costsProvider = require('../app/shared/services/CostsProvider');
    describe("#data()", function() {
        it('should return data correctly', function (done) {
            var item = costsProvider.data()[0];
            item.date.should.equal('2015-01-01');
            item.value.should.equal(7);

            done();
        });
    });
});

describe('ProfitService', function () {
    var revenueProvider = require('../app/shared/services/RevenueProvider');
    var costsProvider = require('../app/shared/services/CostsProvider');
    var ProfitService = require('../app/shared/services/ProfitService');
    var profitService;

    beforeEach(function () {
        profitService = new ProfitService(revenueProvider, costsProvider);
    });

    describe("#merge(revenue, costs)", function() {
        it('should merge correctly (costs and revenue has same date)', function (done) {
            var items = profitService.merge(profitService.revenue, profitService.costs);
            var item = items[3];

            items.length.should.equal(11);

            item.date.should.equal('2015-01-04');
            item.revenue.should.equal(16);
            item.cost.should.equal(10);
            item.profit.should.equal(6);

            done();
        });

        it('should merge correctly (costs and revenue has not same date, cost is undefined)', function (done) {
            var items = profitService.merge(profitService.revenue, profitService.costs);

            var item = items[5];

            items.length.should.equal(11);

            item.date.should.equal('2015-01-08');
            item.revenue.should.equal(29);
            (item.cost === undefined).should.be.true;

            done();
        });
    });

    describe("#data()", function() {
        it('should return data correctly', function (done) {
            var items = profitService.data();
            var item = items[3];

            item.date.should.equal('2015-01-04');
            item.revenue.should.equal(16);
            item.cost.should.equal(10);
            item.profit.should.equal(6);

            done();
        });
    });

    describe("#filter(col)", function() {
        it('should filter by date correctly', function (done) {
            var items = profitService.filter('date');
            var first = items[0];
            var last = items[items.length - 1];

            items.length.should.equal(11);
            first.date.should.equal('2015-01-01');
            last.date.should.equal('2015-01-11');

            done();
        });

        it('should filter by cost correctly', function (done) {
            var items = profitService.filter('cost');
            var first = items[0];
            var last = items[items.length - 1];

            items.length.should.equal(11);
            first.cost.should.equal(7);
            last.revenue.should.equal(36);

            done();
        });
    });

});