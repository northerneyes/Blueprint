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
