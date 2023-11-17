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
 * [PUT] /mypage/info
 */
exports.updateMypageInfo = async function (req, res) {
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