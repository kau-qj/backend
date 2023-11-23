const schedule = require('node-schedule');
const runCrawler = require('./recruit.crawler');
const { pool } = require('../config/database');

// 매일 오전 10시 30분과 오후 4시 30분에 크롤러 실행
const crawlerJob = schedule.scheduleJob('30 10,16 * * *', async function () {
    console.log('crawler start:', new Date());
    try {
        const result = await runCrawler(pool); // 데이터베이스 연결 풀을 runCrawler에 전달
        if (result === 'Duplicate data found') {
            console.log('duplicate data:', new Date());
            crawlerJob.cancel();
        }
    } catch (error) {
        console.error('error in crawler:', error);
    }
});
