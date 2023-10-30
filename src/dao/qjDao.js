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

async function insertRgData(connection, userId, job, subjectInfo, gpt) {
    const openai = gpt.openai;

    const subjectStrings = subjectInfo.map(subject => `${subject.subjectName}: ${subject.text}`).join('\n');

    const prompt = `This time, you can take the following classes.\n${subjectStrings} And I'm interested in ${job} career. So, Considering my career interest among these subjects, you give each subject a score from 0 to 5. A score of 0 means that it is a subject that I don't need to take, and a score of 5 means that it is a subject that I must take. Sort the results in descending order by the value in 'score'. Let me emphasize this point one more time. Please enter at least 2 sentences for the reason for your recommendation.`;

    const content = prompt + gpt.chatContent;
    const completion = gpt.chatCompletion;
    completion.messages[2].content = content;

    const responseCompletion = await openai.chat.completions.create(completion);
    console.log("-------- gpt completion ---------");
    console.log(responseCompletion.choices[0].message.content); // 이 줄을 추가
    const responseContent = JSON.parse(responseCompletion.choices[0].message.content.replaceAll('\'', '"').replaceAll('`', '"'));

    const insertRgDataQuery = `
        INSERT INTO recommendGPT (userId, title, comment, score)
        VALUES (?, ?, ?, ?);
    `;

    const insertedData = [];
    let rgIdx = null;

    for (const contentObj of responseContent[0].content) {

        const comment = contentObj.comment;
        const score = contentObj.score;

        const insertParams = [userId, responseContent[0].title, comment, score];

        const [insertRow] = await connection.query(insertRgDataQuery, insertParams);

        // Read first of rgIdx
        if (contentObj === responseContent[0].content[0]) {
            const getRgIdxQuery = `
                SELECT rgIdx
                FROM recommendGPT
                ORDER BY rgIdx DESC
                LIMIT 1
            ;`;

            const [result] = await connection.query(getRgIdxQuery);
            rgIdx = result[0].rgIdx;
            console.log("rgIdx:", rgIdx);
        }

        // patch same setIdx
        if (contentObj === responseContent[0].content[responseContent[0].content.length - 1]){
            const patchSetIdxQuery = `
                UPDATE recommendGPT
                SET setIdx = ?
                WHERE rgIdx = ?
            ;`;
            for (var i=0; i < responseContent[0].content.length; i++) {
                await connection.query(patchSetIdxQuery, [rgIdx, rgIdx + i])
            }
            console.log("-------- update setIdx completion ---------")
        }

        insertedData.push
        ({
            userId: userId,
            title: responseContent[0].title,
            comment: comment,
            score: score,
            setIdx: rgIdx
        });
    }

    console.log("--------insert recommendGPT Table completion----------");

    return insertedData;
}

module.exports = {
    getJob,
    getSubjectInfo,
    insertRgData
};