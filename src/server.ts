const express = require('express'),
    app = express(),
    port = process.env.PORT || 8080;

const routes = require('./api/routes/appConfigRoutes');
routes(app);

// @ts-ignore
app.use(function (req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

// @ts-ignore
// noinspection JSUnusedLocalSymbols
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Server error')
})

console.log("listen on port " + port);
app.listen(port);
