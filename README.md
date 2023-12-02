# QJ

## 소개
이 문서는 QJ 서비스의 기술적인 부분과 아키텍처에 대한 정보를 제공합니다.

### 기술 스택
- **Node.js**: 서버 측 프로그래밍을 위한 JavaScript 런타임 환경
- **Express.js**: Node.js 웹 애플리케이션 프레임워크
- **MySQL**: 관계형 데이터베이스 시스템
- **AWS**: 클라우드 서비스로써 EC2, RDS, Route53, S3를 사용

## AWS 구성

AWS에서는 다음과 같은 서비스를 사용했습니다.

- **EC2 서버 1대**: 20.04 Ubuntu, t2.micro 인스턴스 사용
- **RDS - MySQL**: 관계형 데이터베이스 서비스
- **Route53**: 도메인 구매 및 관리 (도메인: https://kauqj.shop)
- **S3**: 이미지 파일 URL 처리

## 다이어그램

아래는 서비스 아키텍처를 보여주는 다이어그램입니다.

![QJ 서비스 아키텍처](./qj서비스아키텍처.png)

## 구조

프로젝트는 다음과 같은 구조로 이루어져 있습니다.

```
├── * .github                   # github actions
│   ├── workflows
│   │   ├── deploy.yml          # Continuous Deploy
├── * log                       # 생성된 로그 폴더
├── * node_modules              # 외부 라이브러리 폴더 (package.json 의 dependencies)
├── src
│   ├── config                          # 환경 설정
│   │   ├── baseResponseStatus.js       # Response 시의 Status 모음.
│   │   ├── database.js                 # 데이터베이스 관련 설정
│   │   ├── express.js                  # express Framework 설정 파일
│   │   ├── multer.js                   # S3 설정 파일
│   │   ├── response.js                 # HTTP 요청에 대한 응답을 구성
│   │   ├── winston.js                  # logger 라이브러리 설정
│   │   ├── swagger                     # API 문서
│ 	│   │   ├── board.yaml
│ 	│   │   ├── homepage.yaml
│ 	│   │   ├── jobdictionary.yaml
│ 	│   │   ├── mypage.yaml
│ 	│   │   ├── qj.yaml
│ 	│   │   ├── swagger.js              # swagger 설정
│ 	│   │   ├── user.yaml
│   ├── controller                      # req, res 처리
│ 	│   ├── boardController.js
│ 	│   ├── homeController.js
│ 	│   ├── jobguideController.js
│ 	│   ├── mypageController.js
│ 	│   ├── qjController.js
│ 	│   ├── userController.js
│   ├── controller                      # 크롤링
│ 	│   ├── crawler-scheduler.js        # 크롤링 일정
│ 	│   ├── recruit.crawler.js          # 크롤링 처리 코드
│   ├── dao                             # query 처리
│ 	│   ├── boardDao.js
│ 	│   ├── homeDao.js
│ 	│   ├── jobguideDao.js
│ 	│   ├── mypageDao.js
│ 	│   ├── qjDao.js
│ 	│   ├── userDao.js
│   ├── middleware                      # 미들웨어
│ 	│   ├── jwtMiddleware.js
│ 	│   ├── gptMiddleware.js
│   ├── provider                        # Read 처리
│ 	│   ├── boardProvider.js
│ 	│   ├── homeProvider.js
│ 	│   ├── jobguideProvider.js
│ 	│   ├── mypageProvider.js
│ 	│   ├── qjProvider.js
│ 	│   ├── userProvider.js
│   ├── route                           # route(endpoint) 처리
│ 	│   ├── boardRouter.js
│ 	│   ├── homeRouter.js
│ 	│   ├── jobguideRouter.js
│ 	│   ├── mypageRouter.js
│ 	│   ├── qjRouter.js
│ 	│   ├── userRouter.js
│   ├── service                         # CUD 처리
│ 	│   ├── boardService.js
│ 	│   ├── homeService.js
│ 	│   ├── jobguideService.js
│ 	│   ├── mypageService.js
│ 	│   ├── qjService.js
│ 	│   ├── userService.js
│   ├── app.js                          # 포트 설정 및 시작 파일(상위 라우터)
├── .gitignore                  # git 에 포함되지 않아야 하는 폴더, 파일들을 작성 해놓는 곳
├── LICENSE
├── package-lock.json
├── package.json                # 프로그램 이름, 버전, 필요한 모듈 등 노드 프로그램의 정보를 기술
└── README.md
```