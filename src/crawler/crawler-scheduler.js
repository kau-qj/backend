const schedule = require('node-schedule');
const runCrawler = require('./recruit.crawler');

// 매일 오전 10시 30분과 오후 4시 30분에 크롤러 실행
const crawlerJob = schedule.scheduleJob('30 10,16 * * *', function() {
    console.log('Cron job for crawler started at:', new Date());
    runCrawler()
        .then((result) => {
            if (result === 'Duplicate data found') {
                console.log('Cron job for crawler stopped due to duplicate data at:', new Date());
                crawlerJob.cancel();
            }
        })
        .catch((error) => {
            console.error('Cron job for crawler encountered an error:', error);
        });
});