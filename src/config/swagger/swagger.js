const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'kau-qj',
    description: 'sanhak',
  },
  host: 'localhost:3000' || 'https://kau-qj.shop/'
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../../app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);