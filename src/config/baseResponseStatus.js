module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error 
    SIGNUP_USERID_EMPTY: { "isSuccess": false, "code": 2019, "message": "아이디를 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY: { "isSuccess": false, "code": 2020, "message": "비밀번호를 입력해주세요." },
    SIGNUP_GRADE_EMPTY: { "isSuccess": false, "code": 2021, "message": "학년을 입력해주세요." },
    SIGNUP_MAJOR_EMPTY: { "isSuccess": false, "code": 2022, "message": "전공을 입력해주세요." },
    SIGNUP_PHONENUM_EMPTY: { "isSuccess": false, "code": 2023, "message": "휴대전화번호를 입력해주세요." },
    SIGNUP_SCHOOL_EMPTY: { "isSuccess": false, "code": 2024, "message": "학교를 입력해주세요." },
    SIGNUP_JOBIDX_EMPTY: { "isSuccess": false, "code": 2025, "message": "관심직무를 입력해주세요." },
    // jeonghoon 10.21

    //signup
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    //signin
    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요" },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요" },
    SIGNUP_REDUNDANT_ID : { "isSuccess": false, "code": 2019, "message":"중복된 ID입니다."},

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},

    // Middleware error
    GPT_CONFIGURATION_ERROR : { "isSuccess": false, "code": 5000, "message": "GPT 환경설정 에러"},
    GPT_CALL_ERROR : { "isSuccess": false, "code": 5001, "message": "GPT CALL 에러"},

    // qj
    QJ_JOB_EMPTY : { "isSuccess": false, "code":6000, "message": "관심 직무가 등록되어 있지 않습니다."},
    QJ_SUBJECTINFO_FALSE : { "isSuccess": false, "code": 6001, "message": "과목 조회가 되지 않습니다."},
    QJ_GPT_FALSE : { "isSuccess": false, "code": 6002, "message": "gpt 호출에 에러가 발생했습니다."},
    QJ_JOB_WRONG : { "isSuccess": false, "code": 6003, "message": "관심 직무 입력이 올바르지 않습니다."},

    // home
    HOME_RECRUIT_FALSE : { "isSuccess": false, "code": 7000, "message": "채용 공고가 존재하지 않습니다."},

    // mypage
    MYPAGE_USERINFO_FALSE : { "isSuccess": false, "code": 8000, "message": "마이페이지에 데이터가 존재하지 않습니다."},
    MISSING_REQUIRED_FIELD : { "isSuccess": false, "code": 8001, "message": "수정할 데이터를 모두 입력해주세요."},
    MYPAGE_UPDATE_FAILURE : { "isSuccess": true, "code": 8002, "message": "수정된 데이터가 없습니다."},
    MYPAGE_USERNAME_EMPTY : { "isSuccess": false, "code": 8003, "message": "유저 아이디가 입력되지 않았습니다."},
    MYPAGE_MAJOR_EMPTY : { "isSuccess": false, "code": 8004, "message":"전공이 입력되지 않았습니다."},
    MYPAGE_GRADE_EMPTY : { "isSuccess": false, "code": 8005, "message":"학년이 입력되지 않았습니다."},
    MYPAGE_SCHOOL_EMPTY : { "isSuccess": false, "code": 8006, "message":"학교가 입력되지 않았습니다."},
    MYPAGE_PHONENUM_EMPTY : { "isSuccess": false, "code": 8007, "message":"휴대번호가 입력되지 않았습니다."},
    MYPAGE_NICKNAME_EMPTY : { "isSuccess": false, "code":8008, "message":"닉네임이 입력되지 않았습니다."},
    NO_UPDATED_VALUES : { "isSuccess": true, "code":8009, "message":"변경된 값이 없습니다."},
    MYPAGE_QJ_EMPTY: {"isSuccess": false, "code":8010, "message":"저장된 qj가 없습니다."},
    MYPAGE_SETIDX_EMPTY : {"isSuccess": false, "code":8011, "message":"setIdx(gpt 추천 번호)가 입력되지 않았습니다."},
    MYPAGE_QJ_EMPTY : {"isSuccess": false, "code":8012, "message":"해당 번호는 qj(gpt)가 추천해주지 않았습니다."},

    // jobguide
    JOBGUIDE_JOBNAME_EMPTY : { "isSuccess": false, "code": 9000, "message": "직업에 대한 정보가 없습니다."},
    JOBGUIDE_REDUNDANT_INTERESTJOB : { "isSuccess": false, "code": 9001, "message": "해당 직무는 이미 관심 직무로 등록되어 있습니다."},
    JOBGUIDE_ALREADY_REGISTERED : { "isSuccess": false, "code": 9002, "message": "최대 한 개의 관심 직무 등록이 가능합니다."},
    JOBGUIDE_JOBNAME_NOT_EXIST: { "isSuccess": false, "code": 9003, "message": "해당 직업은 존재하지 않습니다."},
    JOBGUIDE_JOBDICTINFO_EMPTY: { "isSuccess": false, "code": 9004, "message": "직업 정보를 가져오는데 실패했습니다."},  
    JOBGUIDE_INTERESTJOBINFO_FALSE: { "isSuccess": false, "code": 9005, "message": "관심 직무 조회가 되지 않습니다."},
    JOBGUIDE_ADDINTERESTJOB_FAILED: {"isSuccess": false, "code": 9006, "message": "관심 직무를 추가하는데 실패했습니다."},
    JOBGUIDE_IMAGE_FALSE: {"isSuccess": false, "code": 9007, "message": "이미지 정보를 가져오는데 실패했습니다."},
    JOBGUIDE_JOBDETAILS_FALSE: {"isSuccess": false, "code": 9008, "message": "직업 세부 정보를 가져오는데 실패했습니다."},
    JOBGUIDE_CHECK_UPDATE_INTERESTJOB: {"isSuccess:": false, "code": 9009, "message": "관심 직무가 이미 등록되어 있습니다. 관심 직무를 수정하시겠습니까?"},
    JOBGUIDE_UPDATEINTERESTJOB_FAILED: {"isSuccess:": false, "code": 9010, "message": "관심 직무를 수정하는데 실패했습니다."},
    

}