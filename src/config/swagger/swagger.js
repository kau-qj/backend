const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "qj",
      description:
        "kau sanhak qj",
    },
    servers: [
      {
        url: "https://kauqj.shop/", // 요청 URL
        url: "localhost:3000"
      },
    ],
  },
  apis: ["./src/config/swagger/*.yaml"], //Swagger 파일 연동
}
const specs = swaggerJsdoc(options)

module.exports = { swaggerUi, specs }