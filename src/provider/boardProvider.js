const boardService = require('../service/boardService');

// 게시물 생성
exports.createBoardPost = async (post) => {
    const newPost = await boardService.createBoardPost(post);
    return newPost;
};

// 게시물 조회
exports.getBoardPostById = async (postId) => {
    const post = await boardService.getBoardPostById(postId);
    return post;
};
