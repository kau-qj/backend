const qjProvider = require("../provider/qjProvider");
const qjService = require("../service/qjService");
const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response");


/**
 * API No. 1
 * API Name : 내 직무 강의 추천
 * [GET] /qj/myJob
 */
exports.getRecommend = async function (req, res) {

    const userId = req.decoded.userId;
    if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

    // 관심 직무
    const job = await qjProvider.getJob(userId);
    if (!job) return res.send(response(baseResponse.QJ_JOB_EMPTY));

    // 최적화
    const jobCheck = await qjProvider.getJobCheck(job);
    
    if (jobCheck == 0) {
        // 과목 정보
        // const subjectInfo = await qjProvider.getSubjectInfo();
        // if (!subjectInfo) return res.send(response(baseResponse.QJ_SUBJECTINFO_FALSE));
        // const gpt = req.gpt;

        // console.log("GPT START : " + Date(0).toString());
        // const responseGetData = await qjService.insertRgData(userId, job, subjectInfo, gpt);
        // console.log("GPT END : " + Date(0).toString());
        // return res.send(response(baseResponse.SUCCESS, responseGetData));
    } else {
        const responseGetData = await qjProvider.getRgData(job, userId);
        return res.send(response(baseResponse.SUCCESS, responseGetData));
    }
}

/**
 * API No. 2
 * API Name : 다른 직무 강의 추천
 * [POST] /qj/newJob
 */
exports.postInputJobRecommend = async function (req, res) {
    
    /**
     * Body: job
     */

    const job = req.body.job;
    if (!job) return res.send(response(baseResponse.QJ_JOB_WRONG));

    const userId = req.decoded.userId;
    if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE)); 

    // 최적화
    const jobCheck = await qjProvider.getJobCheck(job);
    
    if (jobCheck == 0) {
        // 과목 정보
        // const subjectInfo = await qjProvider.getSubjectInfo();
        // if (!subjectInfo) return res.send(response(baseResponse.QJ_SUBJECTINFO_FALSE));
        // const gpt = req.gpt;

        // console.log("GPT START : " + Date(0).toString());
        // const responseGetData = await qjService.insertRgData(userId, job, subjectInfo, gpt);
        // console.log("GPT END : " + Date(0).toString());
        // return res.send(response(baseResponse.SUCCESS, responseGetData));
    } else {
        const responseGetData = await qjProvider.getRgData(job, userId);
        return res.send(response(baseResponse.SUCCESS, responseGetData));
    }
}