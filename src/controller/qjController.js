// const jwtMiddleware = require("../middleware/jwtMiddleware");
const qjProvider = require("../provider/qjProvider");
const qjService = require("../service/qjService");
const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response");


/**
 * API No. 1
 * API Name : 내 직무 강의 추천
 * [POST] /qj/myJob
 */
exports.postRecommend = async function (req, res) {
    /**
     * Path Variable: jwt(userId)
     * 유저 Id의 index를 받아와서 관심 직무 얻어오기
     * user 테이블과 subject 테이블 활용하기
     */


    /**
    * const userId = jwt...
    * if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE))
    * 
    */

    const userId = 'pjk';

    // 관심 직무
    const job = await qjProvider.getJob(userId);
    if (!job) return res.send(response(baseResponse.QJ_JOB_EMPTY));

    // 과목 정보
    const subjectInfo = await qjProvider.getSubjectInfo();
    if (!subjectInfo) return res.send(response(baseResponse.QJ_SUBJECTINFO_FALSE));
    const gpt = req.gpt;

    console.log("GPT START : " + Date(0).toString());
    const responsePostData = await qjService.insertRgData(userId, job, subjectInfo, gpt);
    console.log("GPT END : " + Date(0).toString());

    return res.send(response(baseResponse.SUCCESS, responsePostData));
}

/**
 * API No. 2
 * API Name : 다른 직무 강의 추천
 * [POST] /qj/newJob
 */
exports.postInputJobRecommend = async function (req, res) {
    /**
     * Path Variable: userId
     * Body: job
     */

    const job = req.query;
    const userId = 'pjk';

    // 과목 정보
    const subjectInfo = await qjProvider.getSubjectInfo();
    if (!subjectInfo) return res.send(response(baseResponse.QJ_SUBJECTINFO_FALSE));
    const gpt = req.gpt;

    console.log("GPT START : " + Date(0).toString());
    const responsePostData = await qjService.insertRgData(userId, job, subjectInfo, gpt);
    console.log("GPT END : " + Date(0).toString());

    return res.send(response(baseResponse.SUCCESS, responsePostData));
}