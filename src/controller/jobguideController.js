const jobguideProvider = require("../provider/jobguideProvider.js");
const jobguideService = require("../service/jobguideService.js");
const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response")

/**
 * API No. 1
 * API Name : 직업 정보 조회
 * [GET] /jobguide/jobdictinfo
 */
exports.getJobDictInfo = async (req, res) => {
  /*
  #swagger.tags = ['jobguide']
  #swagger.summary = '직업 정보 조회'
  #swagger.description = '데이터베이스에 저장된 직업 이름을 조회합니다.'
  #swagger.responses[1000] = { 
    description: "성공 - 직업 정보 조회 성공",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: {
              type: "boolean",
              example: true
            },
            code: {
              type: "integer",
              example: baseResponse.SUCCESS.code
            },
            message: {
              type: "string",
              example: baseResponse.SUCCESS.message
            },
            result: {
              type: "array",
              items: {
                $ref: "#/components/schemas/JobInfo"
              }
            }
          }
        }
      }
    }
  }
  #swagger.responses[9004] = { 
    description: baseResponse.JOBGUIDE_JOBDICTINFO_EMPTY.message,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: {
              type: "boolean",
              example: false
            },
            code: {
              type: "integer",
              example: baseResponse.JOBGUIDE_JOBDICTINFO_EMPTY.code
            },
            message: {
              type: "string",
              example: baseResponse.JOBGUIDE_JOBDICTINFO_EMPTY.message
            }
          }
        }
      }
    }
  }
  #swagger.responses[500] = {
    description: baseResponse.SERVER_ERROR.message,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            isSuccess: {
              type: "boolean",
              example: false
            },
            code: {
              type: "integer",
              example: baseResponse.SERVER_ERROR.code
            },
            message: {
              type: "string",
              example: baseResponse.SERVER_ERROR.message
            }
          }
        }
      }
    }
  }
  */
  const jobDictInfo = await jobguideProvider.getJobDictInfo();
  if(!jobDictInfo) res.send(response(baseResponse.JOBGUIDE_JOBDICTINFO_EMPTY));
  
  return res.send(response(baseResponse.SUCCESS, jobDictInfo));

  // console.error(error);
  // return res.status(500).json({
  //   success: false,
  //   message: 'Internal server error',
  // });

}

/**
* API No.2
* API Name: 직업 세부 정보 조회
* [GET] /jobdetails/:jobname
*/
exports.getJobDetails = async (req, res) => {
  /*
  #swagger.tags = ['jobguide']
  #swagger.summary = '직업 세부 정보 조회'
  #swagger.description = '요청된 직업의 세부 정보를 조회합니다.'
  #swagger.parameters['jobname'] = {
    in: 'path',
    required: true,
    type: 'string',
    description: '세부 정보를 조회할 직업 이름',
    example: '개발자'
  }
  #swagger.responses[1000] = { 
    description: "성공 - 세부 직업 정보 조회 성공",
    schema: {
      type: "object",
      properties: {
        isSuccess: {
          type: "boolean",
          example: true
        },
        code: {
          type: "integer",
          example: 1000
        },
        message: {
          type: "string",
          example: "조회 성공"
        },
        result: {
          $ref: "#/components/schemas/JobDetails"
        }
      }
    }
  }
  #swagger.responses[9000] = {
    description: "직업 이름 누락",
    schema: { $ref: "#/definitions/JOBGUIDE_JOBNAME_EMPTY" }
  }
  #swagger.responses[9007] = {
    description: "이미지 정보 조회 실패",
    schema: { $ref: "#/definitions/JOBGUIDE_IMAGE_FALSE" }
  }
  #swagger.responses[9008] = {
    description: "직업 세부 정보 조회 실패",
    schema: { $ref: "#/definitions/JOBGUIDE_JOBDETAILS_FALSE" }
  }
  #swagger.responses[500] = {
    description: "서버 에러",
    schema: {
      type: "object",
      properties: {
        isSuccess: {
          type: "boolean",
          example: false
        },
        code: {
          type: "integer",
          example: 500
        },
        message: {
          type: "string",
          example: "서버 에러 발생"
        }
      }
    }
  }
  */

  const jobname = req.params.jobname;
  if (!jobname) res.send(response(baseResponse.JOBGUIDE_JOBNAME_EMPTY));


  // jobname을 이용하여 job_directory_images 테이블에서 imageUrl을 가져옵니다.
  const imageUrl = await jobguideProvider.getImageUrlByJobname(jobname);

  if (!imageUrl) {
    // imageUrl이 없을 경우, 실패 응답을 반환합니다.
    return res.send(response(baseResponse.JOBGUIDE_IMAGE_FALSE));
  }

  // 이미지 URL 정보를 response에 추가하여 클라이언트로 전송합니다.
  const jobDetails = await jobguideProvider.getJobDetails(jobname);

  if (!jobDetails) {
    // 직업 세부 정보가 없을 경우, 실패 응답을 반환합니다.
    return res.send(response(baseResponse.JOBGUIDE_JOBDETAILS_FALSE));
  }


  // ...jobDetails: 객체에서 해당 객체의 모든 속성을 다른 객체에 복사하고, 추가적인 속성을 포함
  return res.send(response(baseResponse.SUCCESS, { ...jobDetails, imageUrl }));
}



