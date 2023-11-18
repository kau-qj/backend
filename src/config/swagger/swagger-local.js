const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output-local.json'; // 로컬 Swagger 스펙 파일 경로
const endpointsFiles = ['../../app.js']; // 경로를 적절히 조정하세요.

const doc = {
  info: {
    title: 'kau-qj Local API',
    description: 'sanhak on localhost (for backend developers)',
  },
  host: 'localhost:3000', // 로컬 개발 환경의 호스트와 포트
  schemes: ['http'], // 로컬 환경은 HTTP를 사용
};

swaggerAutogen(outputFile, endpointsFiles, doc);