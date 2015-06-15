(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var React = require('react');
var App = require('./app/components/App');

React.render(React.createElement(App, null), document.getElementById('app'));


},{"./app/components/App":2,"react":"react"}],2:[function(require,module,exports){
var React = require('react');

var Header = require('./Header');
var Router = require('../../router/components/Router');

module.exports = React.createClass({displayName: "exports",
    render: function() {
        return (React.createElement("div", {className: "container"}, 
            React.createElement(Header, null), 
            React.createElement(Router, null)
        )
        );
    }
});


},{"../../router/components/Router":16,"./Header":3,"react":"react"}],3:[function(require,module,exports){
var React = require('react');
var RouterLink = require('../../router/components/RouterLink');

module.exports = React.createClass({displayName: "exports",
    render: function() {
        return (React.createElement("header", null, 
            React.createElement("h1", null, "Data Visualization"), 
            React.createElement("nav", {className: "navbar"}, 
                React.createElement(RouterLink, {href: "grid"}, "Grid"), 
                React.createElement(RouterLink, {href: "charts"}, "Charts"), 
                React.createElement(RouterLink, {href: "customcharts"}, "Custom Charts")
            )
        )
        );
    }
});


},{"../../router/components/RouterLink":17,"react":"react"}],4:[function(require,module,exports){
var constants = require('./constants');
var dispatch = require('../shared/helpers/dispatch');
var _ = require('lodash');

var revenueProvider = require('../shared/services/RevenueProvider');
var costsProvider = require('../shared/services/CostsProvider');
var ProfitService = require('../shared/services/ProfitService');

module.exports = {
    load: function() {
        var revenueValues = _.map(revenueProvider.data(), function(item) {
            return {
                x: new Date(item.date),
                y: item.value
            };
        });

        var costsValues = _.map(costsProvider.data(), function(item) {
            return {
                x: new Date(item.date),
                y: item.value
            };
        });

        this.profitService = new ProfitService(revenueProvider, costsProvider);
        var profitValues = _.filter(this.profitService.data(), function(p) {
            return p.profit;
        }).map(function(item) {
            return {
                x: new Date(item.date),
                y: item.profit
            };
        });
        var charts = [{
            name: 'revenue',
            values: revenueValues,
            color: '#009688'
        }, {
            name: 'costs',
            values: costsValues,
            color: '#F44336'
        }, {
            name: 'profit',
            values: profitValues,
            color: '#2196F3'
        }];

        var colors = _.map(charts, function (chart) {
            return chart.color;
        });

        dispatch(constants.CHARTS_LOAD, {
            charts: charts,
            chartsColors: colors
        });
    }
};


},{"../shared/helpers/dispatch":21,"../shared/services/CostsProvider":24,"../shared/services/ProfitService":25,"../shared/services/RevenueProvider":26,"./constants":8,"lodash":"lodash"}],5:[function(require,module,exports){
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var Store = require('../shared/libs/Store');
var constants = require('./constants');

var ____Class3=Store.Model;for(var ____Class3____Key in ____Class3){if(____Class3.hasOwnProperty(____Class3____Key)){ChartsModel[____Class3____Key]=____Class3[____Class3____Key];}}var ____SuperProtoOf____Class3=____Class3===null?null:____Class3.prototype;ChartsModel.prototype=Object.create(____SuperProtoOf____Class3);ChartsModel.prototype.constructor=ChartsModel;ChartsModel.__superConstructor__=____Class3;
    function ChartsModel() {"use strict";
        ____Class3.call(this);
        this.charts = [];
        this.chartsColors = function() {
            return null;
        };

    }

    Object.defineProperty(ChartsModel.prototype,"initialize",{writable:true,configurable:true,value:function() {"use strict";
        ____SuperProtoOf____Class3.initialize.call(this);
    }});

    Object.defineProperty(ChartsModel.prototype,"handleDispatch",{writable:true,configurable:true,value:function(payload) {"use strict";
        switch (payload.actionType) {
            case constants.CHARTS_LOAD:
                this.charts = payload.charts;
                this.chartsColors = function(idx) {
                    return payload.chartsColors[idx];
                };
                break;
        }
    }});


module.exports = new ChartsModel();


},{"../shared/libs/Store":23,"./constants":8,"backbone":"backbone","jquery":"jquery"}],6:[function(require,module,exports){
var React = require('react');
var rd3 = require('react-d3');

var ChartsStore = require('../ChartsStore');
var ChartsActions = require('../ChartsActions');

var LineChart = rd3.LineChart;

module.exports = React.createClass({displayName: "exports",
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
		var width = this.props.width;
		if (width === '100%') {
			width = this.state.parentWidth || 400;
		}

		return ( React.createElement(LineChart, {
			legend: true, 
			data: this.state.ChartsStore.charts, 
			width: width, 
			height: 400, 
			colors: this.state.ChartsStore.chartsColors}
			)
		);
	}
});


},{"../ChartsActions":4,"../ChartsStore":5,"react":"react","react-d3":"react-d3"}],7:[function(require,module,exports){
var React = require('react');

var ChartsStore = require('../ChartsStore');
var ChartsActions = require('../ChartsActions');

var _ = require('lodash');
var d3 = require('d3');

var Chart = React.createClass({displayName: "Chart",
    propTypes: {
        width: React.PropTypes.string,
        height: React.PropTypes.string,
        children: React.PropTypes.array
    },

    render: function() {
        return (
            React.createElement("svg", {width: this.props.width, height: this.props.height}, this.props.children)
        );
    }
});

var Line = React.createClass({displayName: "Line",
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
            React.createElement("path", {d: this.props.path, stroke: this.props.color, strokeWidth: this.props.width, fill: "none"})
        );
    }
});

var DataSeries = React.createClass({displayName: "DataSeries",
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
            React.createElement(Line, {path: path(this.props.data), color: this.props.color})
        );
    }
});

var LineChart = React.createClass({displayName: "LineChart",
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
            React.createElement(Chart, {width: this.props.width, height: this.props.height}, 
                 data.map(function(chart)
                        {return React.createElement(DataSeries, {data: chart.values, size: size, xScale: xScale, 
                             yScale: yScale, ref: chart.name, color: chart.color});}
                 )
            )
        );
    }
});

var Legend = React.createClass({displayName: "Legend",
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
                'line-height': '100%',
                'font-size': '150%;'
            };
        };

        return (
            React.createElement("ul", {style: ulStyle}, 
             data.map(function(chart)
                        {return React.createElement("li", {style: liStyleGen(chart.color)}, React.createElement("span", null, chart.name));}
                 )
            )
        );
     }
});