// 관심 직무 추가하기 -> 최대 3개 jobName1, jobName2, jobName3
// exports.addInterestJob = async (req, res) => {
//   try {
//     const { userIdx, jobname } = req.params; // 사용자 및 직업이름 가져오기

//     if (!jobname) {
//       return res.status(400).json({
//         success: false,
//         message: 'jobname이 제공되지 않았습니다.',
//       });
//     }

//     // 관심 직무 목록 길이 확인
//     // result는 Router -> Controller -> Service -> Dao -> Service -> Controller 가 보낸 정보임.
//     const result = await jobguideService.addInterestJob(userIdx, jobname);

//     if (result === '관심 직무가 추가되었습니다.') {
//       return res.status(200).json({
//         success: true,
//         message: result,
//       });
//     } 
//     else if (result === '최대 3개의 관심 직무가 등록 가능합니다.' || result === '이미 추가되어 있는 관심 직무 입니다.') {
//       return res.status(400).json({
//         success: false,
//         message: result,
//       });
//     }
//     else {
//       return res.status(500).json({
//         success: false,
//         message: '관심 직무 추가 중 오류가 발생했습니다.',
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: '내부 서버 오류',
//     });
//   }
// };


/**
 * API No.3
 * API Name: 관심 직무 추가
 * [POST] /jobguide/interestjobs
 */
  
/*
  #swagger.tags = ['jobguide']
  #swagger.summary = 'User 관심 직무 추가'
  #swagger.description = '유저의 관심 직무를 추가합니다.'
  #swagger.parameters['userIdx'] = {
    in: 'path',
    description: '사용자 인덱스',
    required: true,
    type: 'integer'
  }
  #swagger.parameters['jobname'] = {
    in: 'path',
    description: '직업 이름',
    required: true,
    type: 'string'
  }
  #swagger.responses[1000] = {
    description: "성공 - 관심 직무 추가 성공",
    schema: { $ref: "#/definitions/SuccessResponse" },
    examples: {
      application/json: { isSuccess: true, message: "관심 직무가 추가되었습니다." }
    }
  }
  #swagger.responses[9001] = {
    description: "실패 - 이미 관심 직무가 등록되어 있음",
    schema: { $ref: "#/definitions/ErrorResponse" },
    examples: {
      application/json: { isSuccess: false, message: "이미 관심 직무가 등록되어 있습니다." }
    }
  }
  #swagger.responses[9002] = {
    description: "실패 - 최대 한 개의 관심 직무 등록이 가능함",
    schema: { $ref: "#/definitions/ErrorResponse" },
    examples: {
      application/json: { isSuccess: false, message: "최대 한 개의 관심 직무 등록이 가능합니다." }
    }
  }
  #swagger.responses[9003] = {
    description: "실패 - 해당 직업은 존재하지 않음",
    schema: { $ref: "#/definitions/ErrorResponse" },
    examples: {
      application/json: { isSuccess: false, message: "해당 직업은 존재하지 않습니다." }
    }
  }
  #swagger.responses[500] = {
    description: "실패 - 내부 서버 오류",
    schema: { $ref: "#/definitions/ErrorResponse" },
    examples: {
      application/json: { isSuccess: false, message: "Internal server error" }
    }
  }
  */


// 관심 직무 추가하기
exports.addInterestJob = async (req, res) => {
  const userId = req.decoded.userId;
  // console.log(userId); // Ex) ktg
  if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
  
  const jobname = req.body.jobname
  // console.log(jobname); // Ex) 데이터 사이언티스트
  if (!jobname) return res.send(response(baseResponse.JOBGUIDE_JOBNAME_EMPTY));

  // userId에 해당하는 jobName을 User 테이블에서 조회
  // Ex) 백엔드 개발자
  const currentInterestJobResult = await jobguideProvider.getInterestJob(userId);
  
  // 이미 관심 직무가 있는 경우
  if (currentInterestJobResult) return res.send(response(baseResponse.JOBGUIDE_CHECK_UPDATE_INTERESTJOB));

  // 관심직무가 없는 경우, 관심직무 추가 로직 수행
  const addResult = await jobguideService.addInterestJob(userId, jobname);

  // 관심직무 추가에 실패한 경우
  if (!addResult) return res.send(response(baseResponse.JOBGUIDE_ADDINTERESTJOB_FAILED));
  
  return res.send(response(baseResponse.SUCCESS));

};


/**
 * API No.4
 * API Name: 관심 직무 수정
 * [PUT] /jobguide/interestjobs/:jobname
 */
// 관심 직무 수정하기
exports.updateInterestJob = async (req, res) => {
  const userId = req.decoded.userId;
  if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
  
  const jobname = req.params.jobname; // URL 파라미터에서 jobname을 가져옴
  if (!jobname) return res.send(response(baseResponse.JOBGUIDE_JOBNAME_EMPTY));

  const updateResult = await jobguideService.updateInterestJob(userId, jobname);
  if (!updateResult) return res.send(response(baseResponse.JOBGUIDE_UPDATEINTERESTJOB_FAILED));
  
  return res.send(response(baseResponse.SUCCESS));

};

