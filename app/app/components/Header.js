var React = require('react');
var RouterLink = require('../../router/components/RouterLink');


module.exports = React.createClass({
    render: function() {
        return (<header>
            <h1>Blueprint</h1>
            <nav className="nav-buttons">
                <RouterLink href="grid">Grid</RouterLink>
                <RouterLink href="charts">Charts</RouterLink>
            </nav>
        </header>
        );
    }
});
