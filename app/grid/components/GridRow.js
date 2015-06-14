var React = require('react');

module.exports = React.createClass({
    propTypes: {
        row: React.PropTypes.object,
        cols: React.PropTypes.array
    },

    render: function() {
        return (
            <tr>
                {this.props.cols.map((col)=>
                        <td>{this.props.row[col] || ''}</td>
                )}
            </tr>
        );
    }
});
