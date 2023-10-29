const mypageService = require('../service/mypageService.js');

// 마이페이지 정보 조회
exports.getMypageInfo = async (req, res) => {
  const userIdx = req.params.userIdx;

  try {
    const userInfo = await mypageService.getMypageInfo(userIdx);
    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: userInfo,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


exports.updateMypageInfo = async (req, res) => {
  try {
    // const userIdx = req.params.userIdx;

    const userIdx = 3;

    const { updatedData } = req.body; // 클라이언트가 변경하려는 정보가 담긴 객체
    console.log(updatedData);

    // 사용자 정보 업데이트를 위해 mypageService의 함수를 호출
    const updatedInfo = await mypageService.updateMypageInfo(userIdx, updatedData);

    if (!updatedInfo) {
      // 업데이트에 실패한 경우
      return res.status(404).json({
        success: false,
        message: 'Failed to update user information',
      });
    }

    // 업데이트가 성공한 경우
    return res.status(200).json({
      success: true,
      data: updatedInfo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// QJ 보관함 정보 조회
exports.getQJStorage = async (req, res) => {
  const userIdx = req.params.userIdx;

  try {
    const qjStorage = await mypageService.getQJStorage(userIdx);
    if (!qjStorage) {
      return res.status(404).json({
        success: false,
        message: 'QJ storage not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: qjStorage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

exports.getProfileInfo = async (req, res) => {
  try {
    const userIdx = req.params.userIdx;

    // 사용자 프로필 정보를 가져오기 위해 mypageService의 함수를 호출
    const userProfile = await mypageService.getProfileInfo(userIdx);

    if (!userProfile) {
      // 정보를 찾을 수 없는 경우
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    // 정보를 성공적으로 가져온 경우
    return res.status(200).json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


// 프로필 설정 수정
exports.updateProfileSettings = async (req, res) => {
  const userIdx = req.params.userIdx;
  const updatedData = req.body; // 클라이언트가 변경하려는 정보가 담긴 객체 

  try {
    const updatedProfile = await mypageService.updateProfileSettings(userIdx, updatedData);
    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile update failed',
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};