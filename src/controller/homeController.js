// const jwtMiddleware = require("../middleware/jwtMiddleware");
const homeProvider = require("../provider/homeProvider");
const homeService = require("../service/homeService");
const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response");

/**
 * API No. 1
 * API Name : 광고 이미지 조회
 * [GET] /home
 */
exports.getAddvertisements = async (req, res) => {
    /**
     * #swagger.tags = ['Home']
     */

    /**
     * const userId = req.decoded.userId;
     * if (!userId) {return res.status(401).json(errResponse(baseResponse.UNAUTHORIZED));}
     */

}


/**
 * API No. 2
 * API Name: 채용 공고 조회
 * [GET] /home
 *
 */
exports.getRecruit = async (req, res) => {
    
//    const userId = req.decoded.userId;
//    if(!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

    const userId = 'csb';
    
    const recruit = await homeProvider.getRecruit();
    if (!recruit) return res.send(response(baseResponse.HOME_RECRUIT_FALSE));

    return res.send(response(baseResponse.SUCCESS, recruit));
}