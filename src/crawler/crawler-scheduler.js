const cron = require('node-cron');
const runCrawler = require('./crawler');

cron.schedule('30 10,16 * * *', function() {
    console.log('Cron job for crawler started at:', new Date());
    runCrawler();
});