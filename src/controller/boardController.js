const jwtMiddleware = require('../middleware/jwtMiddleware');
const boardService = require('../service/boardService');
const boardProvider = require('../provider/boardProvider');
const baseResponse = require('../config/baseResponseStatus');
const {response, errResponse} = require('../config/response');

// 게시글 생성
exports.createPost = async function (req, res) {
    const {postName, Title, mainText, postType} = req.body;
    const userId = req.decoded.userId; 
    // const userId = "csb";

    if (!postName) return res.send(errResponse(baseResponse.POST_NAME_EMPTY));
    if (!Title) return res.send(errResponse(baseResponse.POST_TITLE_EMPTY));
    if (!mainText) return res.send(errResponse(baseResponse.POST_MAIN_TEXT_EMPTY));
    if (mainText.length > 65535) return res.send(errResponse(baseResponse.POST_MAIN_TEXT_TOO_LONG));

    const createPostResponse = await boardService.createPost(postName, userId, Title, mainText, postType);

    return res.send(createPostResponse);
};

// 게시판 글 전체보기 확인.
exports.getPosts = async function (req, res) {
    const { postType } = req.params;
    const getPostsResponse = await boardProvider.retrievePosts(postType);

    // 게시글 제목, 내용(한 줄), 작성 시간, 작성자 이름 가져오기
    const posts = getPostsResponse.map((post) => ({
        PostIdx: post.PostIdx,
        Title: post.Title,
        mainText: post.mainText,
        createAt: post.createAt,
        userId: post.userId
    }));

    return res.send(response(baseResponse.SUCCESS, posts));
};

  
// 특정 게시글 상세보기
exports.getPost = async function (req, res) {
    const { PostIdx } = req.params;
  
    // 게시글 조회
    const post = await boardProvider.retrievePost(PostIdx);
    console.log("control post: ", post);
    // 게시글 작성자, 제목, 내용, 작성 시간, 댓글 가져오기
    const postDetails = {
        userId: post[0].userId,
        Title: post[0].Title,
        mainText: post[0].mainText,
        createAt: post[0].createAt,
        comments: post.comments
    };
    console.log("postDetails: ",postDetails);
  
    return res.send(response(baseResponse.SUCCESS, postDetails));
};

// 게시글 수정
exports.updatePost = async function (req, res) {
    const {PostIdx} = req.params;
    const {Title, mainText} = req.body;
    const userIdFromJWT = req.decoded.userId; // JWT에서 userId 가져오기
    // const userIdFromJWT = "csb";

    if (!Title) return res.send(errResponse(baseResponse.POST_TITLE_EMPTY)); // 제목이 없는 경우
    if (!mainText) return res.send(errResponse(baseResponse.POST_MAIN_TEXT_EMPTY)); // 내용이 없는 경우

    // 게시글 내용이 너무 긴 경우
    if (mainText.length > 65535) return res.send(errResponse(baseResponse.POST_MAIN_TEXT_TOO_LONG));

    const post = await boardProvider.retrievePost(PostIdx); // 게시글 조회

    // 게시글이 존재하지 않는 경우
    if (!post) return res.send(errResponse(baseResponse.POST_NOT_FOUND));

    // JWT의 userId와 게시글의 작성자가 일치하지 않는 경우
    if (post[0].userId !== userIdFromJWT) return res.send(errResponse(baseResponse.POST_NOT_WRITER));

    const updatePostResponse = await boardService.updatePost(PostIdx, Title, mainText);

    return res.send(updatePostResponse);
};

// 게시글 삭제
exports.deletePost = async function (req, res) {
    const {PostIdx} = req.params;
    const userIdFromJWT = req.decoded.userId; // JWT에서 userId 가져오기
    // const userIdFromJWT = "csb";
 
    const post = await boardProvider.retrievePost(PostIdx); // 게시글 조회

    // 게시글이 존재하지 않는 경우
    if (!post) return res.send(errResponse(baseResponse.POST_NOT_FOUND));

    // JWT의 userId와 게시글의 작성자가 일치하지 않는 경우
    if (post[0].userId !== userIdFromJWT) return res.send(errResponse(baseResponse.POST_NOT_WRITER));

    const deletePostResponse = await boardService.deletePost(PostIdx);

    return res.send(deletePostResponse);
};

// 댓글 생성
exports.createComment = async function (req, res) {
    const { PostIdx } = req.params;
    const { contents } = req.body;
    const userIdFromJWT = req.decoded.userId;
  
    if (!contents) return res.send(errResponse(baseResponse.COMMENT_CONTENTS_EMPTY));
  
    const createCommentResponse = await boardService.createComment(PostIdx, userIdFromJWT, contents);
    console.log("최종완료", createCommentResponse);
    return res.send(createCommentResponse);
};
  
  // 댓글 삭제
exports.deleteComment = async function (req, res) {
    const { PostIdx, commentIdx } = req.params;
    const userIdFromJWT = req.decoded.userId;
  
    const deleteCommentResponse = await boardService.deleteComment(PostIdx, commentIdx, userIdFromJWT);
  
    return res.send(deleteCommentResponse);
};