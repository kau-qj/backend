const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config/database.js');
const { logger } = require('./config/winston.js');
const { swaggerUi, specs } = require('./config/swagger/swagger.js');
const secret = require('./config/secret.js');

const app = express();
const port = secret.PORT;

// Swagger UI 등록
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

const userRouter = require('./route/userRouter.js');
const qjRouter = require('./route/qjRouter.js');
const mypageRouter = require('./route/mypageRouter.js');
const homeRouter = require('./route/homeRouter.js');
const jobguideRoter = require('./route/jobguideRouter.js');
const boardRouter = require('./route/boardRouter.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', userRouter);
app.use('/qj', qjRouter);
app.use('/mypage', mypageRouter);
app.use('/home', homeRouter);
app.use('/jobguide', jobguideRoter);
app.use('/board', boardRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// 크롤링 스케줄러 실행 코드
require('./crawler/crawler-scheduler.js');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});