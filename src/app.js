const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config/database.js');
const { logger } = require('./config/winston.js');
const swaggerUi = require('swagger-ui-express');
const secret = require('./config/secret.js');

const app = express();
const port = secret.PORT;

// 크롤링 스케줄러 실행 코드
const runCrawler = require('./crawler/crawler-scheduler');

// 크롤링 스케줄러를 매일 오전 10시 30분과 오후 4시 30분에 실행
runCrawler();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./config/swagger/swagger-output-localhost.json'), { explorer: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./config/swagger/swagger-output-server.json'), { explorer: true }));
const userRouter = require('./route/userRouter.js');
const qjRouter = require('./route/qjRouter.js');
const mypageRouter = require('./route/mypageRouter.js');
const homeRouter = require('./route/homeRouter.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', userRouter);
app.use('/qj', qjRouter);
app.use('/mypage', mypageRouter);
app.use('/home', homeRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});