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
    const subjectNames = subjectInfo.map(subject => subject.subjectName);
    const subjectStrings = subjectInfo.map(subject => `${subject.subjectName}: ${subject.text}`).join('\n');

    const prompt = `The courses I can take this semester are as follows.\n${subjectNames}\nDescriptions of the subjects are as follows.\n${subjectStrings}\nI'm interested in ${job} career. Please let me know 'score' and 'reason for the score' based on the ${job} I am interested in for each subject ${subjectNames}, you give each subject a score from 0 to 5. A score of 0 means that it is a subject that I don't need to take, and a score of 5 means that it is a subject that I must take. Let me emphasize this point one more time. Sort the results in descending order by the value in 'score'.\nYou only need to reply with the suggested answer for ${job}. Returns the ${job} of interest as 'title'.\n Be sure to keep this in mind, The three examples I gave included 'class name' and 'reason for score' in 'comment'. Also, it would be nice to write the reason in 'comment' a little more specifically. Your answer also follows the rules of title, content, and comment - "subject Name" - "reason of score" within the content in the format of my three examples.\n ${subjectNames} must exist in your answer with the same name. It should not be omitted, added or duplicated to ${subjectNames} here. And don't change the subjects name arbitrarily.`;

    const content = prompt + gpt.chatContent;
    const completion = gpt.chatCompletion;
    completion.messages[2].content = content;

    const responseCompletion = await openai.chat.completions.create(completion);
    console.log("-------- gpt completion ---------");
    
    const responseContent = JSON.parse(responseCompletion.choices[0].message.content.replaceAll('\'', '"').replaceAll('`', '"').replace(/""/g, '"'));

    const insertRgDataQuery = `
        INSERT INTO recommendGPT (userId, title, comment, score)
        VALUES (?, ?, ?, ?);
    `;

    const insertedData = [];
    let rgIdx = null;

    const result = {
        userId: userId,
        title: responseContent.title,
        setIdx: null,
        details: []
    };

    for (const contentObj of responseContent.content) {

        const comment = contentObj.comment;
        const score = contentObj.score;

        const insertParams = [userId, responseContent.title, comment, score];

        const [insertRow] = await connection.query(insertRgDataQuery, insertParams);

        // Read first of rgIdx
        if (contentObj === responseContent.content[0]) {
            const getRgIdxQuery = `
                SELECT rgIdx
                FROM recommendGPT
                ORDER BY rgIdx DESC
                LIMIT 1
            ;`;

            const [resultRow] = await connection.query(getRgIdxQuery);
            rgIdx = resultRow[0].rgIdx;
            result.setIdx = rgIdx;
            console.log("rgIdx:", rgIdx);
        }

        // patch same setIdx
        if (contentObj === responseContent.content[responseContent.content.length - 1]){
            const patchSetIdxQuery = `
                UPDATE recommendGPT
                SET setIdx = ?
                WHERE rgIdx = ?
            ;`;
            for (var i=0; i < responseContent.content.length; i++) {
                await connection.query(patchSetIdxQuery, [rgIdx, rgIdx + i])
            }
            console.log("-------- update setIdx completion ---------")
        }

        insertedData.push
        ({
            userId: userId,
            title: responseContent.title,
            comment: comment,
            score: score,
            setIdx: rgIdx
        });

        result.details.push({ comment: comment, score: score });
    }

    console.log("--------insert recommendGPT Table completion----------");

    return [result] ;
}

module.exports = {
    getJob,
    getSubjectInfo,
    insertRgData
};