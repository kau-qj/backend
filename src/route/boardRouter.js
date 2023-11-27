const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const boardController = require('../controller/boardController');

// 게시글 작성
router.post('/posts', jwtMiddleware, boardController.createPost);

// 게시글 조회
router.get('/posts', jwtMiddleware, boardController.getPosts);

// 게시글 상세조회
// router.get('/posts/:postIdx', jwtMiddleware, boardController.getPosts);

// 게시글 수정
router.patch('/posts/:postIdx', jwtMiddleware, boardController.updatePost);

// 게시글 삭제
router.delete('/posts/:postIdx', jwtMiddleware, boardController.deletePost);

// 댓글 작성
router.post('/posts/:postIdx/comments', jwtMiddleware, boardController.createComment);

// 댓글 삭제
router.delete('/posts/:postIdx/comments/:commentIdx', jwtMiddleware, boardController.deleteComment);

module.exports = router;
