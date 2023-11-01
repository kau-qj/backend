const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { pool } = require('./config/database.js');
const { logger } = require('./config/winston.js');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./config/swagger/swagger-output.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));
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