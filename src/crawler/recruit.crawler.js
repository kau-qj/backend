const puppeteer = require('puppeteer-core');
const { pool } = require('../config/database');

async function runCrawler(connection) {
    const browser = await puppeteer.launch({
        headless: true, // 헤드리스 모드로 실행
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        executablePath: '/usr/bin/chromium-browser', // EC2에 설치된 Chromium의 경로
    });

    const page = await browser.newPage();

    try {
        let countSavedItems = 0;

        for (let i = 1;; i++) {
            await page.goto(`https://career.kau.ac.kr/ko/recruit/intro/school/list/1/${i}`, { timeout: 90000 });

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
                    const isDuplicate = await isExistInDatabase(article, connection);
                    if (isDuplicate) {
                        console.log('중복된 데이터가 발견되어 크롤러가 중지되었습니다.');
                        return '중복된 데이터가 발견되었습니다';
                    }
                    await saveToDatabase(article, connection);
                    countSavedItems++;

                    // 7의 배수 개수마다 13초 대기
                    if (countSavedItems % 7 === 0) {
                        console.log(`${countSavedItems}개 아이템 저장 후 13초 대기 중...`);
                        await new Promise(resolve => setTimeout(resolve, 13000));
                    }
                }
            }
        }

        console.log('크롤러가 성공적으로 완료되었습니다.');
    } catch (error) {
        console.error('크롤러에서 오류가 발생했습니다:', error);
    } finally {
        await connection.release(); // connection을 닫습니다.
        await browser.close(); // puppeteer 실행이 완료되면 브라우저를 닫습니다.
    }
}

async function isExistInDatabase(article, connection) {
    let isDuplicate = false;

    try {
        const query = 'SELECT COUNT(*) as count FROM Recruit WHERE title = ? AND url = ?';
        const [rows] = await connection.execute(query, [article.title, article.url]);
        isDuplicate = rows[0].count > 0;
    } catch (err) {
        console.log('데이터베이스 오류:', err);
    }

    return isDuplicate;
}

async function saveToDatabase(article, connection) {
    try {
        await connection.beginTransaction();

        const query = 'INSERT INTO Recruit (title, url) VALUES (?, ?)';
        await connection.execute(query, [article.title, article.url]);
        console.log(`삽입됨: ${article.title}`);

        await connection.commit();
    } catch (err) {
        await connection.rollback();
        console.log('데이터베이스 오류:', err);
    } finally {
        connection.release(); // connection을 닫습니다.
    }
}

module.exports = runCrawler;