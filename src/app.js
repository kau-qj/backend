const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database.js');
const { logger } = require('./config/winston.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const userRouter = require('./route/userRouter.js');
const qjRouter = require('./route/qjRouter.js');
const mypageRouter = require('./route/mypageRouter.js');
const jobguideRouter = requie('/.route/jobguideRouter.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', userRouter);
app.use('/', qjRouter);
app.use('/mypage', mypageRouter);
app.use('/jobguide', jobguideRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});