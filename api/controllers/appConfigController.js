'use strict';

exports.fetch_config = function(req, res) {
  console.log("fetch_config");
  res.send({url: req.originalUrl + ' found'})
};
