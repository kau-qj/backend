// 관심 직무 조회
async function getJob(connection, userId) {
    const getJobQuery = `
        SELECT jobName
        FROM User
        WHERE userId = ?;
    `;

    const [job] = await connection.query(getJobQuery, userId);
    return job[0].jobName;
}


// 과목 데이터 조회
async function getSubjectInfo(connection) {
    const getSubjectInfoQuery = `
        SELECT subjectName, text
        FROM Subject;
    `;

    const [subjects] = await connection.query(getSubjectInfoQuery);
    // console.log("subject:", subjects);
    // const subjectInfo = {};

    // for (const subject of subjects) {
    //     const subjectName = subject.subjectName;
    //     const text = subject.text;

    //     subjectInfo[subjectName] = text;
    // }

    // console.log("subjectInfo:", subjectInfo);

    return subjects;
}

async function insertRgData(userId, job, subjectInfo, gpt) {
    const openai = gpt.openai;

    const subjectStrings = subjectInfo.map(subject => `${subject.subjectName}: ${subject.text}`).join('\n');

    const prompt = `This time, you can take the following classes.\n${subjectStrings} And I'm interested in ${job} career. So, Considering my career interest among these subjects, you give each subject a score from 0 to 5. A score of 0 means that it is a subject that I don't need to take, and a score of 5 means that it is a subject that I must take.`;

    const content = prompt + gpt.chatContent;
    const completion = gpt.chatCompletion;
    completion.messages[2].content = content;

    const responseCompletion = await openai.chat.completions.create(completion);
    console.log("-------- gpt completion ---------");
    const responseContent = JSON.parse(responseCompletion.choices[0].message.content.replaceAll('\'', '"').replaceAll('`', '"'));

    return responseContent[0].content;
}

module.exports = {
    getJob,
    getSubjectInfo,
    insertRgData
};