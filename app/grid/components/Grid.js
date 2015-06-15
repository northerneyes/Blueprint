var React = require('react');

var GridStore = require('../GridStore');
var GridRow = require('./GridRow');
var GridActions = require('../GridActions');

module.exports = React.createClass({
	getInitialState: function() {
		return {
			GridStore: GridStore
		};
	},

	componentDidMount: function() {
		var events = 'add remove reset change';
		GridStore.on(events, function() {
			this.forceUpdate();
		}, this);
		GridActions.load();
	},

	componentWillUnmount: function() {
		GridStore.off(null, null, this);
	},

    handleSort: function (col) {
		GridActions.filter(col);
    },

	render: function () {
		return (
				<table>
					<thead>
						<tr>
						{this.state.GridStore.cols.map((col)=>
								<th>
									<span onClick={this.handleSort.bind(this, col)}>
										{col} <i className="fa fa-sort"></i>
									</span>
								</th>
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

