const jwtMiddleware = require('../middleware/jwtMiddleware');
const boardService = require('../service/boardService');
const boardProvider = require('../provider/boardProvider');
const baseResponse = require('../config/baseResponseStatus');
const {response, errResponse} = require('../config/response');

// 게시글 생성
exports.createPost = async function (req, res) {
    const {postName, userId, title, mainText, postType, userIdx} = req.body;

    if (!postName) return res.send(response(baseResponse.POST_NAME_EMPTY));
    if (!title) return res.send(response(baseResponse.POST_TITLE_EMPTY));
    if (!mainText) return res.send(response(baseResponse.POST_MAIN_TEXT_EMPTY));

    const createPostResponse = await boardService.createPost(postName, userId, title, mainText, postType, userIdx);

    return res.send(createPostResponse);
};

// 게시글 조회
exports.getPosts = async function (req, res) {
    const getPostsResponse = await boardProvider.retrievePosts();

    return res.send(response(baseResponse.SUCCESS, getPostsResponse));
};

// 게시글 수정
exports.updatePost = async function (req, res) {
    const {postIdx} = req.params;
    const {title, mainText} = req.body;

    if (!title) return res.send(response(baseResponse.POST_TITLE_EMPTY));
    if (!mainText) return res.send(response(baseResponse.POST_MAIN_TEXT_EMPTY));

    const updatePostResponse = await boardService.updatePost(postIdx, title, mainText);

    return res.send(updatePostResponse);
};

// 게시글 삭제
exports.deletePost = async function (req, res) {
    const {postIdx} = req.params;

    const deletePostResponse = await boardService.deletePost(postIdx);

    return res.send(deletePostResponse);
};
