var Backbone = require('backbone');
var $ = require('jquery');

Backbone.$ = $;

var Store = require('../shared/libs/Store');
var conf = require('./settings');
var constants = require('./constants');

class AppRouter extends Backbone.Router {
    initialize(store, routes) {
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
    }

    emitRouteAction( /* route, args... */ ) {
        this.store.set({
            route: arguments[0],
            params: [].slice.call(arguments, 1)
        });
    }
}

class RouterModel extends Store.Model {
    constructor() {
        this.defaults = {
            route: conf.ROUTE_DEFAULT,
            params: []
        };
        super();
    }

    initialize() {
        this.router = new AppRouter(this, conf.ROUTE_ROUTES);
        super();
    }

    handleDispatch(payload) {
        switch (payload.actionType) {
        case constants.ROUTE_NAVIGATE:
            this.router.navigate(payload.fragment, {
                trigger: payload.trigger,
                replace: payload.replace
            });
            break;
        }
    }
}

module.exports = new RouterModel();
