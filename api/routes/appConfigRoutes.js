'use strict';

module.exports = function(app) {
  var appConfig = require('../controllers/appConfigController');

  app.route('/')
    .get(appConfig.fetch_config);
};
