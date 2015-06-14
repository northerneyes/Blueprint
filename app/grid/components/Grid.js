var React = require('react');

var storeMixin = require('../../shared/helpers/storeMixin');
var GridStore = require('../GridStore');
var GridRow = require('./GridRow');
var GridActions = require('../GridActions');

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
	mixins: [storeMixin(GridStore)],

	getInitialState: function() {
		return { GridStore: GridStore };
	},

	componentWillReceiveProps: function() {
       GridActions.load();
    },

	render: function () {
		return (
				<table>
					<thead>
						<tr>
						{this.state.GridStore.cols.map((col)=>
								<th>{col}</th>
						)}
						</tr>
					</thead>
					<tbody>
						{this.state.GridStore.rows.map((row)=>
								<GridRow row={row} cols={this.state.GridStore.cols} />
						)}
					</tbody>
				</table>
			);
	}
});

