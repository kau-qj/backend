const swaggerAutogen = require('swagger-autogen')();

const outputFile1 = './swagger-output-localhost.json';
const outputFile2 = './swagger-output-server.json';

const endpointsFiles = ['../../app.js'];

const doc1 = {
  info: {
    title: 'kau-qj (localhost)',
    description: 'sanhak on localhost',
  },
  host: 'localhost:3000', // 로컬 개발 환경의 호스트와 포트
};

const doc2 = {
  info: {
    title: 'kau-qj (kauqj.shop)',
    description: 'sanhak on kauqj.shop',
  },
  host: 'kauqj.shop', // 실제 서버 도메인
  schemes: ['https'],
};

swaggerAutogen(outputFile1, endpointsFiles, doc1);
swaggerAutogen(outputFile2, endpointsFiles, doc2);