const puppeteer = require('puppeteer');
const { pool } = require('../config/database');

async function run() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        let countSavedItems = 0;

        for (let i = 1; ; i++) {
            await page.goto(`https://career.kau.ac.kr/ko/recruit/intro/school/list/1/${i}`);

            const isPageEmpty = await page.evaluate(() => document.querySelector('#ModuleBoardunivListForm > ul > li') === null);
            if (isPageEmpty) break;

            const articles = await page.evaluate(() => {
                let titleNodes = document.querySelectorAll('#ModuleBoardunivListForm > ul > li > span.title > a');
                let titles = Array.from(titleNodes).map(node => node.innerText);
                let urls = Array.from(titleNodes).map(node => 'https://career.kau.ac.kr' + node.getAttribute('href'));
                return titles.map((title, i) => ({ title, url: urls[i] }));
            });

            for (let article of articles) {
                if (article.title.startsWith('[')) {
                    const isDuplicate = await isExistInDatabase(article);
                    if (isDuplicate) {
                        console.log('Duplicate data found. Stopping the crawler.');
                        await browser.close();
                        return 'Duplicate data found';
                    }
                    await saveToDatabase(article);
                    countSavedItems++;

                    // 7의 배수 개수마다 13초 대기
                    if (countSavedItems % 7 === 0) {
                        console.log(`Waiting for 13 seconds after saving ${countSavedItems} items...`);
                        await new Promise(resolve => setTimeout(resolve, 13000));
                    }
                }
            }
        }

        console.log('Crawler completed successfully.');
    } catch (error) {
        console.error('Crawler encountered an error:', error);
    } finally {
        await browser.close();
    }
}

async function isExistInDatabase(article) {
    const connection = await pool.getConnection(async conn => conn);
    let isDuplicate = false;

    try {
        const query = 'SELECT COUNT(*) as count FROM Recruit WHERE title = ? AND url = ?';
        const [rows] = await connection.execute(query, [article.title, article.url]);
        isDuplicate = rows[0].count > 0;
    } catch (err) {
        console.log('Database Error:', err);
    } finally {
        connection.release();
    }

    return isDuplicate;
}

async function saveToDatabase(article) {
    const connection = await pool.getConnection(async conn => conn);

    try {
        await connection.beginTransaction();

        const query = 'INSERT INTO Recruit (title, url) VALUES (?, ?)';
        await connection.execute(query, [article.title, article.url]);
        console.log(`Inserted: ${article.title}`);

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        console.log('Database Error:', err);
    } finally {
        connection.release();
    }
}

module.exports = run;