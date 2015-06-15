var React = require('react');
var rd3 = require('react-d3');

var GridStore = require('../../grid/GridStore');

var LineChart = rd3.LineChart;

module.exports = React.createClass({
	getInitialState: function() {
		return {
			GridStore: GridStore,
			parentWidth: 0
		};
	},

	getDefaultProps: function() {
		return {
			width: '100%',
			height: 300
		};
	},

	handleResize: function(e) {
		var elem = React.findDOMNode(this);
		if (elem) {
			var width = elem.offsetWidth;

			this.setState({
				parentWidth: width
			});
		}
	},

	componentDidMount: function() {
		var events = 'add remove reset change';
		GridStore.on(events, function() {
			this.forceUpdate();
		}, this);

		if (this.props.width === '100%') {
			window.addEventListener('resize', this.handleResize);
		}
		this.handleResize();
	},

	componentWillUnmount: function() {
		GridStore.off(null, null, this);
	},

	render: function() {
		// let { width, height, margin, xScale, yScale, xAxis, ...props } = this.props;
		var width = this.props.width;
		if (width === '100%') {
			width = this.state.parentWidth || 400;
		}

		return ( < LineChart data = {
				this.state.GridStore.charts
			}
			width = {
				width
			}
			height = {
				400
			}
			fill = {
				'#3182bd'
			} > < /LineChart>	
		);
	}
});