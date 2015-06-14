var React = require('react');

var Header = require('./Header');
var Router = require('../../router/components/Router');

// var Footer = require('./Footer');
// var Notify = require('../../notify/components/Notify');


module.exports = React.createClass({
    render: function() {
        return (<div className="container">
            <Header />
            <Router />
        </div>
        );
    }
});
