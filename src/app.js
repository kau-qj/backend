// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database');
const { logger } = require('./config/winston.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require('../src/route/userRouter'); // 경로 수정
const mypageRouter = require('../src/route/mypageRouter'); // 경로 수정

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user', userRouter); // 경로 수정
app.use('/mypage', mypageRouter); // 경로 수정

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
