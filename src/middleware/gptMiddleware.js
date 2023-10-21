require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const initializeGPT = () => {
    const configuration = new Configuration({
        apiKey: process.env.OpenAIApi,
    });

    return new OpenAIApi(configuration);
};

const callChatGPT = async (openai, message) => {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are a helpful assistant." }, { role: "user", content: message }],
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling ChatGPT API:", error);
        return null;
    }
};

module.exports = { initializeGPT, callChatGPT };
