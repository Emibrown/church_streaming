const CronJob = require('cron').CronJob;
const request = require('request');
const helpers = require('../helpers/helpers');

const job = new CronJob('*/5 * * * * *', function () {
    request
    .get('http://127.0.0.1:3000/admin/ready', function (error, response, body) {
        let live_stream = JSON.parse(body).live_stream;
        if(live_stream){
            helpers.startStreaming(live_stream)
        }
    });
}, null, true);

module.exports = job;