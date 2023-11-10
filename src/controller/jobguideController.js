const jobguideService = require('../service/jobguideService.js');

// 진로사전 정보 조회
exports.getJobDictInfo = async (req, res) => {
  const keyword = req.params.keyword; // 검색할 키워드

  try {
    const jobDictInfo = await jobguideService.getJobDictInfo(keyword);
    return res.status(200).json({
      success: true,
      data: jobDictInfo,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// 직업 세부 정보 조회
exports.getJobDetails = async (req, res) => {
  const jobname = req.params.jobname;

  try {
    const jobDetails = await jobguideService.getJobDetails(jobname);
    if (!jobDetails) {
      return res.status(404).json({
        success: false,
        message: 'Job details not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: jobDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


// 관심 직무 추가하기
exports.addInterestJob = async (req, res) => {
  try {
    const { userIdx, jobname } = req.params; // 사용자 및 직업이름 가져오기

    if (!jobname) {
      return res.status(400).json({
        success: false,
        message: 'jobname이 제공되지 않았습니다.',
      });
    }

    // 관심 직무 목록 길이 확인
    const result = await jobguideService.addInterestJob(userIdx, jobname);

    if (result === '관심 직무가 추가되었습니다.') {
      return res.status(200).json({
        success: true,
        message: result,
      });
    } 
    else if (result === '최대 3개의 관심 직무가 등록 가능합니다.' || result === '이미 추가되어 있는 관심 직무 입니다.') {
      return res.status(400).json({
        success: false,
        message: result,
      });
    } 
    else {
      return res.status(500).json({
        success: false,
        message: '관심 직무 추가 중 오류가 발생했습니다.',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: '내부 서버 오류',
    });
  }
};


// 관심 직무 업데이트(수정)
exports.updateInterestJob = async (req, res) => {
  const { userIdx } = req.params;

  try {
    const InterestJobInfo = await jobguideService.updateInterestJob(userIdx);
    if (!InterestJobInfo) {
      return res.status(404).json({
        success: false,
        message: '관심직무가 없습니다.',
      });
    }

    return res.status(200).json({
      success: true,
      data: InterestJobInfo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


exports.getMyInterestJobInfo = async (req, res) => {
  const userIdx = req.params.userIdx; // 검색할 키워드

  try {
    const interestJobInfo = await jobguideService.getMyInterestJobInfo(userIdx);
    return res.status(200).json({
      success: true,
      data: interestJobInfo,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};