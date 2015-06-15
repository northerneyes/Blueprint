var React = require('react');
var rd3 = require('react-d3');

var ChartsStore = require('../ChartsStore');
var ChartsActions = require('../ChartsActions');

var LineChart = rd3.LineChart;

module.exports = React.createClass({
	propTypes: {
		width: React.PropTypes.string
	},

	getInitialState: function() {
		return {
			ChartsStore: ChartsStore,
			parentWidth: 0
		};
	},

	getDefaultProps: function() {
		return {
			width: '100%',
			height: 300
		};
	},

	handleResize: function() {
		var elem = React.findDOMNode(this);
		if (elem) {
			var width = elem.parentNode.offsetWidth;

			this.setState({
				parentWidth: width
			});
		}
	},

	componentDidMount: function() {
		var events = 'add remove reset change';
		ChartsStore.on(events, function() {
			this.forceUpdate();
		}, this);
		ChartsActions.load();

		if (this.props.width === '100%') {
			window.addEventListener('resize', this.handleResize);
		}
		this.handleResize();
	},

	componentWillUnmount: function() {
		ChartsStore.off(null, null, this);
	},

	render: function() {
		// let { width, height, margin, xScale, yScale, xAxis, ...props } = this.props;
		var width = this.props.width;
		if (width === '100%') {
			width = this.state.parentWidth || 400;
		}

		return ( <LineChart
			legend={true}
			data = {this.state.ChartsStore.charts}
			width = {width}
			height = {400}
			colors = {this.state.ChartsStore.chartsColors}
			/>
		);
	}
});