module.exports = React.createClass({displayName: "exports",
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
            React.createElement("div", null, 
                React.createElement(Legend, {data: this.state.ChartsStore.charts}), 
                React.createElement(LineChart, {
                    data: this.state.ChartsStore.charts, 
                    width: width, 
                    height: 400}
                )
            ));
    }
});


},{"../ChartsActions":4,"../ChartsStore":5,"d3":"d3","lodash":"lodash","react":"react"}],8:[function(require,module,exports){
module.exports = {
    CHARTS_LOAD: 'CHARTS_LOAD'
};


},{}],9:[function(require,module,exports){
var constants = require('./constants');
var dispatch = require('../shared/helpers/dispatch');

var revenueProvider = require('../shared/services/RevenueProvider');
var costsProvider = require('../shared/services/CostsProvider');
var ProfitService = require('../shared/services/ProfitService');

module.exports = {
    load: function() {
        this.profitService = new ProfitService(revenueProvider, costsProvider);
        var data = this.profitService.data();

        var gridData = {
            cols: ['date', 'revenue', 'cost', 'profit'],
            rows: data
        };

        dispatch(constants.GRID_LOAD, {
            gridData: gridData
        });
    },
    filter: function(col) {
        var gridData = {
            cols: ['date', 'revenue', 'cost', 'profit'],
            rows: this.profitService.filter(col)
        };

        dispatch(constants.GRID_FILTER, {
            gridData: gridData
        });
    }
};


},{"../shared/helpers/dispatch":21,"../shared/services/CostsProvider":24,"../shared/services/ProfitService":25,"../shared/services/RevenueProvider":26,"./constants":13}],10:[function(require,module,exports){
var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;

var Store = require('../shared/libs/Store');
var constants = require('./constants');

var ____Class2=Store.Model;for(var ____Class2____Key in ____Class2){if(____Class2.hasOwnProperty(____Class2____Key)){GridModel[____Class2____Key]=____Class2[____Class2____Key];}}var ____SuperProtoOf____Class2=____Class2===null?null:____Class2.prototype;GridModel.prototype=Object.create(____SuperProtoOf____Class2);GridModel.prototype.constructor=GridModel;GridModel.__superConstructor__=____Class2;
    function GridModel() {"use strict";
        ____Class2.call(this);
        this.cols = [];
        this.rows = [];
        this.charts = [];
    }

    Object.defineProperty(GridModel.prototype,"initialize",{writable:true,configurable:true,value:function() {"use strict";
        ____SuperProtoOf____Class2.initialize.call(this);
    }});

    Object.defineProperty(GridModel.prototype,"handleDispatch",{writable:true,configurable:true,value:function(payload) {"use strict";
        switch (payload.actionType) {
            case constants.GRID_LOAD:
                this.cols = payload.gridData.cols;
                this.rows = payload.gridData.rows;
                this.charts = payload.charts;
                break;
            case constants.GRID_FILTER:
                this.cols = payload.gridData.cols;
                this.rows = payload.gridData.rows;
                this.trigger('change');
                break;
        }
    }});


module.exports = new GridModel();


},{"../shared/libs/Store":23,"./constants":13,"backbone":"backbone","jquery":"jquery"}],11:[function(require,module,exports){
var React = require('react');

var GridStore = require('../GridStore');
var GridRow = require('./GridRow');
var GridActions = require('../GridActions');

module.exports = React.createClass({displayName: "exports",
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
				React.createElement("table", null, 
					React.createElement("thead", null, 
						React.createElement("tr", null, 
						this.state.GridStore.cols.map(function(col)
								{return React.createElement("th", null, 
									React.createElement("span", {onClick: this.handleSort.bind(this, col)}, 
										col, " ", React.createElement("i", {className: "fa fa-sort"})
									)
								);}.bind(this)
						)
						)
					), 
					React.createElement("tbody", null, 
						this.state.GridStore.rows.map(function(row)
								{return React.createElement(GridRow, {row: row, cols: this.state.GridStore.cols});}.bind(this)
						)
					)
				)
			);
	}
});



},{"../GridActions":9,"../GridStore":10,"./GridRow":12,"react":"react"}],12:[function(require,module,exports){
var React = require('react');

module.exports = React.createClass({displayName: "exports",
    propTypes: {
        row: React.PropTypes.object,
        cols: React.PropTypes.array
    },

    render: function() {
        return (
            React.createElement("tr", null, 
                this.props.cols.map(function(col)
                        {return React.createElement("td", null, this.props.row[col] || '');}.bind(this)
                )
            )
        );
    }
});


},{"react":"react"}],13:[function(require,module,exports){
module.exports = {
    GRID_LOAD: 'GRID_LOAD',
    GRID_FILTER: 'GRID_FILTER'
};


},{}],14:[function(require,module,exports){
var constants = require('./constants');
var dispatch = require('../shared/helpers/dispatch');
var _ = require('lodash');


module.exports = {
    navigate: function(fragment, trigger, replace) {
        dispatch(constants.ROUTE_NAVIGATE, {
            fragment: fragment,
            trigger: _.isUndefined(trigger) ? true : trigger,
            replace: _.isUndefined(replace) ? true : replace
        });
    }
};


},{"../shared/helpers/dispatch":21,"./constants":18,"lodash":"lodash"}],15:[function(require,module,exports){
var Backbone = require('backbone');
var $ = require('jquery');

Backbone.$ = $;

var Store = require('../shared/libs/Store');
var conf = require('./settings');
var constants = require('./constants');

var ____Class0=Backbone.Router;for(var ____Class0____Key in ____Class0){if(____Class0.hasOwnProperty(____Class0____Key)){AppRouter[____Class0____Key]=____Class0[____Class0____Key];}}var ____SuperProtoOf____Class0=____Class0===null?null:____Class0.prototype;AppRouter.prototype=Object.create(____SuperProtoOf____Class0);AppRouter.prototype.constructor=AppRouter;AppRouter.__superConstructor__=____Class0;function AppRouter(){"use strict";if(____Class0!==null){____Class0.apply(this,arguments);}}
    Object.defineProperty(AppRouter.prototype,"initialize",{writable:true,configurable:true,value:function(store, routes) {"use strict";
        this.store = store;

        var route, key;
        var emitRoute = function ( /* route, args... */ ) {
            this.emitRouteAction.apply(this, arguments);
        };
        for (key in routes) {
            if (routes.hasOwnProperty(key)) {
                route = routes[key];
                this.route(key, route, emitRoute.bind(this, route));
            }
        }

        // catch all non-matching urls
        Backbone.history.handlers.push({
            route: /(.*)/,
            callback: function () {
                store.set({
                    route: constants.ROUTE_DEFAULT,
                    params: []
                });
            }
        });

        Backbone.$(document).on('ready', function () {
            Backbone.history.start();
        });
    }});

    Object.defineProperty(AppRouter.prototype,"emitRouteAction",{writable:true,configurable:true,value:function(     ) {"use strict";
        this.store.set({
            route: arguments[0],
            params: [].slice.call(arguments, 1)
        });
    }});


var ____Class1=Store.Model;for(var ____Class1____Key in ____Class1){if(____Class1.hasOwnProperty(____Class1____Key)){RouterModel[____Class1____Key]=____Class1[____Class1____Key];}}var ____SuperProtoOf____Class1=____Class1===null?null:____Class1.prototype;RouterModel.prototype=Object.create(____SuperProtoOf____Class1);RouterModel.prototype.constructor=RouterModel;RouterModel.__superConstructor__=____Class1;
    function RouterModel() {"use strict";
        ____Class1.call(this);
        this.defaults = {
            route: conf.ROUTE_DEFAULT,
            params: []
        };
    }

    Object.defineProperty(RouterModel.prototype,"initialize",{writable:true,configurable:true,value:function() {"use strict";
        ____SuperProtoOf____Class1.initialize.call(this);
        this.router = new AppRouter(this, conf.ROUTE_ROUTES);
    }});

    Object.defineProperty(RouterModel.prototype,"handleDispatch",{writable:true,configurable:true,value:function(payload) {"use strict";
        switch (payload.actionType) {
        case constants.ROUTE_NAVIGATE:
        {
            this.router.navigate(payload.fragment, {
                trigger: payload.trigger,
                replace: payload.replace
            });
            break;
        }

        }
    }});


module.exports = new RouterModel();


},{"../shared/libs/Store":23,"./constants":18,"./settings":19,"backbone":"backbone","jquery":"jquery"}],16:[function(require,module,exports){
var React = require('react');
var storeMixin = require('../../shared/helpers/storeMixin');
var RouterStore = require('../RouterStore');

module.exports = React.createClass({displayName: "exports",
    mixins: [storeMixin(RouterStore)],

    getInitialState: function() {
        return { RouterStore: RouterStore };
    },

    getComponentClass: function(route) {
        switch (route) {
            case 'grid':
                return require('../../grid/components/Grid');

            case 'charts':
                return require('../../charts/components/Charts');

            case 'customcharts':
                return require('../../charts/components/CustomCharts');

            default:
                return require('../../grid/components/Grid');
        }
    },

    render: function() {
        var props = {
            route: this.state.RouterStore.get('route'),
            routeParams: this.state.RouterStore.get('params')
        };

        var Component = this.getComponentClass(props.route);
        return React.createElement("div", {className: "component"}, React.createElement(Component, React.__spread({},  props)));
    }
});


},{"../../charts/components/Charts":6,"../../charts/components/CustomCharts":7,"../../grid/components/Grid":11,"../../shared/helpers/storeMixin":22,"../RouterStore":15,"react":"react"}],17:[function(require,module,exports){
var React = require('react');
var RouterActions = require('../RouterActions');
var RouterStore = require('../RouterStore');
var storeMixin = require('../../shared/helpers/storeMixin');

module.exports = React.createClass({displayName: "exports",
    mixins: [storeMixin(RouterStore)],

    propTypes: {
        href: React.PropTypes.string
    },

    getInitialState: function() {
        return { RouterStore: RouterStore };
    },

    navigate: function(ev) {
        ev.preventDefault();
        RouterActions.navigate(ev.target.getAttribute('href'), true);
    },

    render: function() {
        var className = this.state.RouterStore.get('route') === this.props.href ? 'active' : null;

        return React.createElement("a", React.__spread({},  this.props, {onClick: this.navigate, className: className}));
    }
});


},{"../../shared/helpers/storeMixin":22,"../RouterActions":14,"../RouterStore":15,"react":"react"}],18:[function(require,module,exports){
module.exports = {
    ROUTE_NAVIGATE: 'ROUTE_NAVIGATE'
};


},{}],19:[function(require,module,exports){
module.exports = {
    ROUTE_ROUTES: {
        'grid': 'grid',
        'charts': 'charts',
        'customcharts': 'customcharts'
    },

    // default route when undefined
    ROUTE_DEFAULT: 'grid'
};


},{}],20:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;


