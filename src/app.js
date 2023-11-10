// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database.js');
const { logger } = require('./config/winston.js');
const swaggerUi = require('swagger-ui-express');
const secret = require('./config/secret.js')

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require('./route/userRouter.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', userRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// 크롤링 스케줄러 실행 코드
require('./crawler/crawler-scheduler.js');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});