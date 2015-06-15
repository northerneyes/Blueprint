var React = require('react');
var storeMixin = require('../../shared/helpers/storeMixin');
var RouterStore = require('../RouterStore');

module.exports = React.createClass({
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
        return <div className="component"><Component {...props} /></div>;
    }
});
