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
