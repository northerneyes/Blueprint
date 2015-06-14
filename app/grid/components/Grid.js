var React = require('react');
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
module.exports = React.createClass({
	render: function () {
		return (
			<div className="main">
				<div className="grid">
					This is Grid
				</div>
			</div>);
	}
});
