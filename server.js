const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

let routes = require('./api/routes/appConfigRoutes');
routes(app);

app.use(function (req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
