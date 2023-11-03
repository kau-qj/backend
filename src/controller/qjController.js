// const jwtMiddleware = require("../middleware/jwtMiddleware");
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
    /*
    #swagger.tags = ['qj']
    #swagger.summary = '내 관심 직무 강의 추천'
    #swagger.description = '내 관심 직무를 바탕으로 강의를 추천해줍니다.'
    #swagger.responses[1000] = {
        description: "성공 - 강좌 정보 조회",
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        isSuccess: {
                            type: "boolean",
                            description: "요청 성공 여부 (true)"
                        },
                        code: {
                            type: "integer",
                            description: "응답 코드 (1000)"
                        },
                        message: {
                            type: "string",
                            description: "응답 메시지 (성공)"
                        },
                        result: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    userId: {
                                        type: "string",
                                        description: "사용자 ID"
                                    },
                                    title: {
                                        type: "string",
                                        description: "내 관심직무"
                                    },
                                    comment: {
                                        type: "string",
                                        description: "강의 이름 - 점수 이유"
                                    },
                                    score: {
                                        type: "integer",
                                        description: "점수"
                                    },
                                    setIdx: {
                                        type: "integer",
                                        description: "질문 번호"
                                    }
                                }
                            }
                        }
                    },
                    example: {
                        isSuccess: true,
                        code: 1000,
                        message: "성공",
                        result: [
                            {
                                userId: "pjk",
                                title: "백엔드 개발자",
                                comment: "시스템프로그래밍 - 서버 개발자에게 필수적인 시스템 수준 지식을 다루며, 어셈블리 언어 관점에서 학습 가능합니다.",
                                score: 5,
                                setIdx: 436
                            },
                        ]
                    }
                }
            }
        }
    }
    #swagger.responses[6000] = {
        description: "실패 - 관심 직무가 등록되어 있지 않습니다.",
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
                            description: "응답 코드 (6000)"
                        },
                        message: {
                            type: "string",
                            description: "응답 메시지 (관심 직무가 등록되어 있지 않습니다.)"
                        }
                    },
                    example: {
                        isSuccess: false,
                        code: 6000,
                        message: "실패 - 관심 직무가 등록되어 있지 않습니다."
                    }
                }
            }
        }
    }
    #swagger.responses[6001] = {
        description: "실패 - 과목 조회가 되지 않습니다.",
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
                            description: "응답 코드 (6001)"
                        },
                        message: {
                            type: "string",
                            description: "응답 메시지 (과목 조회가 되지 않습니다.)"
                        }
                    },
                    example: {
                        isSuccess: false,
                        code: 6001,
                        message: "실패 - 과목 조회가 되지 않습니다."
                    }
                }
            }
        }
    }
    #swagger.responses[6002] = {
        description: "실패 - gpt 호출에 에러가 발생했습니다.",
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
                            description: "응답 코드 (6002)"
                        },
                        message: {
                            type: "string",
                            description: "응답 메시지 (gpt 호출에 에러가 발생했습니다.)"
                        }
                    },
                    example: {
                        isSuccess: false,
                        code: 6002,
                        message: "실패 - gpt 호출에 에러가 발생했습니다."
                    }
                }
            }
        }
    }
    */


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
    const responseGetData = await qjService.insertRgData(userId, job, subjectInfo, gpt);
    console.log("GPT END : " + Date(0).toString());

    return res.send(response(baseResponse.SUCCESS, responseGetData));
}

/**
 * API No. 2
 * API Name : 다른 직무 강의 추천
 * [POST] /qj/newJob
 */
exports.postInputJobRecommend = async function (req, res) {
    /**
     #swagger.tags = ['qj']
     #swagger.summary = '내 관심 직무 강의 추천'
     #swagger.description = '내 관심 직무를 바탕으로 강의를 추천해줍니다.'
     #swagger.parameters['job'] = {
         in: 'body',
         description: '사용자의 관심 직무',
         required: true,
         type: 'string'
     }
     #swagger.responses[1000] = {
         description: "성공 - 강좌 정보 조회",
         content: {
             "application/json": {
                 schema: {
                     type: "object",
                     properties: {
                         isSuccess: {
                             type: "boolean",
                             description: "요청 성공 여부 (true)"
                         },
                         code: {
                             type: "integer",
                             description: "응답 코드 (1000)"
                         },
                         message: {
                             type: "string",
                             description: "응답 메시지 (성공)"
                         },
                         result: {
                             type: "array",
                             items: {
                                 type: "object",
                                 properties: {
                                     userId: {
                                         type: "string",
                                         description: "사용자 ID"
                                     },
                                     title: {
                                         type: "string",
                                         description: "내 관심직무"
                                     },
                                     comment: {
                                         type: "string",
                                         description: "강의 이름 - 점수 이유"
                                     },
                                     score: {
                                         type: "integer",
                                         description: "점수"
                                     },
                                     setIdx: {
                                         type: "integer",
                                         description: "질문 번호"
                                     }
                                 }
                             }
                         }
                     }
                 }
             }
         }
     }
     #swagger.responses[6001] = {
         description: "실패 - 과목 조회가 되지 않습니다.",
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
                             description: "응답 코드 (6001)"
                         },
                         message: {
                             type: "string",
                             description: "응답 메시지 (과목 조회가 되지 않습니다.)"
                         }
                     }
                 }
             }
         }
     }
     #swagger.responses[6002] = {
         description: "실패 - gpt 호출에 에러가 발생했습니다.",
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
                             description: "응답 코드 (6002)"
                         },
                         message: {
                             type: "string",
                             description: "응답 메시지 (gpt 호출에 에러가 발생했습니다.)"
                         }
                     }
                 }
             }
         }
     }
     #swagger.responses[6003] = {
         description: "실패 - 관심 직무가 등록되어 있지 않습니다.",
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
                             description: "응답 코드 (6000)"
                         },
                         message: {
                             type: "string",
                             description: "응답 메시지 (관심 직무가 등록되어 있지 않습니다.)"
                         }
                     }
                 }
             }
         }
     }
     */

    /**
     * Path Variable: userId
     * Body: job
     */

    const job = req.body.job;
    if (!job) return res.send(response(baseResponse.QJ_JOB_WRONG));
    const userId = 'pjk';

    // 과목 정보
    const subjectInfo = await qjProvider.getSubjectInfo();
    if (!subjectInfo) return res.send(response(baseResponse.QJ_SUBJECTINFO_FALSE));
    const gpt = req.gpt;

    console.log("GPT START : " + Date(0).toString());
    console.log("job:", job);
    const responsePostData = await qjService.insertRgData(userId, job, subjectInfo, gpt);
    console.log("GPT END : " + Date(0).toString());

    return res.send(response(baseResponse.SUCCESS, responsePostData));
}