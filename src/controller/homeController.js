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
    /*
    #swagger.tags = ['home']
    #swagger.summary = '채용 공고 조회'
    #swagger.description = '최근 채용 공고 목록을 가져옵니다.'
    #swagger.responses[1000] = {
        description: "성공 - 채용 공고 목록 조회 성공",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        result: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: {
                                        type: "string",
                                        description: "채용 공고 제목"
                                    },
                                    url: {
                                        type: "string",
                                        description: "채용 공고 URL"
                                    }
                                }
                            }
                        }
                    }
                },
                example: {
                    result: [
                        {
                            title: "[삼성전자로지텍] 2023년도 하반기 신입사원 채용",
                            url: "https://career.kau.ac.kr/ko/recruit/intro/school/view/11432?p=1"
                        },
                        {
                            title: "[한국석유관리원] 2023년 직무중심 정규직 신입직원 채용",
                            url: "https://career.kau.ac.kr/ko/recruit/intro/school/view/11430?p=1"
                        },
                        {
                            title: "[하나자산신탁] 2023년 하반기 신입사원 채용",
                            url: "https://career.kau.ac.kr/ko/recruit/intro/school/view/11428?p=1"
                        },
                        {
                            title: "[이스트스프링자산운용] 2024 상반기 인턴채용(주식/채권)",
                            url: "https://career.kau.ac.kr/ko/recruit/intro/school/view/11421?p=1"
                        }
                    ]
                }
            }
        }
    }
    
    #swagger.responses[7000] = {
        description: "실패 - 채용 공고가 존재하지 않습니다.",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        isSuccess: {
                            type: "boolean",
                            description: "요청 실패 여부 (false)"
                        },
                        code: {
                            type: "integer",
                            description: "응답 코드 (7000)"
                        },
                        message: {
                            type: "string",
                            description: "응답 메시지 (채용 공고가 존재하지 않습니다.)"
                        }
                    }
                },
                example: {
                    isSuccess: false,
                    code: 7000,
                    message: "실패 - 채용 공고가 존재하지 않습니다."
                }
            }
        }
    }
    */
   const userId = req.decoded.userId;
   if(userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
    
    const recruit = await homeProvider.getRecruit();
    if (!recruit) return res.send(response(baseResponse.HOME_RECRUIT_FALSE));

    return res.send(response(baseResponse.SUCCESS, recruit));
}