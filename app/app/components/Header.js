var React = require('react');
var RouterLink = require('../../router/components/RouterLink');


module.exports = React.createClass({
    render: function() {
        return (<header>
            <h1>Data Visualization</h1>
            <nav className="navbar">
                <RouterLink href="grid">Grid</RouterLink>
                <RouterLink href="charts">Charts</RouterLink>
                <RouterLink href="customcharts">Custom Charts</RouterLink>
            </nav>
        </header>
        );
    }
});
