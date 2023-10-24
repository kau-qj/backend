const OpenAI = require('openai');
require('dotenv').config();

const runGPT35 = async function(prompt, courseInfo) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_SECRET_KEY
    });
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            message: [
                { role: "system", content: "You are a software developer who recommends IT jobs to others."},
                { role: "system", content: `${courseInfo}`},
                { role: "user", content: "I am a college student majoring in software engineering. And I dream of becoming a backend developer. This semester, I am taking the course ‘Database Basics: Understanding and Using Database Basics’. Considering my professional interests, I applied a scale of 0 to 5 for the topic ‘Database Fundamentals’. Your score should say one thing. A score of 0 means a subject that does not need to be completed, and a score of 5 means a subject that must be completed. And tell me why you gave that score."},
                { role: "assistant", content: "It's a very important part of the final development, and as a backend developer, the ability to understand and utilize data management and processing is essential. Taking the 'Database Fundamentals' course will be a great help in acquiring essential knowledge and skills as a back-end developer. In this course, you will learn database design, query writing, data management, and integration with backend systems to help you build a successful career as a backend developer. Therefore, I gave it 5 points.(only korean)"},
                { role: "user", content: prompt }
            ]
        });
        console.log(completion.data.choices[0].message.content);
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

module.exports = runGPT35;