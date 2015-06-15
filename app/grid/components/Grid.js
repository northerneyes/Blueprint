var React = require('react');

var storeMixin = require('../../shared/helpers/storeMixin');
var GridStore = require('../GridStore');
var GridRow = require('./GridRow');
var GridActions = require('../GridActions');

module.exports = React.createClass({
	mixins: [storeMixin(GridStore)],

	getInitialState: function() {
		return { GridStore: GridStore };
	},

	componentWillReceiveProps: function() {
       GridActions.load();
    },
    handleSort: function (argument) {
    	alert('click' + argument);
    },

	render: function () {
		return (
				<table>
					<thead>
						<tr>
						{this.state.GridStore.cols.map((col)=>
								<th><span onClick={this.handleSort}>{col} <i className="fa fa-sort"></i></span></th>
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

