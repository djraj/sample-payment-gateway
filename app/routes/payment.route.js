module.exports = (app) => {
    const router = require("express").Router();
    const config = require("../config/config.js");
    const main = require('../controller/index.module.js')

    router.post('/submit-payment', main.initiateTransaction);

    app.use('/api/payment', router);
};