const { response, errResponse } = require('../config/response');
const mypageService = require('../service/mypageService.js');
const baseResponse = require('../config/baseResponseStatus.js');
const mypageProvider = require('../provider/mypageProvider.js');
const baseResponseStatus = require('../config/baseResponseStatus.js');

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

  // userimageUrl가 null이거나 비어있을 경우 에러를 방지하기 위해 체크
  const imageUrl = userimageUrl && userimageUrl.length > 0 ? userimageUrl[0].imageUrl : null;
  const userName = userInfo[0].userName;
  const jobName = userInfo[0].jobName;

  return res.send(response(baseResponse.SUCCESS, { userName, jobName, imageUrl } ));
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
  const updatedUserInfo = await mypageService.updateMypageInfo(userId, userName, major, grade, school, phoneNum);
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

  // userimageUrl가 null이거나 비어있을 경우 에러를 방지하기 위해 체크
  const imageUrl = userimageUrl && userimageUrl.length > 0 ? userimageUrl[0].imageUrl : null;
  const nickName = userInfo[0].nickName;
  const jobName = userInfo[0].jobName;
  
  return res.send(response(baseResponse.SUCCESS, { nickName, jobName, imageUrl }));
}

/**
 * API No. 5
 * API Name : 마이페이지 프로필 정보 수정
 * [PUT] /mypage/profile
 */
exports.updateProfile = async function (req, res, imageUrl) {
  console.log('Entered updateProfile');  // Check if the function is being called

  const userId = req.decoded.userId;
  if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

  const { nickName, jobName } = req.body;

  if (!nickName) return res.send(response(baseResponse.MYPAGE_NICKNAME_EMPTY));

  const userInfo = await mypageProvider.getProfile(userId);
  if(!userInfo) return res.send(response(baseResponse.MYPAGE_USERINFO_FALSE));

  const userIdx = userInfo[0].userIdx;
  
  let updatedImageUrl = imageUrl;
  if (req.file && req.file.location) {
    updatedImageUrl = req.file.location;
  }

  console.log('Updated Image URL:', updatedImageUrl);  // Check the updated value of imageUrl

  const updateInfo = await mypageService.updateProfile(userId, userIdx, nickName, jobName, updatedImageUrl);
  if (updateInfo === null) return res.send(response(baseResponse.NO_UPDATED_VALUES));

  return res.send(response(baseResponse.SUCCESS, updateInfo));
}

/**
 * API No. 6
 * API Name : QJ 보관함(요약조회)
 * [GET] /mypage/qj
 */
exports.getQJStorage = async function (req, res) {
  const userId = req.decoded.userId;
  if (!userId) return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE));

  const qjCheck = await mypageProvider.getQjCheck(userId);
  if (qjCheck === 0) return res.send(response(baseResponse.MYPAGE_QJ_EMPTY));

  const qjStorage = await mypageProvider.getQJ(userId);

  return res.send(response(baseResponse.SUCCESS, qjStorage));
}


/**
 * API No. 7
 * API Name: qj 보관함(상세조회)
 * [GET] /mypage/qj/:setIdx
 */
exports.getqjData = async function (req, res) {

  const userId = req.decoded.userId;
  const setIdx = req.params.setIdx;

  if (!userId) return res.send(response(baseResponseStatus.TOKEN_VERIFICATION_FAILURE));
  if (!setIdx) return res.send(response(baseResponseStatus.MYPAGE_SETIDX_EMPTY));

  const qjData = await mypageProvider.getQJData(setIdx, userId);

  return res.send(response(baseResponseStatus.SUCCESS, qjData));
};