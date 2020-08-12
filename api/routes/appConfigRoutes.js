'use strict';

module.exports = function (app) {
    let appConfig = require('../controllers/appConfigController');

    app
        .route('/')
        .get(appConfig.fetchConfig);
};
