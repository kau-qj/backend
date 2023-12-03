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
    result.details.sort((a, b) => b.score - a.score);

    console.log("--------insert recommendGPT Table completion----------");

    return [result] ;
}

// gpt가 해당 job에 대답한 경험이 있는지 체크
async function getJobCheck(connection, job) {
    const jobCheckQuery = `
        SELECT COUNT(*) as count
        FROM recommendGPT
        WHERE title = ?;
    `;
    
    const [result] = await connection.query(jobCheckQuery, [job]);
    const rowCount = result[0].count;

    // 데이터 유무 체크
    return rowCount;
}

// 랜덤 setIdx 추출
async function getRandomSetIdx(connection, job) {
    const getSetIdxQuery = `
        SELECT DISTINCT setIdx
        FROM recommendGPT
        WHERE title = ?
    ;`;

    const [setIdxRows] = await connection.query(getSetIdxQuery, [job]);
    const setIdxArray = setIdxRows.map(row => row.setIdx);

    // 17개인 setIdx 배열 생성
    const seventeenSetIdx = [];
    for (const setIdx of setIdxArray) {
        const getCountQuery = `
            SELECT COUNT(*) as count
            FROM recommendGPT
            WHERE setIdx = ?;
        `;

        const [countResult] = await connection.query(getCountQuery, [setIdx]);
        const rowCount = countResult[0].count;

        if (rowCount === 17) {
            seventeenSetIdx.push(setIdx);
        }
    }

    // 17개인 setIdx 중에서 랜덤으로 하나 선택
    const randomSetIdx = seventeenSetIdx[Math.floor(Math.random() * seventeenSetIdx.length)];

    return randomSetIdx;
}

// 랜덤 setIdx 바탕으로 데이터 조회
async function insertRgDataWithSetIdx(connection, randomSetIdx, userId) {
    const getDetailsQuery = `
        SELECT title, score, comment
        FROM recommendGPT
        WHERE setIdx = ?
        ORDER BY score DESC;
    `;

    const [detailsRows] = await connection.query(getDetailsQuery, [randomSetIdx]);

    // recommendGPT 테이블에서 가장 마지막 rgIdx 조회
    const getLastRgIdxQuery = `
        SELECT MAX(rgIdx) as lastRgIdx
        FROM recommendGPT;
    `;

    const [lastRgIdxResult] = await connection.query(getLastRgIdxQuery);

    // 새로운 setIdx 할당 (가장 마지막 rgIdx + 1)
    const newSetIdx = lastRgIdxResult[0].lastRgIdx + 1;

    // 결과를 저장할 배열 초기화
    let result = [];

    // 현재 처리 중인 title 초기화
    let currentTitle = null;

    // 각 title에 대한 score와 comment를 저장할 배열 초기화
    let currentDetails = [];

    // 각 행에 대해 반복
    for (const row of detailsRows) {
        const { title, score, comment } = row;

        const insertRgDataQuery = `
            INSERT INTO recommendGPT (userId, setIdx, title, comment, score)
            VALUES (?, ?, ?, ?, ?)
        ;`;

        await connection.query(insertRgDataQuery, [userId, newSetIdx, title, comment, score]);

        // 새로운 title이 시작될 때
        if (title !== currentTitle) {
            // 이전 title에 대한 결과를 저장
            if (currentTitle !== null) {
                result.push({
                    userId: userId,
                    setIdx: newSetIdx,
                    title: currentTitle,
                    details: currentDetails.map(detail => ({
                        comment: detail.comment,
                        score: detail.score,
                    })),
                });
            }

            // 현재 처리 중인 title 및 score, comment 배열 초기화
            currentTitle = title;
            currentDetails = [{ score, comment }];
        } else {
            // 현재 처리 중인 title에 대해 score와 comment를 배열에 추가
            currentDetails.push({ score, comment });
        }
    };

    // 마지막으로 처리된 title에 대한 결과를 저장
    if (currentTitle !== null) {
        result.push({
            userId: userId,
            setIdx: newSetIdx,
            title: currentTitle,
            details: currentDetails.map(detail => ({
                comment: detail.comment,
                score: detail.score,
            })),
        });
    }

    return result;
}


module.exports = {
    insertRgDataWithSetIdx,
    getRandomSetIdx,
    getJobCheck,
    getJob,
    getSubjectInfo,
    insertRgData
};