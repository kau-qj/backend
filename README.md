# QJ

### [Node.js]

- `npm run start` 를 통해서 js 파일을 실행한다.
- `npm run swagger-autogen` 를 통해서 swaager api 문서를 자동으로 등록한다.
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

## Description

본 템플릿은 `Node.js`와 `Express` (`Node.js`의 웹 프레임워크)를 기반으로 구성되었다.

## Structure

앞에 (\*)이 붙어있는 파일(or 폴더)은 추가적인 과정 이후에 생성된다.

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

### [Express]

config > express.js 에서 express 프레임워크를 기반으로 한 app 모듈을 export 하도록 하여 어느 폴더에서든 사용할 수 있도록 구성했다.
새로운 도메인을 만들 경우, 해당 파일에 다음과 같이 Route 폴더를 추가하여 express.js에서 만든 app 모듈을 사용할 수 있도록 구성하면 된다.

`app.js`에서 express에서 만든 app이 포트를 Listen 하도록 구성했다.

### [mysql2]

Database는 config > database.js에 mysql2 라이브러리를 사용해 구성했다.
cf. connection을 다 사용했다면 release를 통해 꼭 할당 해제를 해야 한다.

### [winston]

Log는 winston, winston-daily-rotate-file 라이브러리를 사용해 구성했다.