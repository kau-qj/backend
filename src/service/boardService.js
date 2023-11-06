const boardDao = require('../dao/boardDao');

// 게시물 생성
exports.createBoardPost = async (post) => {
    try {
        const newPost = await boardDao.createBoardPost(post);
        return newPost;
    } catch (error) {
        throw new Error(error.message);
    }
};

// 게시물 조회
exports.getBoardPostById = async (postId) => {
    try {
        const post = await boardDao.getBoardPostById(postId);
        return post;
    } catch (error) {
        throw new Error(error.message);
    }
};
