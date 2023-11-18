const { response, errResponse } = require('../config/response');
const mypageService = require('../service/mypageService.js');
const baseResponse = require('../config/baseResponseStatus.js');
const mypageProvider = require('../provider/mypageProvider.js');

// 마이페이지 정보 조회
/**
 * API No. 1
 * API Name : 마이페이지 요약 정보 조회
 * [GET] /mypage
 */
exports.getMypage = async (req, res) => {
/*
#swagger.tags = ['mypage']
#swagger.summary = '마이페이지 조회'
#swagger.description = '마이페이지 첫 화면 요약 정보를 조회합니다.'
#swagger.responses[1000] = {
    description: "성공 - 마이페이지 조회 성공",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    },
                    result: {
                        type: "object",
                        properties: {
                            userName: {
                                type: "string",
                                description: "사용자 이름"
                            },
                            major: {
                                type: "string",
                                description: "전공"
                            },
                            userimageUrl: {
                                type: "string",
                                nullable: true,
                                description: "사용자 프로필 이미지 url"
                            }
                        }
                    }
                }
            }
        }
    }
}

#swagger.responses[3000] = {
    description: "토큰 검증 실패",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            },
            example: {
                isSuccess: false,
                code: 3000,
                message: "JWT 토큰 검증 실패"
            }
        }
    }
}

#swagger.responses[8000] = {
    description: "마이페이지 데이터 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            },
            example: {
                isSuccess: false,
                code: 8000,
                message: "마이페이지에 데이터가 존재하지 않습니다."
            }
        }
    }
}
*/
  const userId = req.decoded.userId;
  if(!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

  const userInfo = await mypageProvider.getMypageInfo(userId);
  if(!userInfo) return res.send(response(baseResponse.MYPAGE_USERINFO_FALSE));
  
  const userIdx = userInfo[0].userIdx

  // 이미지 파일
  const userimageUrl = await mypageProvider.getUserImage(userIdx);

  const userName = userInfo[0].userName;
  const major = userInfo[0].major;

  return res.send(response(baseResponse.SUCCESS, { userName, major, userimageUrl } ));
};

// 마이페이지 개인 정보 모두 조회
/**
 * API No. 2
 * API Name : 내 개인 정보 모두 조회
 * [GET] /mypage/info
 */
exports.getMypageInfo = async function(req, res) {
  /*
#swagger.tags = ['mypage']
#swagger.summary = '마이페이지 조회'
#swagger.description = '마이페이지 상세 개인 정보를 조회합니다.'
#swagger.responses[1000] = {
    description: "성공 - 마이페이지 조회 성공",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    },
                    result: {
                        type: "object",
                        properties: {
                            userName: {
                                type: "string",
                                description: "사용자 이름"
                            },
                            major: {
                                type: "string",
                                description: "전공"
                            },
                            grade : {
                                type: "integer",
                                description: "학년"
                            },
                            school : {
                                type: "string",
                                description: "학교"
                            },
                            phoneNum : {
                                type: "string",
                                description: "휴대전화"
                            }
                        }
                    }
                }
            }
        }
    }
}

#swagger.responses[3000] = {
    description: "토큰 검증 실패",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            },
            example: {
                isSuccess: false,
                code: 3000,
                message: "JWT 토큰 검증 실패"
            }
        }
    }
}

#swagger.responses[8000] = {
    description: "마이페이지 데이터 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            },
            example: {
                isSuccess: false,
                code: 8000,
                message: "마이페이지에 데이터가 존재하지 않습니다."
            }
        }
    }
}
*/
  const userId = req.decoded.userId;
  if(!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

  const userInfo = await mypageProvider.getMypageInfo(userId);
  if(!userInfo) return res.send(response(baseResponse.MYPAGE_USERINFO_FALSE));

  const userName = userInfo[0].userName;
  const major = userInfo[0].major;
  const grade = userInfo[0].grade;
  const school = userInfo[0].school;
  const phoneNum = userInfo[0].phoneNum;

  return res.send(response(baseResponse.SUCCESS, { userName, major, grade, school, phoneNum}));
}

// 마이페이지 개인정보 수정
/**
 * API No. 3
 * API Name : 마이페이지 개인정보 수정
 * [PATCH] /mypage/info
 */
exports.updateMypageInfo = async function (req, res) {
    /*
#swagger.tags = ['mypage']
#swagger.summary = '마이페이지 개인정보 수정'
#swagger.description = '마이페이지에서 개인정보를 수정합니다.'
#swagger.parameters['obj'] = {
    in: 'body',
    description: '수정할 개인정보',
    required: true,
    schema: {
        userName: {
            type: 'string',
            description: '사용자 이름'
        },
        major: {
            type: 'string',
            description: '전공'
        },
        grade: {
            type: 'integer',
            description: '학년'
        },
        school: {
            type: 'string',
            description: '학교'
        },
        phoneNum: {
            type: 'string',
            description: '휴대전화 번호'
        }
    }
}
#swagger.responses[8000] = {
    description: "마이페이지 데이터 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            }
        }
    }
}

#swagger.responses[8002] = {
    description: "수정된 데이터 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            }
        }
    }
}

#swagger.responses[8003] = {
    description: "유저 아이디가 입력되지 않았음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            },
            example: {
                isSuccess: false,
                code: 8003,
                message: "유저 아이디가 입력되지 않았습니다."
            }
        }
    }
}

#swagger.responses[8004] = {
    description: "전공이 입력되지 않았음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            }
        }
    }
}

#swagger.responses[8005] = {
    description: "학년이 입력되지 않았음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            }
        }
    }
}

#swagger.responses[8006] = {
    description: "학교가 입력되지 않았음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            }
        }
    }
}

#swagger.responses[8007] = {
    description: "휴대번호가 입력되지 않았음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            }
        }
    }
}

#swagger.responses[8009] = {
    description: "변경된 값이 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            }
        }
    }
}
*/
  const userId = req.decoded.userId;
  if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

  const { userName, major, grade, school, phoneNum } = req.body;

  // 유효성 검증
  if(!userName) return res.send(response(baseResponse.MYPAGE_USERNAME_EMPTY));
  if(!major) return res.send(response(baseResponse.MYPAGE_MAJOR_EMPTY));
  if(!grade) return res.send(response(baseResponse.MYPAGE_GRADE_EMPTY));
  if(!school) return res.send(response(baseResponse.MYPAGE_SCHOOL_EMPTY));
  if(!phoneNum) return res.send(response(baseResponse.MYPAGE_PHONENUM_EMPTY));

  // 마이페이지 개인 정보 수정
  const updatedUserInfo = await mypageService.updateMypageInfo(userId, { userName, major, grade, school, phoneNum });
  if (updatedUserInfo === null) return res.send(response(baseResponse.NO_UPDATED_VALUES));

  return res.send(response(baseResponse.SUCCESS, updatedUserInfo));
};

/**
 * API No. 4
 * API Name : 마이페이지 프로필 정보 조회
 * [GET] /mypage/profile
 */
exports.getProfile = async function (req, res) {
    /**
#swagger.tags = ['mypage']
#swagger.summary = '마이페이지 프로필 정보 조회'
#swagger.description = '마이페이지에서 닉네임, 관심직무, 프로필 이미지를 조회합니다.'
#swagger.responses[1000] = {
    description: "성공 - 마이페이지 프로필 조회 성공",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    },
                    result: {
                        type: "object",
                        properties: {
                            nickname: {
                                type: "string",
                                description: "닉네임"
                            },
                            jobName: {
                                type: "string",
                                description: "관심직무"
                            },
                            image: {
                                type: "string",
                                nullable: true,
                                description: "프로필 이미지 URL"
                            }
                        }
                    }
                }
            }
        }
    }
}

#swagger.responses[3000] = {
    description: "토큰 검증 실패",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            }
        }
    }
}

#swagger.responses[8000] = {
    description: "마이페이지 데이터 없음",
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    isSuccess: {
                        type: "boolean",
                        description: "성공 여부"
                    },
                    code: {
                        type: "integer",
                        description: "응답 코드"
                    },
                    message: {
                        type: "string",
                        description: "응답 메시지"
                    }
                }
            }
        }
    }
} 
     */
    
  const userId = req.decoded.userId;
  if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

  const userInfo = await mypageProvider.getProfile(userId);
  if(!userInfo) return res.send(response(baseResponse.MYPAGE_USERINFO_FALSE));

  const userIdx = userInfo[0].userIdx;

  // 이미지 파일
  const userimageUrl = await mypageProvider.getUserImage(userIdx);

  const nickname = userInfo[0].nickName;
  const jobName = userInfo[0].jobName;

  return res.send(response(baseResponse.SUCCESS, { nickname: nickname, jobName: jobName, image: userimageUrl}));
}

/**
 * API No. 5
 * API Name : 마이페이지 프로필 정보 수정
 * [PUT] /mypage/profile
 */
exports.updateProfile = async function (req, res) {
  const userId = req.decoded.userId;
  if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

  const { nickName, jobName } = req.body;

  // 유효성 검증
  if(!nickName) return res.send(response(baseResponse.MYPAGE_NICKNAME_EMPTY));

  const updateInfo = await mypageService.updateProfile(userId, nickName, jobName);
  if(updateInfo === null) return res.send(response(baseResponse));

  return updateInfo;
}

/**
 * API No. 6
 * API Name : QJ 보관함
 * [GET] /mypage/qj
 */
exports.QJstorage = async function (req, res) {
  const userId = req.decoded.userId;
  if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));
  
  const qjStorage = await mypageProvider.getQJ(userId);
  if(!qjStorage) return res.send(response(baseResponse.MYPAGE_QJ_EMPTY));

  return qjStorage;
}

// QJ 보관함 정보 조회
// exports.getQJStorage = async (req, res) => {
//   const userIdx = req.params.userIdx;

//   try {
//     const qjStorage = await mypageService.getQJStorage(userIdx);
//     if (!qjStorage) {
//       return res.status(404).json({
//         success: false,
//         message: 'QJ storage not found',
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: qjStorage,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };

// 프로필 이미지 업로드
exports.uploadProfileImage = async (req, res) => {
  try {
    const userId = req.decoded.userId;
    if(!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

    const userInfo = await mypageProvider.getMypageInfo(userId);
    if(!userInfo) return res.send(response(baseResponse.MYPAGE_USERINFO_FALSE));

    const userIdx = userInfo[0].userIdx;
    const image = req.file;

    // 사용자 프로필 이미지 업로드를 위해 mypageService의 함수를 호출
    const imageUrl = await mypageService.uploadProfileImage(userIdx, image);

    if (!imageUrl) {
      return res.status(404).json({
        success: false,
        message: 'Profile image upload failed',
      });
    }

    // 클라이언트에게 이미지 URL을 반환합니다.
    return res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};