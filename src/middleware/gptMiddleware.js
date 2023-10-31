const { errResponse } = require("../config/response");
const baseResponse = require("../config/baseResponseStatus");

const OpenAI = require('openai');
require('dotenv').config();

const gptMiddleware = async function(req, res, next) {

    try{
        req.gpt = {};

        req.gpt.openai = new OpenAI({
            apiKey: process.env.OPENAI_SECRET_KEY
        });

        req.gpt.chatCompletion = {
            model: "gpt-3.5-turbo-16k",
            messages: [
                { role: "system", content: "You are a software developer who recommends IT jobs to others."},
                { role: "system", content: "You only need to answer three. The format is 'comment', ‘score’. I'll guide you through it, so please wait now."},
                { role: "user", content: ''},
            ],
        };

        req.gpt.chatContent = `
        Say only JSON Object format like
        [
            {
                "title": job variable of interest
                "content": [
                    {
                        "comment": "'subjectName' - 'reason'",
                        "score": ,
                    }
                ]
            }
        ](You must follow the answer method I gave you in the beginning. ‘comment’, ‘score’. Here, 'comment' will contain the class name and reason. I will give you the class name, and you will decide the reason. The meaning of 'reason' here means why the score for that subject was given that way. Now let's take an example of my question. Please note that this is just an example.)
        
        example 1.
        [
            {
                "title": "백엔드 개발자",
                "contents": [
                    {
                        "comment": "시스템프로그래밍 - 서버 개발자에게 필수적인 시스템 수준 지식을 다루며, 어셈블리 언어 관점에서 학습 가능합니다.",
                        "score": 5
                    },
                    {
                        "comment": "산학프로젝트 - 실제 프로젝트 경험은 서버 개발자에게 중요하며, 이 강좌에서 실제 프로젝트를 구현할 수 있습니다.",
                        "score": 5
                    },
                    {
                        "comment": "컴퓨터구조론 - 컴퓨터 시스템을 이해하는 것은 서버 개발자에게 필수이며, 이 강좌는 관련 지식을 제공합니다.",
                        "score": 4
                    },
                    {
                        "comment": "객체지향프로그래밍 - 객체 지향 프로그래밍은 서버 개발에 필수적이며, 이 강좌에서 다룹니다.",
                        "score": 4
                    },
                    {
                        "comment": "웹SW스튜디오 및 재능기부 - 웹 프로그래밍 기술은 서버 개발에 가치가 있으며, 이 강좌에서 프로젝트 경험을 얻을 수 있습니다.",
                        "score": 4
                    },
                    {
                        "comment": "데이터베이스기초 - 데이터베이스 지식은 서버 개발의 핵심 요소이며, 이 강좌에서 다룹니다.",
                        "score": 4
                    },
                    {
                        "comment": "정보보호 - 시스템 보안을 이해하는 것은 서버 개발자에게 필수이며, 이 강좌에서 다룹니다.",
                        "score": 4
                    },
                    {
                        "comment": "프로그래밍입문 - 서버 개발의 기본 프로그래밍 기술을 다루지만, 고급 주제는 다루지 않습니다.",
                        "score": 3
                    },
                    {
                        "comment": "IoT - IoT와 클라우드 연결 이해는 서버 개발에 도움이 될 수 있습니다.",
                        "score": 3
                    },
                    {
                        "comment": "데이터사이언스응용 - 데이터 기반 서버 개발에 관심이 있는 경우 유용합니다.",
                        "score": 3
                    },
                    {
                        "comment": "AI프로그래밍 - 머신 러닝과 인공지능 프로그래밍에 관심이 있는 경우 유용합니다.",
                        "score": 3
                    },
                    {
                        "comment": "AI입문 - 인공지능은 서버 개발과 관련이 있지만 이 강좌는 기본 개념만 다룹니다.",
                        "score": 2
                    },
                    {
                        "comment": "Adventure Design - 이 디자인 관련 강좌는 서버 개발과 직접적인 관련성이 제한적입니다.",
                        "score": 2
                    },
                    {
                        "comment": "임베디드SW입문 - 임베디드 소프트웨어와 서버 개발 간의 직접적인 관련성이 제한적입니다.",
                        "score": 2
                    },
                    {
                        "comment": "딥러닝응용 - 이 강좌는 서버 개발과 직접적인 관련성이 제한적입니다.",
                        "score": 2
                    },
                    {
                        "comment": "인공지능플래닝 - 이 강좌는 서버 개발과 직접적인 관련성이 제한적입니다.",
                        "score": 2
                    }
                ]
            }
        ]

        Example 2.
        [
            {
                "title": "보안 직무에 대한 관심",
                "content": [
                    {
                        "comment": "정보보호 - 보안 직무에 필수적인 암호 및 시스템 보안 기술을 다루는 이 과목은 반드시 수강해야 합니다.",
                        "score": 5
                    },
                    {
                        "comment": "컴퓨터구조론 - 보안 전문가로서 컴퓨터 시스템을 이해하는 것은 중요하지만 다른 과목보다 중요도가 낮습니다.",
                        "score": 4
                    },
                    {
                        "comment": "알고리즘 해석 및 설계 - 복잡한 문제를 해결하기 위한 효율적인 알고리즘 설계는 보안에 필수적입니다.",
                        "score": 4
                    },
                    {
                        "comment": "시스템프로그래밍 - 시스템 수준 이해는 보안 전문가로서 필수이며, 어셈블리 언어 관점에서 공부하는 이 과목이 중요합니다.",
                        "score": 4
                    },
                    {
                        "comment": "산학프로젝트 - 실무 프로젝트 경험은 보안 직무에 필수이며, 이 과목은 중요합니다.",
                        "score": 4
                    },
                    {
                        "comment": "웹SW스튜디오 및 재능기부 - 웹 프로그래밍 기술은 유용하지만 핵심 보안 과목에 비해 중요도가 낮습니다.",
                        "score": 3
                    },
                    {
                        "comment": "데이터베이스기초 - 데이터베이스 지식은 중요하지만 다른 핵심 과목에 비해 중요도가 낮습니다.",
                        "score": 3
                    },
                    {
                        "comment": "IoT - IoT 및 클라우드 연결에 대한 이해는 유용하지만 핵심 보안 과목보다 중요도가 낮습니다.",
                        "score": 3
                    },
                    {
                        "comment": "프로그래밍입문 - 프로그래밍 기술은 보안 분야에서 필요하지만, 이 과목은 기초 수준이며 다른 주요 과목에 비해 중요도가 낮습니다.",
                        "score": 2
                    },
                    {
                        "comment": "AI입문 - 인공지능 기초를 이해하는 것은 보안 분야에서 유용하지만, 이 과목은 기본 개념만 다루며 중요도가 낮습니다.",
                        "score": 2
                    },
                    {
                        "comment": "AI프로그래밍 - 인공지능 프로그래밍 기술은 보안 분야에서 유용할 수 있지만, 중요한 보안 과목에 비해 중요도가 낮습니다.",
                        "score": 2
                    },
                    {
                        "comment": "객체지향프로그래밍 - 객체 지향 프로그래밍을 이해하는 것은 보안 분야에서 중요하지만, 이 과목은 중요한 보안 주제에 비해 중요도가 낮습니다.",
                        "score": 2
                    },
                    {
                        "comment": "Adventure Design - 이 디자인 과목은 보안 직무와 직접적인 관련성이 없으며, 다른 과목에 비해 중요도가 낮습니다.",
                        "score": 1
                    },
                    {
                        "comment": "임베디드SW입문 - 임베디드 소프트웨어는 보안과 직접적인 관련성이 적으며, 중요도가 낮습니다.",
                        "score": 1
                    },
                    {
                        "comment": "딥러닝응용 - 보안 직무와 직접적인 관련성이 낮습니다.",
                        "score": 1
                    },
                    {
                        "comment": "인공지능플래닝 - 보안 직무와 직접적인 관련성이 낮습니다.",
                        "score": 1
                    }
                ]
            }
        ]
        
        Example 3.
        [
            {
                "title": "클라우드 구축",
                "content": [
                    {
                        "comment": "정보보호 - 클라우드 시스템 보안이 중요하며, 암호 및 시스템 보안 기술을 다루는 과목으로 반드시 수강 필요",
                        "score": 5
                    },
                    {
                        "comment": "컴퓨터구조론 - 클라우드 시스템을 이해하기 위해 컴퓨터 아키텍처에 대한 이해가 필요하며, 중요한 핵심 과목",
                        "score": 4
                    },
                    {
                        "comment": "알고리즘 해석 및 설계 - 클라우드 시스템의 성능 향상을 위해 알고리즘 이해가 중요하며, 중요한 핵심 과목",
                        "score": 4
                    },
                    {
                        "comment": "시스템프로그래밍 - 클라우드 시스템과 하드웨어 관련 지식은 중요하며, 중요한 핵심 과목",
                        "score": 4
                    },
                    {
                        "comment": "데이터베이스기초 - 클라우드 시스템에서 데이터 관리가 중요하며, 중요한 핵심 과목",
                        "score": 4
                    },
                    {
                        "comment": "데이터사이언스응용 - 클라우드 시스템에서 데이터 분석과 응용이 중요하며, 중요한 핵심 과목",
                        "score": 4
                    },
                    {
                        "comment": "산학프로젝트 - 실무 프로젝트 경험은 중요하며, 클라우드 구축에 도움이 되므로 중요한 핵심 과목",
                        "score": 4
                    },
                    {
                        "comment": "웹SW스튜디오 및 재능기부 - 클라우드 관련 웹 애플리케이션 개발 능력 습득에 도움이 되지만 중요성은 중간 정도",
                        "score": 3
                    },
                    {
                        "comment": "IoT - 클라우드와 IoT 연계가 중요하나 중요성은 중간 정도",
                        "score": 3
                    },
                    {
                        "comment": "객체지향프로그래밍 - 프로그래밍 기술 향상에 도움이 되나, 중요성은 중간 정도",
                        "score": 3
                    },
                    {
                        "comment": "딥러닝응용 - 클라우드 시스템과 딥러닝 연계 가능하나 중요성은 중간 정도",
                        "score": 3
                    },
                    {
                        "comment": "인공지능플래닝 - 클라우드 시스템과 인공지능 연계 가능하나 중요성은 중간 정도",
                        "score": 3
                    },
                    {
                        "comment": "프로그래밍입문 - 클라우드 구축 직무에서 프로그래밍 기술은 필요하지만, 이 과목은 기초 수준이므로 중간 정도의 중요성",
                        "score": 3
                    },
                    {
                        "comment": "AI입문 - 인공지능은 클라우드 시스템에 응용될 수 있지만, 이 과목은 기초적이므로 중간 정도의 중요성",
                        "score": 2
                    },
                    {
                        "comment": "AI프로그래밍 - 인공지능과 클라우드 시스템 연계 가능하나, 중요성은 중간 정도",
                        "score": 2
                    },
                    {
                        "comment": "웹SW스튜디오 및 재능기부 - 클라우드 구축과 직접적인 관련성이 낮아 낮은 점수",
                        "score": 1
                    },
                    {
                        "comment": "Adventure Design - 디자인 측면의 과목으로, 클라우드 구축과 직접적인 관련성이 낮아 낮은 점수",
                        "score": 1
                    },
                    {
                        "comment": "임베디드SW입문 - 클라우드 구축과 관련성이 없어 들을 필요 없음",
                        "score": 0
                    }
                ]
            }
        ]
        You always say things in the form of examples, like the examples I gave. And it is in JSON format, the Subject Name uses Korean and English exactly as I showed in the example, and the rest is written in Korean as an example. The examples are just examples. This is a guide on how to answer, so you can answer based on the description of the 'explanation about class' and 'job of interest' that I provide. The three examples I gave included 'class name' and 'reason for score' in 'comment'. Be sure to keep this in mind. Also, it would be nice to write the reason in 'comment' a little more specifically.
        `;
        next();
    } catch (error) {
        if (error instanceof OpenAI.APIError) {
            console.error(error.status);
            console.error(error.message);
            console.error(error.code);
            console.error(error.type);
        } else {
            console.log(error);
        }
    }
};

module.exports = gptMiddleware;