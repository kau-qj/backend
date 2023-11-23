async function getRecruit(connection) {
    const getRecruitQuery = `
        SELECT title, url
        FROM Recruit
        ORDER BY timestamp DESC
        LIMIT 4;
    `;

    const [recruit] = await connection.query(getRecruitQuery);
    console.log("recruit:", recruit);
    
    return recruit;
}

module.exports = {
    getRecruit
}   