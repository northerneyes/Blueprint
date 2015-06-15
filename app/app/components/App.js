var React = require('react');

var Header = require('./Header');
var Router = require('../../router/components/Router');

module.exports = React.createClass({
    render: function() {
        return (<div className="container">
            <Header />
            <Router />
        </div>
        );
    }
});
