'use strict';

import {Express} from "express";

module.exports = function (app: Express) {
    let appConfig = require('../controllers/appConfigController');

    app
        .route('/')
        .get(appConfig.fetchConfig);
};
