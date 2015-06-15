module.exports = {
    /**
     * set the application routes with their name defined as a constant
     * @example "url/:id": "name"
     */
    ROUTE_ROUTES: {
        'grid': 'grid',
        'charts': 'charts',
        'customcharts': 'customcharts'
    },

    // default route when undefined
    ROUTE_DEFAULT: 'grid'
};
