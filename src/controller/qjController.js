// const jwtMiddleware = require("../middleware/jwtMiddleware");
const qjProvider = require("../provider/qjProvider");
const qjService = require("../service/qjService");
const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response");
const { generateFakeData } = require("../provider/qjProvider");
const callGpt35 = require("../middleware/gptMiddleware");


/**
 * API No. 1
 * API Name : 내 직무 강의 추천
 * [GET] /qj
 */
exports.getRecommend = async function (req, res) {
    /**
     * Path Variable: userId
     */
    try {
        const { courseNames, courseDescriptions, myInterest } = generateFakeData();
        const courseInfo = courseNames.map((course, index) => `${course} : ${courseDescriptions[index]}`).join("\n");

        const prompt = `이번에 다음과 같은 과목을 들을 수 있어.\n\n${courseInfo}\n\n 나는 ${myInterest} 진로에 관심이 있어. 그래서 이 과목 중 나의 관심 진로를 고려하여 과목 별로 0점부터 5점까지 하나의 점수를 부여해. 0점은 들을 필요가 없는 과목이고, 5점은 반드시 들어야 되는 과목이라는 뜻이야. 따라서 점수와 점수를 그렇게 준 이유를 알려줘.`;
        
        const gptResponse = await callGpt35(prompt, courseInfo);

        return res.status(200).json(response(200, "Success", { gptResponse }));
    } catch (error) {
        console.error("Error in getRecommend:", error);
        return res.status(500).json(errResponse(500, "Server Error"));
    }
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
