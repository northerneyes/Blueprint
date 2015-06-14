var React = require('react');
var RouterActions = require('../RouterActions');
var RouterStore = require('../RouterStore');
var storeMixin = require('../../shared/helpers/storeMixin');

module.exports = React.createClass({
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

        return <a {...this.props} onClick={this.navigate} className={className} />;
    }
});
