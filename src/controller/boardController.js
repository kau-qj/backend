const boardProvider = require('../provider/boardProvider');
const baseResponse = require('../config/baseResponseStatus');
const { response, errResponse } = require('../config/response');

// 게시물 생성 API
exports.createBoardPost = async (req, res) => {
    try {
        const post = req.body;
        const newPost = await boardProvider.createBoardPost(post);
        return res.json(response(baseResponse.SUCCESS, newPost));
    } catch (error) {
        return res.json(errResponse(baseResponse.DB_ERROR));
    }
};

// 게시물 조회 API
exports.getBoardPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await boardProvider.getBoardPostById(postId);
        if (post.length === 0) {
            return res.json(errResponse(baseResponse.POST_NOT_EXIST));
        }
        return res.json(response(baseResponse.SUCCESS, post[0]));
    } catch (error) {
        return res.json(errResponse(baseResponse.DB_ERROR));
    }
};
