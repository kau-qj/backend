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

/**
 * API No.3
 * API Name: 관심 직무 추가 or 수정
 * [PUT] /jobguide/interestjob
 */
exports.addOrUpdateInterestJob = async (req, res) => {
  /*
 #swagger.tags = ['jobguide']
 #swagger.summary = '관심 직무 추가 또는 수정'
 #swagger.description = '사용자의 관심 직무를 추가하거나 수정합니다.'
 #swagger.parameters['jobname'] = {
   in: 'body',
   required: true,
   type: 'string',
   description: '추가 또는 수정할 관심 직무의 이름',
   example: '데이터 사이언티스트'
 }
 #swagger.responses[1000] = { 
   description: "성공 - 관심 직무 추가 또는 수정 성공",
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
         example: "성공"
       },
       result: {
         type: "string",
         example: "관심 직무가 추가되었습니다. / 관심 직무가 업데이트되었습니다."
       }
     }
   }
 }
 #swagger.responses[9000] = {
   description: "직업 이름 누락",
   schema: {
     type: "object",
     properties: {
       isSuccess: {
         type: "boolean",
         example: false
       },
       code: {
         type: "integer",
         example: 9000
       },
       message: {
         type: "string",
         example: "직업에 대한 정보가 없습니다."
       }
     }
   }
 }
 #swagger.responses[2000] = {
   description: "JWT 토큰 누락",
   schema: {
     type: "object",
     properties: {
       isSuccess: {
         type: "boolean",
         example: false
       },
       code: {
         type: "integer",
         example: 2000
       },
       message: {
         type: "string",
         example: "JWT 토큰을 입력해주세요."
       }
     }
   }
 }
 */

  const userId = req.decoded.userId;
  // console.log(userId); // Ex) ktg
  if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
  
  const jobname = req.body.jobname
  // console.log(jobname); // Ex) 데이터 사이언티스트
  if (!jobname) return res.send(response(baseResponse.JOBGUIDE_JOBNAME_EMPTY));

  const result = await jobguideService.addOrUpdateInterestJob(userId, jobname);
  if (!result) return res.send(baseResponse.JOBGUIDE_ADDINTERESTJOB_FAILED);
  
  return res.send(response(baseResponse.SUCCESS, result));

};


