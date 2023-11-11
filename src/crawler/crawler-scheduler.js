const cron = require('node-cron');
const runCrawler = require('./recruit.crawler');

// 크롤링 스케줄러를 매일 오전 10시 30분과 오후 4시 30분에 실행
const job = cron.schedule('30 10,16 * * *', async function() {
    console.log('Cron job for crawler started at:', new Date());
    await runCrawler();
});

// 서버가 시작될 때 크롤링 스케줄러를 직접 실행
if (job) {
    job.start();
}