const jwtMiddleware = require('../middleware/jwtMiddleware');
const boardService = require('../service/boardService');
const boardProvider = require('../provider/boardProvider');
const baseResponse = require('../config/baseResponseStatus');
const {response, errResponse} = require('../config/response');

// 게시글 생성
exports.createPost = async function (req, res) {
    const {postName, title, mainText, postType} = req.body;
    // const userId = req.decoded.userId;
    const userId = "csb";

    if (!postName) return res.send(response(baseResponse.POST_NAME_EMPTY));
    if (!title) return res.send(response(baseResponse.POST_TITLE_EMPTY));
    if (!mainText) return res.send(response(baseResponse.POST_MAIN_TEXT_EMPTY));
    if (mainText.length > 65535) return res.send(response(baseResponse.POST_MAIN_TEXT_TOO_LONG));

    const createPostResponse = await boardService.createPost(postName, userId, title, mainText, postType);

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
    // const userIdFromJWT = req.decoded.userId; // JWT에서 userId 가져오기
    const userIdFromJWT = "csb";

    if (!title) return res.send(response(baseResponse.POST_TITLE_EMPTY));
    if (!mainText) return res.send(response(baseResponse.POST_MAIN_TEXT_EMPTY));

    // 게시글 내용이 너무 긴 경우
    if (mainText.length > 65535) return res.send(response(baseResponse.POST_MAIN_TEXT_TOO_LONG));

    const post = await boardProvider.retrievePost(postIdx); // 게시글 조회

    // 게시글이 존재하지 않는 경우
    if (!post) return res.send(response(baseResponse.POST_NOT_FOUND));

    // JWT의 userId와 게시글의 작성자가 일치하지 않는 경우
    if (post[0].userId !== userIdFromJWT) return res.send(response(baseResponse.POST_NOT_WRITER));

    const updatePostResponse = await boardService.updatePost(postIdx, title, mainText);

    return res.send(updatePostResponse);
};

// 게시글 삭제
exports.deletePost = async function (req, res) {
    const {postIdx} = req.params;
    // const userIdFromJWT = req.decoded.userId; // JWT에서 userId 가져오기
    const userIdFromJWT = "csb";
 
    const post = await boardProvider.retrievePost(postIdx); // 게시글 조회

    // 게시글이 존재하지 않는 경우
    if (!post) return res.send(response(baseResponse.POST_NOT_FOUND));

    // JWT의 userId와 게시글의 작성자가 일치하지 않는 경우
    if (post[0].userId !== userIdFromJWT) return res.send(response(baseResponse.POST_NOT_WRITER));

    const deletePostResponse = await boardService.deletePost(postIdx);

    return res.send(deletePostResponse);
};