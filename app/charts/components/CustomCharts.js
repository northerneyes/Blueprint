var React = require('react');

var ChartsStore = require('../ChartsStore');
var ChartsActions = require('../ChartsActions');

var _ = require('lodash');
var d3 = require('d3');

var Chart = React.createClass({
    propTypes: {
        width: React.PropTypes.string,
        height: React.PropTypes.string,
        children: React.PropTypes.array
    },

    render: function() {
        return (
            <svg width={this.props.width} height={this.props.height}>{this.props.children}</svg>
        );
    }
});

var Line = React.createClass({
    propTypes: {
        color: React.PropTypes.string,
        path: React.PropTypes.string,
        width: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            path: '',
            color: 'blue',
            width: 2
        };
    },

    render: function() {
        return (
            <path d={this.props.path} stroke={this.props.color} strokeWidth={this.props.width} fill="none" />
        );
    }
});

var DataSeries = React.createClass({
    propTypes: {
        interpolate: React.PropTypes.string,
        data: React.PropTypes.array,
        color: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            title: '',
            data: [],
            interpolate: 'linear'
        };
    },

    render: function() {
        var props = this.props,
            yScale = props.yScale,
            xScale = props.xScale;

        var path = d3.svg.line()
            .x(function(d) { return xScale(d.x); })
            .y(function(d) { return yScale(d.y); })
            .interpolate(this.props.interpolate);

        return (
            <Line path={path(this.props.data)} color={this.props.color} />
        );
    }
});

var LineChart = React.createClass({
    propTypes: {
        width: React.PropTypes.string,
        height: React.PropTypes.string,
        data: React.PropTypes.array
    },

    getDefaultProps: function() {
        return {
            width: 600,
            height: 300
        };
    },

    render: function() {
        var data = this.props.data,
            size = { width: this.props.width, height: this.props.height };

        var max = _(data).map(function(item){
            return _.reduce(item.values, function(memo, value) {
                return Math.max(memo, value.y);
            }, 0);
        })
        .max()
        .value();

        var xScale = d3.time.scale()
            .domain([new Date('2015-01-01'), new Date('2015-01-11')])
            .range([0, this.props.width]);

        var yScale = d3.scale.linear()
            .domain([0, max])
            .range([this.props.height, 0]);



        return (
            <Chart width={this.props.width} height={this.props.height}>
                 {data.map((chart)=>
                        <DataSeries data={chart.values} size={size} xScale={xScale}
                             yScale={yScale} ref={chart.name} color={chart.color}/>
                 )}
            </Chart>
        );
    }
});

var Legend = React.createClass({
    propTypes: {
        data: React.PropTypes.array
    },

    render: function() {
        var data = this.props.data;

        var ulStyle = {
            'word-wrap': 'break-word',
            'width': '190px'
        };

        var liStyleGen = function (color) {
            return {
                'color': color,
                'line-height': '115%',
                'font-size': '150%;'
            };
        };

        return (
            <ul style={ulStyle}>
             {data.map((chart)=>
                        <li style={liStyleGen(chart.color)}><span>{chart.name}</span></li>
                 )}
            </ul>
        );
     }
});

module.exports = React.createClass({
    propTypes: {
        width: React.PropTypes.string
    },

    getInitialState: function () {
        return {
            ChartsStore: ChartsStore,
            parentWidth: 0
        };
    },

    getDefaultProps: function () {
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
        var width = this.props.width;
        if (width === '100%') {
            width = this.state.parentWidth || 400;
        }
        return (
            <div>
                <Legend data={this.state.ChartsStore.charts}/>
                <LineChart
                    data={this.state.ChartsStore.charts}
                    width = {width}
                    height = {400}
                />
            </div>);
    }
});
