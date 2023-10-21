// const jwtMiddleware = require("../middleware/jwtMiddleware");
const qjProvider = require("../provider/qjProvider");
const qjService = require("../service/qjService");
const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
 * API Name : 내 직무 강의 추천
 * [GET] /qj
 */
exports.getRecommend = async function (req, res) {
    /**
     * Path Variable: userId
     */
//     const courseDescription = 
//     try {
//     }
}

/**
 * API No. 2
 * API Name : 다른 직무 강의 추천
 * [POST] /qj
 */
exports.postRecommend = async function (req, res) {
    /**
     * Path Variable: userId
     * Body: job
     */
}