module.exports = new Dispatcher();


},{"flux":"flux"}],21:[function(require,module,exports){
var Dispatcher = require('../../shared/dispatcher');


/**
 * a bit more standardized way to dispatch actions
 * @param {String} actionType
 * @param {Object} [payload={}]
 * @returns {*}
 */
module.exports = function(actionType, payload) {
    payload = payload || {};
    payload.actionType = actionType;
    return Dispatcher.dispatch(payload);
};


},{"../../shared/dispatcher":20}],22:[function(require,module,exports){
/**
 * mixin to let components listen to stores in a simple way
 * the component needs to implement `onStoreUpdate` to set the state
 * @param {Object} store
 * @param {String} [events="add remove reset change"]
 */
module.exports = function(store, events) {
	if(!events) {
		events = 'add remove reset change';
	}
    return {
        componentDidMount: function() {
            store.on(events, function() {
                this.forceUpdate();
            }, this);
        },
        componentWillUnmount: function() {
            store.off(null, null, this);
        }
    };
};


},{}],23:[function(require,module,exports){
var Backbone = require('backbone');
var Dispatcher = require('../../shared/dispatcher');


var baseStore = {
	/**
	 * backbone init method
	 */
    initialize: function() {
        this.dispatchId = Dispatcher.register(this.handleDispatch.bind(this));
    },

	/**
	 * handle the dispatcher actions
	 * @param {Object} payload
	 */
    handleDispatch: function(/*payload*/) { }
};

module.exports = {
    Model: Backbone.Model.extend(baseStore),
    Collection: Backbone.Collection.extend(baseStore)
};


},{"../../shared/dispatcher":20,"backbone":"backbone"}],24:[function(require,module,exports){
var Backbone = require('backbone');

var ____Class5=Backbone.Model;for(var ____Class5____Key in ____Class5){if(____Class5.hasOwnProperty(____Class5____Key)){CostsProvider[____Class5____Key]=____Class5[____Class5____Key];}}var ____SuperProtoOf____Class5=____Class5===null?null:____Class5.prototype;CostsProvider.prototype=Object.create(____SuperProtoOf____Class5);CostsProvider.prototype.constructor=CostsProvider;CostsProvider.__superConstructor__=____Class5;
    function CostsProvider() {"use strict";
        ____Class5.call(this);
        this.items = [{
            date: "2015-01-01",
            value: 7
        }, {
            date: "2015-01-02",
            value: 11
        }, {
            date: "2015-01-03",
            value: 14
        }, {
            date: "2015-01-04",
            value: 10
        }, {
            date: "2015-01-05",
            value: 8
        }, {
            date: "2015-01-06",
            value: 15
        }, {
            date: "2015-01-07",
            value: 16
        }, {
            date: "2015-01-10",
            value: 19
        }, {
            date: "2015-01-11",
            value: 16
        }];

    }

    Object.defineProperty(CostsProvider.prototype,"data",{writable:true,configurable:true,value:function() {"use strict";
        return this.items;
    }});


module.exports = new CostsProvider();


},{"backbone":"backbone"}],25:[function(require,module,exports){
var Backbone = require('backbone');
var _ = require('lodash');

var ____Class6=Backbone.Model;for(var ____Class6____Key in ____Class6){if(____Class6.hasOwnProperty(____Class6____Key)){ProfitService[____Class6____Key]=____Class6[____Class6____Key];}}var ____SuperProtoOf____Class6=____Class6===null?null:____Class6.prototype;ProfitService.prototype=Object.create(____SuperProtoOf____Class6);ProfitService.prototype.constructor=ProfitService;ProfitService.__superConstructor__=____Class6;
    function ProfitService(revenueProvider, costsProvider) {"use strict";
        ____Class6.call(this);
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

        this.items = this.merge(this.revenue, this.costs);
    }

    Object.defineProperty(ProfitService.prototype,"merge",{writable:true,configurable:true,value:function(revenue, costs) {"use strict";
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
    }});

    Object.defineProperty(ProfitService.prototype,"mergeFunc",{writable:true,configurable:true,value:function(items) {"use strict";
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
    }});

    Object.defineProperty(ProfitService.prototype,"data",{writable:true,configurable:true,value:function() {"use strict";
        return this.items;
    }});

    Object.defineProperty(ProfitService.prototype,"filter",{writable:true,configurable:true,value:function(col){"use strict";
        return _.sortBy(this.items, col);
    }});


module.exports = ProfitService;



},{"backbone":"backbone","lodash":"lodash"}],26:[function(require,module,exports){
var Backbone = require('backbone');

var ____Class4=Backbone.Model;for(var ____Class4____Key in ____Class4){if(____Class4.hasOwnProperty(____Class4____Key)){RevenueProvider[____Class4____Key]=____Class4[____Class4____Key];}}var ____SuperProtoOf____Class4=____Class4===null?null:____Class4.prototype;RevenueProvider.prototype=Object.create(____SuperProtoOf____Class4);RevenueProvider.prototype.constructor=RevenueProvider;RevenueProvider.__superConstructor__=____Class4;
    function RevenueProvider() {"use strict";
        ____Class4.call(this);
        this.items = [{
            date: "2015-01-01",
            value: 14
        }, {
            date: "2015-01-02",
            value: 21
        }, {
            date: "2015-01-03",
            value: 31
        }, {
            date: "2015-01-04",
            value: 16
        }, {
            date: "2015-01-05",
            value: 18
        }, {
            date: "2015-01-08",
            value: 29
        }, {
            date: "2015-01-09",
            value: 36
        }, {
            date: "2015-01-10",
            value: 42
        }, {
            date: "2015-01-11",
            value: 33
        }];

    }

    Object.defineProperty(RevenueProvider.prototype,"data",{writable:true,configurable:true,value:function() {"use strict";
        return this.items;
    }});


module.exports = new RevenueProvider();


},{"backbone":"backbone"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL2luZGV4LmpzIiwiL1ZvbHVtZXMvUHJvamVjdHMvUHJvamVjdHMvQmx1ZXByaW50L2FwcC9hcHAvY29tcG9uZW50cy9BcHAuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL2FwcC9jb21wb25lbnRzL0hlYWRlci5qcyIsIi9Wb2x1bWVzL1Byb2plY3RzL1Byb2plY3RzL0JsdWVwcmludC9hcHAvY2hhcnRzL0NoYXJ0c0FjdGlvbnMuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL2NoYXJ0cy9DaGFydHNTdG9yZS5qcyIsIi9Wb2x1bWVzL1Byb2plY3RzL1Byb2plY3RzL0JsdWVwcmludC9hcHAvY2hhcnRzL2NvbXBvbmVudHMvQ2hhcnRzLmpzIiwiL1ZvbHVtZXMvUHJvamVjdHMvUHJvamVjdHMvQmx1ZXByaW50L2FwcC9jaGFydHMvY29tcG9uZW50cy9DdXN0b21DaGFydHMuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL2NoYXJ0cy9jb25zdGFudHMuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL2dyaWQvR3JpZEFjdGlvbnMuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL2dyaWQvR3JpZFN0b3JlLmpzIiwiL1ZvbHVtZXMvUHJvamVjdHMvUHJvamVjdHMvQmx1ZXByaW50L2FwcC9ncmlkL2NvbXBvbmVudHMvR3JpZC5qcyIsIi9Wb2x1bWVzL1Byb2plY3RzL1Byb2plY3RzL0JsdWVwcmludC9hcHAvZ3JpZC9jb21wb25lbnRzL0dyaWRSb3cuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL2dyaWQvY29uc3RhbnRzLmpzIiwiL1ZvbHVtZXMvUHJvamVjdHMvUHJvamVjdHMvQmx1ZXByaW50L2FwcC9yb3V0ZXIvUm91dGVyQWN0aW9ucy5qcyIsIi9Wb2x1bWVzL1Byb2plY3RzL1Byb2plY3RzL0JsdWVwcmludC9hcHAvcm91dGVyL1JvdXRlclN0b3JlLmpzIiwiL1ZvbHVtZXMvUHJvamVjdHMvUHJvamVjdHMvQmx1ZXByaW50L2FwcC9yb3V0ZXIvY29tcG9uZW50cy9Sb3V0ZXIuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL3JvdXRlci9jb21wb25lbnRzL1JvdXRlckxpbmsuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL3JvdXRlci9jb25zdGFudHMuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL3JvdXRlci9zZXR0aW5ncy5qcyIsIi9Wb2x1bWVzL1Byb2plY3RzL1Byb2plY3RzL0JsdWVwcmludC9hcHAvc2hhcmVkL2Rpc3BhdGNoZXIuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL3NoYXJlZC9oZWxwZXJzL2Rpc3BhdGNoLmpzIiwiL1ZvbHVtZXMvUHJvamVjdHMvUHJvamVjdHMvQmx1ZXByaW50L2FwcC9zaGFyZWQvaGVscGVycy9zdG9yZU1peGluLmpzIiwiL1ZvbHVtZXMvUHJvamVjdHMvUHJvamVjdHMvQmx1ZXByaW50L2FwcC9zaGFyZWQvbGlicy9TdG9yZS5qcyIsIi9Wb2x1bWVzL1Byb2plY3RzL1Byb2plY3RzL0JsdWVwcmludC9hcHAvc2hhcmVkL3NlcnZpY2VzL0Nvc3RzUHJvdmlkZXIuanMiLCIvVm9sdW1lcy9Qcm9qZWN0cy9Qcm9qZWN0cy9CbHVlcHJpbnQvYXBwL3NoYXJlZC9zZXJ2aWNlcy9Qcm9maXRTZXJ2aWNlLmpzIiwiL1ZvbHVtZXMvUHJvamVjdHMvUHJvamVjdHMvQmx1ZXByaW50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LENBQUM7UUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUM7WUFDVixJQUFJLEVBQUUsWUFBWTtZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNaLEVBQUU7WUFDQyxJQUFJLEVBQUUsWUFBWTtZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNaLEVBQUU7WUFDQyxJQUFJLEVBQUUsWUFBWTtZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNaLEVBQUU7WUFDQyxJQUFJLEVBQUUsWUFBWTtZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNaLEVBQUU7WUFDQyxJQUFJLEVBQUUsWUFBWTtZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNaLEVBQUU7WUFDQyxJQUFJLEVBQUUsWUFBWTtZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNaLEVBQUU7WUFDQyxJQUFJLEVBQUUsWUFBWTtZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNaLEVBQUU7WUFDQyxJQUFJLEVBQUUsWUFBWTtZQUNsQixLQUFLLEVBQUUsRUFBRTtTQUNaLEVBQUU7WUFDQyxJQUFJLEVBQUUsWUFBWTtZQUNsQixLQUFLLEVBQUUsRUFBRTtBQUNyQixTQUFTLENBQUMsQ0FBQzs7QUFFWCxLQUFLOztJQUVELHNHQUFJLENBQUEsQ0FBQyxHQUFHLGFBQUE7UUFDSixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDckIsRUFBQSxDQUFBO0FBQ0wsQ0FBQzs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksZUFBZSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBBcHAgPSByZXF1aXJlKCcuL2FwcC9jb21wb25lbnRzL0FwcCcpO1xuXG5SZWFjdC5yZW5kZXIoPEFwcCAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpKTtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBIZWFkZXIgPSByZXF1aXJlKCcuL0hlYWRlcicpO1xudmFyIFJvdXRlciA9IHJlcXVpcmUoJy4uLy4uL3JvdXRlci9jb21wb25lbnRzL1JvdXRlcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgICA8SGVhZGVyIC8+XG4gICAgICAgICAgICA8Um91dGVyIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBSb3V0ZXJMaW5rID0gcmVxdWlyZSgnLi4vLi4vcm91dGVyL2NvbXBvbmVudHMvUm91dGVyTGluaycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKDxoZWFkZXI+XG4gICAgICAgICAgICA8aDE+RGF0YSBWaXN1YWxpemF0aW9uPC9oMT5cbiAgICAgICAgICAgIDxuYXYgY2xhc3NOYW1lPVwibmF2YmFyXCI+XG4gICAgICAgICAgICAgICAgPFJvdXRlckxpbmsgaHJlZj1cImdyaWRcIj5HcmlkPC9Sb3V0ZXJMaW5rPlxuICAgICAgICAgICAgICAgIDxSb3V0ZXJMaW5rIGhyZWY9XCJjaGFydHNcIj5DaGFydHM8L1JvdXRlckxpbms+XG4gICAgICAgICAgICAgICAgPFJvdXRlckxpbmsgaHJlZj1cImN1c3RvbWNoYXJ0c1wiPkN1c3RvbSBDaGFydHM8L1JvdXRlckxpbms+XG4gICAgICAgICAgICA8L25hdj5cbiAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG4iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcbnZhciBkaXNwYXRjaCA9IHJlcXVpcmUoJy4uL3NoYXJlZC9oZWxwZXJzL2Rpc3BhdGNoJyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgcmV2ZW51ZVByb3ZpZGVyID0gcmVxdWlyZSgnLi4vc2hhcmVkL3NlcnZpY2VzL1JldmVudWVQcm92aWRlcicpO1xudmFyIGNvc3RzUHJvdmlkZXIgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2VydmljZXMvQ29zdHNQcm92aWRlcicpO1xudmFyIFByb2ZpdFNlcnZpY2UgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2VydmljZXMvUHJvZml0U2VydmljZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBsb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJldmVudWVWYWx1ZXMgPSBfLm1hcChyZXZlbnVlUHJvdmlkZXIuZGF0YSgpLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHg6IG5ldyBEYXRlKGl0ZW0uZGF0ZSksXG4gICAgICAgICAgICAgICAgeTogaXRlbS52YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGNvc3RzVmFsdWVzID0gXy5tYXAoY29zdHNQcm92aWRlci5kYXRhKCksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgeDogbmV3IERhdGUoaXRlbS5kYXRlKSxcbiAgICAgICAgICAgICAgICB5OiBpdGVtLnZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnByb2ZpdFNlcnZpY2UgPSBuZXcgUHJvZml0U2VydmljZShyZXZlbnVlUHJvdmlkZXIsIGNvc3RzUHJvdmlkZXIpO1xuICAgICAgICB2YXIgcHJvZml0VmFsdWVzID0gXy5maWx0ZXIodGhpcy5wcm9maXRTZXJ2aWNlLmRhdGEoKSwgZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgcmV0dXJuIHAucHJvZml0O1xuICAgICAgICB9KS5tYXAoZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB4OiBuZXcgRGF0ZShpdGVtLmRhdGUpLFxuICAgICAgICAgICAgICAgIHk6IGl0ZW0ucHJvZml0XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGNoYXJ0cyA9IFt7XG4gICAgICAgICAgICBuYW1lOiAncmV2ZW51ZScsXG4gICAgICAgICAgICB2YWx1ZXM6IHJldmVudWVWYWx1ZXMsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDk2ODgnXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIG5hbWU6ICdjb3N0cycsXG4gICAgICAgICAgICB2YWx1ZXM6IGNvc3RzVmFsdWVzLFxuICAgICAgICAgICAgY29sb3I6ICcjRjQ0MzM2J1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBuYW1lOiAncHJvZml0JyxcbiAgICAgICAgICAgIHZhbHVlczogcHJvZml0VmFsdWVzLFxuICAgICAgICAgICAgY29sb3I6ICcjMjE5NkYzJ1xuICAgICAgICB9XTtcblxuICAgICAgICB2YXIgY29sb3JzID0gXy5tYXAoY2hhcnRzLCBmdW5jdGlvbiAoY2hhcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGFydC5jb2xvcjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlzcGF0Y2goY29uc3RhbnRzLkNIQVJUU19MT0FELCB7XG4gICAgICAgICAgICBjaGFydHM6IGNoYXJ0cyxcbiAgICAgICAgICAgIGNoYXJ0c0NvbG9yczogY29sb3JzXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbkJhY2tib25lLiQgPSAkO1xuXG52YXIgU3RvcmUgPSByZXF1aXJlKCcuLi9zaGFyZWQvbGlicy9TdG9yZScpO1xudmFyIGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XG5cbmNsYXNzIENoYXJ0c01vZGVsIGV4dGVuZHMgU3RvcmUuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNoYXJ0cyA9IFtdO1xuICAgICAgICB0aGlzLmNoYXJ0c0NvbG9ycyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBpbml0aWFsaXplKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGhhbmRsZURpc3BhdGNoKHBheWxvYWQpIHtcbiAgICAgICAgc3dpdGNoIChwYXlsb2FkLmFjdGlvblR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgY29uc3RhbnRzLkNIQVJUU19MT0FEOlxuICAgICAgICAgICAgICAgIHRoaXMuY2hhcnRzID0gcGF5bG9hZC5jaGFydHM7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFydHNDb2xvcnMgPSBmdW5jdGlvbihpZHgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBheWxvYWQuY2hhcnRzQ29sb3JzW2lkeF07XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQ2hhcnRzTW9kZWwoKTtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgcmQzID0gcmVxdWlyZSgncmVhY3QtZDMnKTtcblxudmFyIENoYXJ0c1N0b3JlID0gcmVxdWlyZSgnLi4vQ2hhcnRzU3RvcmUnKTtcbnZhciBDaGFydHNBY3Rpb25zID0gcmVxdWlyZSgnLi4vQ2hhcnRzQWN0aW9ucycpO1xuXG52YXIgTGluZUNoYXJ0ID0gcmQzLkxpbmVDaGFydDtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdHByb3BUeXBlczoge1xuXHRcdHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG5cdH0sXG5cblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Q2hhcnRzU3RvcmU6IENoYXJ0c1N0b3JlLFxuXHRcdFx0cGFyZW50V2lkdGg6IDBcblx0XHR9O1xuXHR9LFxuXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHdpZHRoOiAnMTAwJScsXG5cdFx0XHRoZWlnaHQ6IDMwMFxuXHRcdH07XG5cdH0sXG5cblx0aGFuZGxlUmVzaXplOiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZWxlbSA9IFJlYWN0LmZpbmRET01Ob2RlKHRoaXMpO1xuXHRcdGlmIChlbGVtKSB7XG5cdFx0XHR2YXIgd2lkdGggPSBlbGVtLnBhcmVudE5vZGUub2Zmc2V0V2lkdGg7XG5cblx0XHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0XHRwYXJlbnRXaWR0aDogd2lkdGhcblx0XHRcdH0pO1xuXHRcdH1cblx0fSxcblxuXHRjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGV2ZW50cyA9ICdhZGQgcmVtb3ZlIHJlc2V0IGNoYW5nZSc7XG5cdFx0Q2hhcnRzU3RvcmUub24oZXZlbnRzLCBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuZm9yY2VVcGRhdGUoKTtcblx0XHR9LCB0aGlzKTtcblx0XHRDaGFydHNBY3Rpb25zLmxvYWQoKTtcblxuXHRcdGlmICh0aGlzLnByb3BzLndpZHRoID09PSAnMTAwJScpIHtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG5cdFx0fVxuXHRcdHRoaXMuaGFuZGxlUmVzaXplKCk7XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdENoYXJ0c1N0b3JlLm9mZihudWxsLCBudWxsLCB0aGlzKTtcblx0fSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciB3aWR0aCA9IHRoaXMucHJvcHMud2lkdGg7XG5cdFx0aWYgKHdpZHRoID09PSAnMTAwJScpIHtcblx0XHRcdHdpZHRoID0gdGhpcy5zdGF0ZS5wYXJlbnRXaWR0aCB8fCA0MDA7XG5cdFx0fVxuXG5cdFx0cmV0dXJuICggPExpbmVDaGFydFxuXHRcdFx0bGVnZW5kPXt0cnVlfVxuXHRcdFx0ZGF0YSA9IHt0aGlzLnN0YXRlLkNoYXJ0c1N0b3JlLmNoYXJ0c31cblx0XHRcdHdpZHRoID0ge3dpZHRofVxuXHRcdFx0aGVpZ2h0ID0gezQwMH1cblx0XHRcdGNvbG9ycyA9IHt0aGlzLnN0YXRlLkNoYXJ0c1N0b3JlLmNoYXJ0c0NvbG9yc31cblx0XHRcdC8+XG5cdFx0KTtcblx0fVxufSk7XG4iLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xuXG52YXIgQ2hhcnRzU3RvcmUgPSByZXF1aXJlKCcuLi9DaGFydHNTdG9yZScpO1xudmFyIENoYXJ0c0FjdGlvbnMgPSByZXF1aXJlKCcuLi9DaGFydHNBY3Rpb25zJyk7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgZDMgPSByZXF1aXJlKCdkMycpO1xuXG52YXIgQ2hhcnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBoZWlnaHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNoaWxkcmVuOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzdmcgd2lkdGg9e3RoaXMucHJvcHMud2lkdGh9IGhlaWdodD17dGhpcy5wcm9wcy5oZWlnaHR9Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvc3ZnPlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgTGluZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgY29sb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHBhdGg6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwYXRoOiAnJyxcbiAgICAgICAgICAgIGNvbG9yOiAnYmx1ZScsXG4gICAgICAgICAgICB3aWR0aDogMlxuICAgICAgICB9O1xuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHBhdGggZD17dGhpcy5wcm9wcy5wYXRofSBzdHJva2U9e3RoaXMucHJvcHMuY29sb3J9IHN0cm9rZVdpZHRoPXt0aGlzLnByb3BzLndpZHRofSBmaWxsPVwibm9uZVwiIC8+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBEYXRhU2VyaWVzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpbnRlcnBvbGF0ZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgZGF0YTogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICAgICAgICBjb2xvcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0sXG5cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgZGF0YTogW10sXG4gICAgICAgICAgICBpbnRlcnBvbGF0ZTogJ2xpbmVhcidcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5wcm9wcyxcbiAgICAgICAgICAgIHlTY2FsZSA9IHByb3BzLnlTY2FsZSxcbiAgICAgICAgICAgIHhTY2FsZSA9IHByb3BzLnhTY2FsZTtcblxuICAgICAgICB2YXIgcGF0aCA9IGQzLnN2Zy5saW5lKClcbiAgICAgICAgICAgIC54KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIHhTY2FsZShkLngpOyB9KVxuICAgICAgICAgICAgLnkoZnVuY3Rpb24oZCkgeyByZXR1cm4geVNjYWxlKGQueSk7IH0pXG4gICAgICAgICAgICAuaW50ZXJwb2xhdGUodGhpcy5wcm9wcy5pbnRlcnBvbGF0ZSk7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxMaW5lIHBhdGg9e3BhdGgodGhpcy5wcm9wcy5kYXRhKX0gY29sb3I9e3RoaXMucHJvcHMuY29sb3J9IC8+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBMaW5lQ2hhcnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBoZWlnaHQ6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGE6IFJlYWN0LlByb3BUeXBlcy5hcnJheVxuICAgIH0sXG5cbiAgICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgICAgIGhlaWdodDogMzAwXG4gICAgICAgIH07XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wcm9wcy5kYXRhLFxuICAgICAgICAgICAgc2l6ZSA9IHsgd2lkdGg6IHRoaXMucHJvcHMud2lkdGgsIGhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQgfTtcblxuICAgICAgICB2YXIgbWF4ID0gXyhkYXRhKS5tYXAoZnVuY3Rpb24oaXRlbSl7XG4gICAgICAgICAgICByZXR1cm4gXy5yZWR1Y2UoaXRlbS52YWx1ZXMsIGZ1bmN0aW9uKG1lbW8sIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KG1lbW8sIHZhbHVlLnkpO1xuICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5tYXgoKVxuICAgICAgICAudmFsdWUoKTtcblxuICAgICAgICB2YXIgeFNjYWxlID0gZDMudGltZS5zY2FsZSgpXG4gICAgICAgICAgICAuZG9tYWluKFtuZXcgRGF0ZSgnMjAxNS0wMS0wMScpLCBuZXcgRGF0ZSgnMjAxNS0wMS0xMScpXSlcbiAgICAgICAgICAgIC5yYW5nZShbMCwgdGhpcy5wcm9wcy53aWR0aF0pO1xuXG4gICAgICAgIHZhciB5U2NhbGUgPSBkMy5zY2FsZS5saW5lYXIoKVxuICAgICAgICAgICAgLmRvbWFpbihbMCwgbWF4XSlcbiAgICAgICAgICAgIC5yYW5nZShbdGhpcy5wcm9wcy5oZWlnaHQsIDBdKTtcblxuXG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxDaGFydCB3aWR0aD17dGhpcy5wcm9wcy53aWR0aH0gaGVpZ2h0PXt0aGlzLnByb3BzLmhlaWdodH0+XG4gICAgICAgICAgICAgICAgIHtkYXRhLm1hcCgoY2hhcnQpPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxEYXRhU2VyaWVzIGRhdGE9e2NoYXJ0LnZhbHVlc30gc2l6ZT17c2l6ZX0geFNjYWxlPXt4U2NhbGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlTY2FsZT17eVNjYWxlfSByZWY9e2NoYXJ0Lm5hbWV9IGNvbG9yPXtjaGFydC5jb2xvcn0vPlxuICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9DaGFydD5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIExlZ2VuZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgZGF0YTogUmVhY3QuUHJvcFR5cGVzLmFycmF5XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5wcm9wcy5kYXRhO1xuXG4gICAgICAgIHZhciB1bFN0eWxlID0ge1xuICAgICAgICAgICAgJ3dvcmQtd3JhcCc6ICdicmVhay13b3JkJyxcbiAgICAgICAgICAgICd3aWR0aCc6ICcxOTBweCdcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgbGlTdHlsZUdlbiA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAnY29sb3InOiBjb2xvcixcbiAgICAgICAgICAgICAgICAnbGluZS1oZWlnaHQnOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6ICcxNTAlOydcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDx1bCBzdHlsZT17dWxTdHlsZX0+XG4gICAgICAgICAgICAge2RhdGEubWFwKChjaGFydCk9PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIHN0eWxlPXtsaVN0eWxlR2VuKGNoYXJ0LmNvbG9yKX0+PHNwYW4+e2NoYXJ0Lm5hbWV9PC9zcGFuPjwvbGk+XG4gICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICApO1xuICAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIHdpZHRoOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gICAgfSxcblxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgQ2hhcnRzU3RvcmU6IENoYXJ0c1N0b3JlLFxuICAgICAgICAgICAgcGFyZW50V2lkdGg6IDBcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAzMDBcbiAgICAgICAgfTtcbiAgICB9LFxuXG4gICAgaGFuZGxlUmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGVsZW0gPSBSZWFjdC5maW5kRE9NTm9kZSh0aGlzKTtcbiAgICAgICAgaWYgKGVsZW0pIHtcbiAgICAgICAgICAgIHZhciB3aWR0aCA9IGVsZW0ucGFyZW50Tm9kZS5vZmZzZXRXaWR0aDtcblxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgcGFyZW50V2lkdGg6IHdpZHRoXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBldmVudHMgPSAnYWRkIHJlbW92ZSByZXNldCBjaGFuZ2UnO1xuICAgICAgICBDaGFydHNTdG9yZS5vbihldmVudHMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgQ2hhcnRzQWN0aW9ucy5sb2FkKCk7XG5cbiAgICAgICAgaWYgKHRoaXMucHJvcHMud2lkdGggPT09ICcxMDAlJykge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSgpO1xuICAgIH0sXG5cbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIENoYXJ0c1N0b3JlLm9mZihudWxsLCBudWxsLCB0aGlzKTtcbiAgICB9LFxuXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHdpZHRoID0gdGhpcy5wcm9wcy53aWR0aDtcbiAgICAgICAgaWYgKHdpZHRoID09PSAnMTAwJScpIHtcbiAgICAgICAgICAgIHdpZHRoID0gdGhpcy5zdGF0ZS5wYXJlbnRXaWR0aCB8fCA0MDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPExlZ2VuZCBkYXRhPXt0aGlzLnN0YXRlLkNoYXJ0c1N0b3JlLmNoYXJ0c30vPlxuICAgICAgICAgICAgICAgIDxMaW5lQ2hhcnRcbiAgICAgICAgICAgICAgICAgICAgZGF0YT17dGhpcy5zdGF0ZS5DaGFydHNTdG9yZS5jaGFydHN9XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoID0ge3dpZHRofVxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgPSB7NDAwfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L2Rpdj4pO1xuICAgIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgQ0hBUlRTX0xPQUQ6ICdDSEFSVFNfTE9BRCdcbn07XG4iLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcbnZhciBkaXNwYXRjaCA9IHJlcXVpcmUoJy4uL3NoYXJlZC9oZWxwZXJzL2Rpc3BhdGNoJyk7XG5cbnZhciByZXZlbnVlUHJvdmlkZXIgPSByZXF1aXJlKCcuLi9zaGFyZWQvc2VydmljZXMvUmV2ZW51ZVByb3ZpZGVyJyk7XG52YXIgY29zdHNQcm92aWRlciA9IHJlcXVpcmUoJy4uL3NoYXJlZC9zZXJ2aWNlcy9Db3N0c1Byb3ZpZGVyJyk7XG52YXIgUHJvZml0U2VydmljZSA9IHJlcXVpcmUoJy4uL3NoYXJlZC9zZXJ2aWNlcy9Qcm9maXRTZXJ2aWNlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnByb2ZpdFNlcnZpY2UgPSBuZXcgUHJvZml0U2VydmljZShyZXZlbnVlUHJvdmlkZXIsIGNvc3RzUHJvdmlkZXIpO1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMucHJvZml0U2VydmljZS5kYXRhKCk7XG5cbiAgICAgICAgdmFyIGdyaWREYXRhID0ge1xuICAgICAgICAgICAgY29sczogWydkYXRlJywgJ3JldmVudWUnLCAnY29zdCcsICdwcm9maXQnXSxcbiAgICAgICAgICAgIHJvd3M6IGRhdGFcbiAgICAgICAgfTtcblxuICAgICAgICBkaXNwYXRjaChjb25zdGFudHMuR1JJRF9MT0FELCB7XG4gICAgICAgICAgICBncmlkRGF0YTogZ3JpZERhdGFcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBmaWx0ZXI6IGZ1bmN0aW9uKGNvbCkge1xuICAgICAgICB2YXIgZ3JpZERhdGEgPSB7XG4gICAgICAgICAgICBjb2xzOiBbJ2RhdGUnLCAncmV2ZW51ZScsICdjb3N0JywgJ3Byb2ZpdCddLFxuICAgICAgICAgICAgcm93czogdGhpcy5wcm9maXRTZXJ2aWNlLmZpbHRlcihjb2wpXG4gICAgICAgIH07XG5cbiAgICAgICAgZGlzcGF0Y2goY29uc3RhbnRzLkdSSURfRklMVEVSLCB7XG4gICAgICAgICAgICBncmlkRGF0YTogZ3JpZERhdGFcbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xuQmFja2JvbmUuJCA9ICQ7XG5cbnZhciBTdG9yZSA9IHJlcXVpcmUoJy4uL3NoYXJlZC9saWJzL1N0b3JlJyk7XG52YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxuY2xhc3MgR3JpZE1vZGVsIGV4dGVuZHMgU3RvcmUuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmNvbHMgPSBbXTtcbiAgICAgICAgdGhpcy5yb3dzID0gW107XG4gICAgICAgIHRoaXMuY2hhcnRzID0gW107XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBoYW5kbGVEaXNwYXRjaChwYXlsb2FkKSB7XG4gICAgICAgIHN3aXRjaCAocGF5bG9hZC5hY3Rpb25UeXBlKSB7XG4gICAgICAgICAgICBjYXNlIGNvbnN0YW50cy5HUklEX0xPQUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xzID0gcGF5bG9hZC5ncmlkRGF0YS5jb2xzO1xuICAgICAgICAgICAgICAgIHRoaXMucm93cyA9IHBheWxvYWQuZ3JpZERhdGEucm93cztcbiAgICAgICAgICAgICAgICB0aGlzLmNoYXJ0cyA9IHBheWxvYWQuY2hhcnRzO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBjb25zdGFudHMuR1JJRF9GSUxURVI6XG4gICAgICAgICAgICAgICAgdGhpcy5jb2xzID0gcGF5bG9hZC5ncmlkRGF0YS5jb2xzO1xuICAgICAgICAgICAgICAgIHRoaXMucm93cyA9IHBheWxvYWQuZ3JpZERhdGEucm93cztcbiAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBHcmlkTW9kZWwoKTtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbnZhciBHcmlkU3RvcmUgPSByZXF1aXJlKCcuLi9HcmlkU3RvcmUnKTtcbnZhciBHcmlkUm93ID0gcmVxdWlyZSgnLi9HcmlkUm93Jyk7XG52YXIgR3JpZEFjdGlvbnMgPSByZXF1aXJlKCcuLi9HcmlkQWN0aW9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0R3JpZFN0b3JlOiBHcmlkU3RvcmVcblx0XHR9O1xuXHR9LFxuXG5cdGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgZXZlbnRzID0gJ2FkZCByZW1vdmUgcmVzZXQgY2hhbmdlJztcblx0XHRHcmlkU3RvcmUub24oZXZlbnRzLCBmdW5jdGlvbigpIHtcblx0XHRcdHRoaXMuZm9yY2VVcGRhdGUoKTtcblx0XHR9LCB0aGlzKTtcblx0XHRHcmlkQWN0aW9ucy5sb2FkKCk7XG5cdH0sXG5cblx0Y29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuXHRcdEdyaWRTdG9yZS5vZmYobnVsbCwgbnVsbCwgdGhpcyk7XG5cdH0sXG5cbiAgICBoYW5kbGVTb3J0OiBmdW5jdGlvbiAoY29sKSB7XG5cdFx0R3JpZEFjdGlvbnMuZmlsdGVyKGNvbCk7XG4gICAgfSxcblxuXHRyZW5kZXI6IGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8dGFibGU+XG5cdFx0XHRcdFx0PHRoZWFkPlxuXHRcdFx0XHRcdFx0PHRyPlxuXHRcdFx0XHRcdFx0e3RoaXMuc3RhdGUuR3JpZFN0b3JlLmNvbHMubWFwKChjb2wpPT5cblx0XHRcdFx0XHRcdFx0XHQ8dGg+XG5cdFx0XHRcdFx0XHRcdFx0XHQ8c3BhbiBvbkNsaWNrPXt0aGlzLmhhbmRsZVNvcnQuYmluZCh0aGlzLCBjb2wpfT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0e2NvbH0gPGkgY2xhc3NOYW1lPVwiZmEgZmEtc29ydFwiPjwvaT5cblx0XHRcdFx0XHRcdFx0XHRcdDwvc3Bhbj5cblx0XHRcdFx0XHRcdFx0XHQ8L3RoPlxuXHRcdFx0XHRcdFx0KX1cblx0XHRcdFx0XHRcdDwvdHI+XG5cdFx0XHRcdFx0PC90aGVhZD5cblx0XHRcdFx0XHQ8dGJvZHk+XG5cdFx0XHRcdFx0XHR7dGhpcy5zdGF0ZS5HcmlkU3RvcmUucm93cy5tYXAoKHJvdyk9PlxuXHRcdFx0XHRcdFx0XHRcdDxHcmlkUm93IHJvdz17cm93fSBjb2xzPXt0aGlzLnN0YXRlLkdyaWRTdG9yZS5jb2xzfSAvPlxuXHRcdFx0XHRcdFx0KX1cblx0XHRcdFx0XHQ8L3Rib2R5PlxuXHRcdFx0XHQ8L3RhYmxlPlxuXHRcdFx0KTtcblx0fVxufSk7XG5cbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIHByb3BUeXBlczoge1xuICAgICAgICByb3c6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGNvbHM6IFJlYWN0LlByb3BUeXBlcy5hcnJheVxuICAgIH0sXG5cbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmNvbHMubWFwKChjb2wpPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57dGhpcy5wcm9wcy5yb3dbY29sXSB8fCAnJ308L3RkPlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgR1JJRF9MT0FEOiAnR1JJRF9MT0FEJyxcbiAgICBHUklEX0ZJTFRFUjogJ0dSSURfRklMVEVSJ1xufTtcbiIsInZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xudmFyIGRpc3BhdGNoID0gcmVxdWlyZSgnLi4vc2hhcmVkL2hlbHBlcnMvZGlzcGF0Y2gnKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgbmF2aWdhdGU6IGZ1bmN0aW9uKGZyYWdtZW50LCB0cmlnZ2VyLCByZXBsYWNlKSB7XG4gICAgICAgIGRpc3BhdGNoKGNvbnN0YW50cy5ST1VURV9OQVZJR0FURSwge1xuICAgICAgICAgICAgZnJhZ21lbnQ6IGZyYWdtZW50LFxuICAgICAgICAgICAgdHJpZ2dlcjogXy5pc1VuZGVmaW5lZCh0cmlnZ2VyKSA/IHRydWUgOiB0cmlnZ2VyLFxuICAgICAgICAgICAgcmVwbGFjZTogXy5pc1VuZGVmaW5lZChyZXBsYWNlKSA/IHRydWUgOiByZXBsYWNlXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iLCJ2YXIgQmFja2JvbmUgPSByZXF1aXJlKCdiYWNrYm9uZScpO1xudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuQmFja2JvbmUuJCA9ICQ7XG5cbnZhciBTdG9yZSA9IHJlcXVpcmUoJy4uL3NoYXJlZC9saWJzL1N0b3JlJyk7XG52YXIgY29uZiA9IHJlcXVpcmUoJy4vc2V0dGluZ3MnKTtcbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuL2NvbnN0YW50cycpO1xuXG5jbGFzcyBBcHBSb3V0ZXIgZXh0ZW5kcyBCYWNrYm9uZS5Sb3V0ZXIge1xuICAgIGluaXRpYWxpemUoc3RvcmUsIHJvdXRlcykge1xuICAgICAgICB0aGlzLnN0b3JlID0gc3RvcmU7XG5cbiAgICAgICAgdmFyIHJvdXRlLCBrZXk7XG4gICAgICAgIHZhciBlbWl0Um91dGUgPSBmdW5jdGlvbiAoIC8qIHJvdXRlLCBhcmdzLi4uICovICkge1xuICAgICAgICAgICAgdGhpcy5lbWl0Um91dGVBY3Rpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChrZXkgaW4gcm91dGVzKSB7XG4gICAgICAgICAgICBpZiAocm91dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICByb3V0ZSA9IHJvdXRlc1trZXldO1xuICAgICAgICAgICAgICAgIHRoaXMucm91dGUoa2V5LCByb3V0ZSwgZW1pdFJvdXRlLmJpbmQodGhpcywgcm91dGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNhdGNoIGFsbCBub24tbWF0Y2hpbmcgdXJsc1xuICAgICAgICBCYWNrYm9uZS5oaXN0b3J5LmhhbmRsZXJzLnB1c2goe1xuICAgICAgICAgICAgcm91dGU6IC8oLiopLyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc3RvcmUuc2V0KHtcbiAgICAgICAgICAgICAgICAgICAgcm91dGU6IGNvbnN0YW50cy5ST1VURV9ERUZBVUxULFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IFtdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJhY2tib25lLiQoZG9jdW1lbnQpLm9uKCdyZWFkeScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEJhY2tib25lLmhpc3Rvcnkuc3RhcnQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZW1pdFJvdXRlQWN0aW9uKCAvKiByb3V0ZSwgYXJncy4uLiAqLyApIHtcbiAgICAgICAgdGhpcy5zdG9yZS5zZXQoe1xuICAgICAgICAgICAgcm91dGU6IGFyZ3VtZW50c1swXSxcbiAgICAgICAgICAgIHBhcmFtczogW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY2xhc3MgUm91dGVyTW9kZWwgZXh0ZW5kcyBTdG9yZS5Nb2RlbCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICByb3V0ZTogY29uZi5ST1VURV9ERUZBVUxULFxuICAgICAgICAgICAgcGFyYW1zOiBbXVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGluaXRpYWxpemUoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucm91dGVyID0gbmV3IEFwcFJvdXRlcih0aGlzLCBjb25mLlJPVVRFX1JPVVRFUyk7XG4gICAgfVxuXG4gICAgaGFuZGxlRGlzcGF0Y2gocGF5bG9hZCkge1xuICAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICAgICAgICBjYXNlIGNvbnN0YW50cy5ST1VURV9OQVZJR0FURTpcbiAgICAgICAge1xuICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUocGF5bG9hZC5mcmFnbWVudCwge1xuICAgICAgICAgICAgICAgIHRyaWdnZXI6IHBheWxvYWQudHJpZ2dlcixcbiAgICAgICAgICAgICAgICByZXBsYWNlOiBwYXlsb2FkLnJlcGxhY2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBSb3V0ZXJNb2RlbCgpO1xuIiwidmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBzdG9yZU1peGluID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL2hlbHBlcnMvc3RvcmVNaXhpbicpO1xudmFyIFJvdXRlclN0b3JlID0gcmVxdWlyZSgnLi4vUm91dGVyU3RvcmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgbWl4aW5zOiBbc3RvcmVNaXhpbihSb3V0ZXJTdG9yZSldLFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHsgUm91dGVyU3RvcmU6IFJvdXRlclN0b3JlIH07XG4gICAgfSxcblxuICAgIGdldENvbXBvbmVudENsYXNzOiBmdW5jdGlvbihyb3V0ZSkge1xuICAgICAgICBzd2l0Y2ggKHJvdXRlKSB7XG4gICAgICAgICAgICBjYXNlICdncmlkJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi4vLi4vZ3JpZC9jb21wb25lbnRzL0dyaWQnKTtcblxuICAgICAgICAgICAgY2FzZSAnY2hhcnRzJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVxdWlyZSgnLi4vLi4vY2hhcnRzL2NvbXBvbmVudHMvQ2hhcnRzJyk7XG5cbiAgICAgICAgICAgIGNhc2UgJ2N1c3RvbWNoYXJ0cyc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVpcmUoJy4uLy4uL2NoYXJ0cy9jb21wb25lbnRzL0N1c3RvbUNoYXJ0cycpO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiByZXF1aXJlKCcuLi8uLi9ncmlkL2NvbXBvbmVudHMvR3JpZCcpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IHtcbiAgICAgICAgICAgIHJvdXRlOiB0aGlzLnN0YXRlLlJvdXRlclN0b3JlLmdldCgncm91dGUnKSxcbiAgICAgICAgICAgIHJvdXRlUGFyYW1zOiB0aGlzLnN0YXRlLlJvdXRlclN0b3JlLmdldCgncGFyYW1zJylcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgQ29tcG9uZW50ID0gdGhpcy5nZXRDb21wb25lbnRDbGFzcyhwcm9wcy5yb3V0ZSk7XG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbXBvbmVudFwiPjxDb21wb25lbnQgey4uLnByb3BzfSAvPjwvZGl2PjtcbiAgICB9XG59KTtcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUm91dGVyQWN0aW9ucyA9IHJlcXVpcmUoJy4uL1JvdXRlckFjdGlvbnMnKTtcbnZhciBSb3V0ZXJTdG9yZSA9IHJlcXVpcmUoJy4uL1JvdXRlclN0b3JlJyk7XG52YXIgc3RvcmVNaXhpbiA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9oZWxwZXJzL3N0b3JlTWl4aW4nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgbWl4aW5zOiBbc3RvcmVNaXhpbihSb3V0ZXJTdG9yZSldLFxuXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGhyZWY6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHsgUm91dGVyU3RvcmU6IFJvdXRlclN0b3JlIH07XG4gICAgfSxcblxuICAgIG5hdmlnYXRlOiBmdW5jdGlvbihldikge1xuICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBSb3V0ZXJBY3Rpb25zLm5hdmlnYXRlKGV2LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjbGFzc05hbWUgPSB0aGlzLnN0YXRlLlJvdXRlclN0b3JlLmdldCgncm91dGUnKSA9PT0gdGhpcy5wcm9wcy5ocmVmID8gJ2FjdGl2ZScgOiBudWxsO1xuXG4gICAgICAgIHJldHVybiA8YSB7Li4udGhpcy5wcm9wc30gb25DbGljaz17dGhpcy5uYXZpZ2F0ZX0gY2xhc3NOYW1lPXtjbGFzc05hbWV9IC8+O1xuICAgIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUk9VVEVfTkFWSUdBVEU6ICdST1VURV9OQVZJR0FURSdcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBST1VURV9ST1VURVM6IHtcbiAgICAgICAgJ2dyaWQnOiAnZ3JpZCcsXG4gICAgICAgICdjaGFydHMnOiAnY2hhcnRzJyxcbiAgICAgICAgJ2N1c3RvbWNoYXJ0cyc6ICdjdXN0b21jaGFydHMnXG4gICAgfSxcblxuICAgIC8vIGRlZmF1bHQgcm91dGUgd2hlbiB1bmRlZmluZWRcbiAgICBST1VURV9ERUZBVUxUOiAnZ3JpZCdcbn07XG4iLCJ2YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJ2ZsdXgnKS5EaXNwYXRjaGVyO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERpc3BhdGNoZXIoKTtcbiIsInZhciBEaXNwYXRjaGVyID0gcmVxdWlyZSgnLi4vLi4vc2hhcmVkL2Rpc3BhdGNoZXInKTtcblxuXG4vKipcbiAqIGEgYml0IG1vcmUgc3RhbmRhcmRpemVkIHdheSB0byBkaXNwYXRjaCBhY3Rpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uVHlwZVxuICogQHBhcmFtIHtPYmplY3R9IFtwYXlsb2FkPXt9XVxuICogQHJldHVybnMgeyp9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYWN0aW9uVHlwZSwgcGF5bG9hZCkge1xuICAgIHBheWxvYWQgPSBwYXlsb2FkIHx8IHt9O1xuICAgIHBheWxvYWQuYWN0aW9uVHlwZSA9IGFjdGlvblR5cGU7XG4gICAgcmV0dXJuIERpc3BhdGNoZXIuZGlzcGF0Y2gocGF5bG9hZCk7XG59O1xuIiwiLyoqXG4gKiBtaXhpbiB0byBsZXQgY29tcG9uZW50cyBsaXN0ZW4gdG8gc3RvcmVzIGluIGEgc2ltcGxlIHdheVxuICogdGhlIGNvbXBvbmVudCBuZWVkcyB0byBpbXBsZW1lbnQgYG9uU3RvcmVVcGRhdGVgIHRvIHNldCB0aGUgc3RhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdG9yZVxuICogQHBhcmFtIHtTdHJpbmd9IFtldmVudHM9XCJhZGQgcmVtb3ZlIHJlc2V0IGNoYW5nZVwiXVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHN0b3JlLCBldmVudHMpIHtcblx0aWYoIWV2ZW50cykge1xuXHRcdGV2ZW50cyA9ICdhZGQgcmVtb3ZlIHJlc2V0IGNoYW5nZSc7XG5cdH1cbiAgICByZXR1cm4ge1xuICAgICAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzdG9yZS5vbihldmVudHMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuICAgICAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzdG9yZS5vZmYobnVsbCwgbnVsbCwgdGhpcyk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcbiIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uLy4uL3NoYXJlZC9kaXNwYXRjaGVyJyk7XG5cblxudmFyIGJhc2VTdG9yZSA9IHtcblx0LyoqXG5cdCAqIGJhY2tib25lIGluaXQgbWV0aG9kXG5cdCAqL1xuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmRpc3BhdGNoSWQgPSBEaXNwYXRjaGVyLnJlZ2lzdGVyKHRoaXMuaGFuZGxlRGlzcGF0Y2guYmluZCh0aGlzKSk7XG4gICAgfSxcblxuXHQvKipcblx0ICogaGFuZGxlIHRoZSBkaXNwYXRjaGVyIGFjdGlvbnNcblx0ICogQHBhcmFtIHtPYmplY3R9IHBheWxvYWRcblx0ICovXG4gICAgaGFuZGxlRGlzcGF0Y2g6IGZ1bmN0aW9uKC8qcGF5bG9hZCovKSB7IH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIE1vZGVsOiBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoYmFzZVN0b3JlKSxcbiAgICBDb2xsZWN0aW9uOiBCYWNrYm9uZS5Db2xsZWN0aW9uLmV4dGVuZChiYXNlU3RvcmUpXG59O1xuIiwidmFyIEJhY2tib25lID0gcmVxdWlyZSgnYmFja2JvbmUnKTtcblxuY2xhc3MgQ29zdHNQcm92aWRlciBleHRlbmRzIEJhY2tib25lLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFt7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMDFcIixcbiAgICAgICAgICAgIHZhbHVlOiA3XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGU6IFwiMjAxNS0wMS0wMlwiLFxuICAgICAgICAgICAgdmFsdWU6IDExXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGU6IFwiMjAxNS0wMS0wM1wiLFxuICAgICAgICAgICAgdmFsdWU6IDE0XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGU6IFwiMjAxNS0wMS0wNFwiLFxuICAgICAgICAgICAgdmFsdWU6IDEwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIGRhdGU6IFwiMjAxNS0wMS0wNVwiLFxuICAgICAgICAgICAgdmFsdWU6IDhcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZGF0ZTogXCIyMDE1LTAxLTA2XCIsXG4gICAgICAgICAgICB2YWx1ZTogMTVcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZGF0ZTogXCIyMDE1LTAxLTA3XCIsXG4gICAgICAgICAgICB2YWx1ZTogMTZcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZGF0ZTogXCIyMDE1LTAxLTEwXCIsXG4gICAgICAgICAgICB2YWx1ZTogMTlcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgZGF0ZTogXCIyMDE1LTAxLTExXCIsXG4gICAgICAgICAgICB2YWx1ZTogMTZcbiAgICAgICAgfV07XG5cbiAgICB9XG5cbiAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcztcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IENvc3RzUHJvdmlkZXIoKTtcbiIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5jbGFzcyBQcm9maXRTZXJ2aWNlIGV4dGVuZHMgQmFja2JvbmUuTW9kZWwge1xuICAgIGNvbnN0cnVjdG9yKHJldmVudWVQcm92aWRlciwgY29zdHNQcm92aWRlcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnJldmVudWVQcm92aWRlciA9IHJldmVudWVQcm92aWRlcjtcbiAgICAgICAgdGhpcy5jb3N0c1Byb3ZpZGVyID0gY29zdHNQcm92aWRlcjtcblxuICAgICAgICB0aGlzLnJldmVudWUgPSBfKHRoaXMucmV2ZW51ZVByb3ZpZGVyLmRhdGEoKSkubWFwKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZGF0ZTogci5kYXRlLFxuICAgICAgICAgICAgICAgIHJldmVudWU6IHIudmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pLnZhbHVlKCk7XG5cbiAgICAgICAgdGhpcy5jb3N0cyA9IF8odGhpcy5jb3N0c1Byb3ZpZGVyLmRhdGEoKSkubWFwKGZ1bmN0aW9uKHIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZGF0ZTogci5kYXRlLFxuICAgICAgICAgICAgICAgIGNvc3Q6IHIudmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pLnZhbHVlKCk7XG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMubWVyZ2UodGhpcy5yZXZlbnVlLCB0aGlzLmNvc3RzKTtcbiAgICB9XG5cbiAgICBtZXJnZShyZXZlbnVlLCBjb3N0cykge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciByZXN1bHQgPSBfKHJldmVudWUuY29uY2F0KGNvc3RzKSkuZ3JvdXBCeShmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHAuZGF0ZTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uKHZhbHVlcywga2V5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhhdC5tZXJnZUZ1bmModmFsdWVzKTtcbiAgICAgICAgICAgICAgICB2YXIgcHJvZml0ID0gdmFsdWUucmV2ZW51ZSAtIHZhbHVlLmNvc3Q7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF8uZXh0ZW5kKHZhbHVlLCB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IGtleSxcbiAgICAgICAgICAgICAgICAgICAgcHJvZml0OiBwcm9maXRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pLnZhbHVlKCk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgbWVyZ2VGdW5jKGl0ZW1zKSB7XG4gICAgICAgIC8vIEN1c3RvbSBtZXJnZSBmdW5jdGlvbiBPUnMgdG9nZXRoZXIgbm9uLW9iamVjdCB2YWx1ZXMsIHJlY3Vyc2l2ZWx5XG4gICAgICAgIC8vIGNhbGxzIGl0c2VsZiBvbiBPYmplY3RzLlxuICAgICAgICB2YXIgbWVyZ2VyID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoYSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXy5tZXJnZSh7fSwgYSwgYiwgbWVyZ2VyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEgfHwgYjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBBbGxvdyByb2xlcyB0byBiZSBwYXNzZWQgdG8gXy5tZXJnZSBhcyBhbiBhcnJheSBvZiBhcmJpdHJhcnkgbGVuZ3RoXG4gICAgICAgIHZhciBhcmdzID0gXy5mbGF0dGVuKFt7fSwgaXRlbXMsIG1lcmdlcl0pO1xuICAgICAgICByZXR1cm4gXy5tZXJnZS5hcHBseShfLCBhcmdzKTtcbiAgICB9XG5cbiAgICBkYXRhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pdGVtcztcbiAgICB9XG5cbiAgICBmaWx0ZXIoY29sKXtcbiAgICAgICAgcmV0dXJuIF8uc29ydEJ5KHRoaXMuaXRlbXMsIGNvbCk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2ZpdFNlcnZpY2U7XG5cbiIsInZhciBCYWNrYm9uZSA9IHJlcXVpcmUoJ2JhY2tib25lJyk7XG5cbmNsYXNzIFJldmVudWVQcm92aWRlciBleHRlbmRzIEJhY2tib25lLk1vZGVsIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IFt7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMDFcIixcbiAgICAgICAgICAgIHZhbHVlOiAxNFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMDJcIixcbiAgICAgICAgICAgIHZhbHVlOiAyMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMDNcIixcbiAgICAgICAgICAgIHZhbHVlOiAzMVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMDRcIixcbiAgICAgICAgICAgIHZhbHVlOiAxNlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMDVcIixcbiAgICAgICAgICAgIHZhbHVlOiAxOFxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMDhcIixcbiAgICAgICAgICAgIHZhbHVlOiAyOVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMDlcIixcbiAgICAgICAgICAgIHZhbHVlOiAzNlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMTBcIixcbiAgICAgICAgICAgIHZhbHVlOiA0MlxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBkYXRlOiBcIjIwMTUtMDEtMTFcIixcbiAgICAgICAgICAgIHZhbHVlOiAzM1xuICAgICAgICB9XTtcblxuICAgIH1cblxuICAgIGRhdGEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLml0ZW1zO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgUmV2ZW51ZVByb3ZpZGVyKCk7XG4iXX0=
