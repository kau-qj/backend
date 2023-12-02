# QJ

## 소개
이 문서는 QJ 서비스의 기술적인 부분과 아키텍처에 대한 정보를 제공합니다.

## Description

본 템플릿은 `Node.js`와 `Express` (`Node.js`의 웹 프레임워크)를 기반으로 구성되었다.

### 기술 스택
- **Node.js**: 서버 측 프로그래밍을 위한 JavaScript 런타임 환경
- **Express.js**: Node.js 웹 애플리케이션 프레임워크
- **MySQL**: 관계형 데이터베이스 시스템
- **AWS**: 클라우드 서비스로써 EC2, RDS, Route53, S3를 사용

### Express

`config/express.js`에서 Express 프레임워크를 기반으로 한 `app` 모듈을 export하여 어느 폴더에서든 사용할 수 있도록 구성했습니다. 새로운 도메인을 만들 경우, 해당 파일에 Route 폴더를 추가하여 `express.js`에서 만든 `app` 모듈을 사용할 수 있도록 구성하면 됩니다. `app.js`에서 Express에서 만든 `app`이 포트를 Listen하도록 구성했습니다.

### MySQL

Database는 `config/database.js`에 `mysql2` 라이브러리를 사용하여 구성했습니다. Connection을 다 사용했다면 `release`를 통해 꼭 할당 해제를 해야 합니다.

### Winston

Log는 `winston`, `winston-daily-rotate-file` 라이브러리를 사용하여 구성했습니다.

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

- `npm run start` 를 통해서 js 파일을 실행한다.
- node는 js 파일을 실행할 때 `package.json` 이라는 파일을 통해서 어떤 환경으로 구동하는지, 어떤 라이브러리들을 썼는지(dependencies) 등의 기본적인 설정값 들을 참고한다.
- `npm install` npm(node package manager)을 통해 package.json에 있는 dependencies 등을 참고하여 node_modules 폴더를 생성하고 라이브러리 파일을 다운로드 한다. 이 라이브러리들은 사용하고 싶은 파일에서 require 하여 사용할 수 있다.

### Comparison

3개 템플릿 모두 다음과 같이 Request에 대해 DB 단까지 거친 뒤, 다시 Controller로 돌아와 Response 해주는 구조를 갖는다. 구조를 먼저 이해하고 템플릿을 사용하자.

> `Request` -> Route -> Controller -> Service -> DAO -> DB
> DB -> DAO -> Service -> Controller -> Route -> `Response`

#### Node.js (패키지매니저 = npm)

> Request(시작) / Response(끝) ⇄ Router (*Route.js) ⇄ Controller (*Controller.js) ⇄ Service (CRUD *Service.js) ⇄ DAO (DB *Dao.js)

### Validation

서버 API 구성의 기본은 Validation을 잘 처리하는 것이다. 외부에서 어떤 값을 날리든 Validation을 잘 처리하여 서버가 터지는 일이 없도록 유의하자.
값, 형식, 길이 등의 형식적 Validation은 Controller에서,
DB에서 검증해야 하는 의미적 Validation은 Service에서 처리하면 된다.