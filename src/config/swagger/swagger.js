const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'kau-qj',
    description: 'sanhak',
  },
  host: 'https://kau-qj.shop/'
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['../../app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);