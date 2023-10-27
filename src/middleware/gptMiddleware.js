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
                { role: "system", content: "You only need to answer three. The format is ‘school class name’, ‘score’, and ‘reason’. I'll guide you through it, so please wait now."},
                { role: "user", content: ''},
            ],
        };

        req.gpt.chatContent = `
        Say only JSON Object format like
        [
            {
                "title": thisRecommendTitle
                "content": [
                    {
                        "Subject Name": ,
                        "score": ,
                        "reason": ,
                    }
                ]
            }
        ](You must follow the answer method I gave you in the beginning. ‘Subject name’, ‘Score’, ‘Reason’. The meaning of 'Reason' here means why the score for that subject was given that way. Now let's take an example of my question. Please note that this is just an example.)
        
        example 1.
        [
            {
                "title": "Recommendation Scores for 2023 2nd Semester Courses for Server Developer",
                "content": [
                    {
                        "Subject Name": "프로그래밍입문",
                        "score": 3,
                        "reason": "Covers basic programming fundamentals for server development, excluding advanced topics."
                    },
                    {
                        "Subject Name": "컴퓨터구조론",
                        "score": 4,
                        "reason": "Understanding computer systems is crucial for server developers, and this course provides relevant knowledge."
                    },
                    {
                        "Subject Name": "알고리즘 해석 및 설계",
                        "score": 5,
                        "reason": "Efficient algorithm design is essential for server development, and this course helps in learning it."
                    },
                    {
                        "Subject Name": "Adventure Design",
                        "score": 2,
                        "reason": "This design-related course has limited direct relevance to server development."
                    },
                    {
                        "Subject Name": "AI입문",
                        "score": 2,
                        "reason": "Artificial Intelligence is related to server development, but this course covers only basic concepts."
                    },
                    {
                        "Subject Name": "임베디드SW입문",
                        "score": 2,
                        "reason": "There is limited relevance between embedded software and server development."
                    },
                    {
                        "Subject Name": "AI프로그래밍",
                        "score": 3,
                        "reason": "Useful if interested in machine learning and AI programming."
                    },
                    {
                        "Subject Name": "객체지향프로그래밍",
                        "score": 4,
                        "reason": "Object-oriented programming is essential for server development, and this course covers it."
                    },
                    {
                        "Subject Name": "시스템프로그래밍",
                        "score": 5,
                        "reason": "Understanding system-level aspects is essential for server developers, and this course covers it from an assembly language perspective."
                    },
                    {
                        "Subject Name": "웹SW스튜디오 및 재능기부",
                        "score": 4,
                        "reason": "Web programming skills are valuable for server development, and this course provides project experience."
                    },
                    {
                        "Subject Name": "산학프로젝트",
                        "score": 5,
                        "reason": "Practical project experience is crucial for server developers, and this course allows you to implement real projects."
                    },
                    {
                        "Subject Name": "데이터베이스기초",
                        "score": 4,
                        "reason": "Database knowledge is a core aspect of server development, and this course covers it."
                    },
                    {
                        "Subject Name": "IoT",
                        "score": 3,
                        "reason": "Understanding IoT and cloud connectivity can be beneficial for server development."
                    },
                    {
                        "Subject Name": "데이터사이언스응용",
                        "score": 3,
                        "reason": "Useful if interested in data-driven server development."
                    },
                    {
                        "Subject Name": "정보보호",
                        "score": 4,
                        "reason": "Understanding system security is essential for server developers, and this course covers it."
                    },
                    {
                        "Subject Name": "딥러닝응용",
                        "score": 2,
                        "reason": "This course has limited direct relevance to server development."
                    },
                    {
                        "Subject Name": "인공지능플래닝",
                        "score": 2,
                        "reason": "This course has limited direct relevance to server development."
                    }
                ]
            }
        ]

        Example 2.
        [
            {
                "title": "Recommendation Scores for 2023 2nd Semester Courses for Security",
                "content": [
                    {
                        "Subject Name": "프로그래밍입문",
                        "score": 3,
                        "reason": "Covers basic programming fundamentals for server development, excluding advanced topics."
                    },
                    {
                        "Subject Name": "컴퓨터구조론",
                        "score": 4,
                        "reason": "Understanding computer systems is crucial for server developers, and this course provides relevant knowledge."
                    },
                    {
                        "Subject Name": "알고리즘 해석 및 설계",
                        "score": 5,
                        "reason": "Efficient algorithm design is essential for server development, and this course helps in learning it."
                    },
                    {
                        "Subject Name": "Adventure Design",
                        "score": 2,
                        "reason": "This design-related course has limited direct relevance to server development."
                    },
                    {
                        "Subject Name": "AI입문",
                        "score": 2,
                        "reason": "Artificial Intelligence is related to server development, but this course covers only basic concepts."
                    },
                    {
                        "Subject Name": "임베디드SW입문",
                        "score": 2,
                        "reason": "There is limited relevance between embedded software and server development."
                    },
                    {
                        "Subject Name": "AI프로그래밍",
                        "score": 3,
                        "reason": "Useful if interested in machine learning and AI programming."
                    },
                    {
                        "Subject Name": "객체지향프로그래밍",
                        "score": 4,
                        "reason": "Object-oriented programming is essential for server development, and this course covers it."
                    },
                    {
                        "Subject Name": "시스템프로그래밍",
                        "score": 5,
                        "reason": "Understanding system-level aspects is essential for server developers, and this course covers it from an assembly language perspective."
                    },
                    {
                        "Subject Name": "웹SW스튜디오 및 재능기부",
                        "score": 4,
                        "reason": "Web programming skills are valuable for server development, and this course provides project experience."
                    },
                    {
                        "Subject Name": "산학프로젝트",
                        "score": 5,
                        "reason": "Practical project experience is crucial for server developers, and this course allows you to implement real projects."
                    },
                    {
                        "Subject Name": "데이터베이스기초",
                        "score": 4,
                        "reason": "Database knowledge is a core aspect of server development, and this course covers it."
                    },
                    {
                        "Subject Name": "IoT",
                        "score": 3,
                        "reason": "Understanding IoT and cloud connectivity can be beneficial for server development."
                    },
                    {
                        "Subject Name": "데이터사이언스응용",
                        "score": 3,
                        "reason": "Useful if interested in data-driven server development."
                    },
                    {
                        "Subject Name": "정보보호",
                        "score": 4,
                        "reason": "Understanding system security is essential for server developers, and this course covers it."
                    },
                    {
                        "Subject Name": "딥러닝응용",
                        "score": 2,
                        "reason": "This course has limited direct relevance to server development."
                    },
                    {
                        "Subject Name": "인공지능플래닝",
                        "score": 2,
                        "reason": "This course has limited direct relevance to server development."
                    }
                ]
            }
        ]
        
        Example 3.
        [
            {
                "title": "Recommendation Scores for 2023 2nd Semester Courses for 클라우드 구축",
                "content": [
                    {
                        "Subject Name": "프로그래밍입문",
                        "score": 3,
                        "reason": "Covers basic programming fundamentals, which can be useful for understanding cloud technologies."
                    },
                    {
                        "Subject Name": "컴퓨터구조론",
                        "score": 4,
                        "reason": "Understanding computer systems is essential for cloud infrastructure, and this course provides relevant knowledge."
                    },
                    {
                        "Subject Name": "알고리즘 해석 및 설계",
                        "score": 4,
                        "reason": "Efficient algorithm design is beneficial for optimizing cloud-based applications."
                    },
                    {
                        "Subject Name": "Adventure Design",
                        "score": 2,
                        "reason": "This design-related course has limited direct relevance to cloud infrastructure."
                    },
                    {
                        "Subject Name": "AI입문",
                        "score": 2,
                        "reason": "Artificial Intelligence concepts can be applied to cloud-based services but this course covers only basic concepts."
                    },
                    {
                        "Subject Name": "임베디드SW입문",
                        "score": 2,
                        "reason": "Limited relevance between embedded software and cloud infrastructure."
                    },
                    {
                        "Subject Name": "AI프로그래밍",
                        "score": 3,
                        "reason": "Understanding AI programming can be useful for AI services on the cloud."
                    },
                    {
                        "Subject Name": "객체지향프로그래밍",
                        "score": 3,
                        "reason": "Object-oriented programming is a valuable skill for cloud application development."
                    },
                    {
                        "Subject Name": "시스템프로그래밍",
                        "score": 4,
                        "reason": "Understanding system-level aspects is relevant for cloud infrastructure, and this course covers it."
                    },
                    {
                        "Subject Name": "웹SW스튜디오 및 재능기부",
                        "score": 3,
                        "reason": "Web programming skills are important for cloud development, and this course provides practical experience."
                    },
                    {
                        "Subject Name": "산학프로젝트",
                        "score": 5,
                        "reason": "Practical project experience is crucial for cloud development, and this course allows you to implement real projects."
                    },
                    {
                        "Subject Name": "데이터베이스기초",
                        "score": 4,
                        "reason": "Database knowledge is fundamental for cloud services, and this course covers it."
                    },
                    {
                        "Subject Name": "IoT",
                        "score": 3,
                        "reason": "Understanding IoT and cloud connectivity can be beneficial for cloud infrastructure."
                    },
                    {
                        "Subject Name": "데이터사이언스응용",
                        "score": 3,
                        "reason": "Data science skills can be applied to cloud data analysis, making this course relevant."
                    },
                    {
                        "Subject Name": "정보보호",
                        "score": 4,
                        "reason": "Understanding security is crucial for cloud services, and this course covers it."
                    },
                    {
                        "Subject Name": "딥러닝응용",
                        "score": 2,
                        "reason": "Limited relevance to cloud infrastructure."
                    },
                    {
                        "Subject Name": "인공지능플래닝",
                        "score": 2,
                        "reason": "Limited relevance to cloud infrastructure."
                    }
                ]
            }
        ]
        You always say things in the form of examples, like the examples I gave. And it is in JSON format, the Subject Name uses Korean and English exactly as I showed in the example, and the rest is written in English as an example. The examples are just examples. This is a guide on how to answer, so you can answer based on the description of the 'explanation about class' and 'job of interest' that I provide.
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