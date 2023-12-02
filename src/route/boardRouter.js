const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');
const boardController = require('../controller/boardController');

// 특정 게시판 게시글 보기
router.get('/postType/:postType', jwtMiddleware, boardController.getPosts);

// 특정 게시글 상세보기
router.get('/posts/:PostIdx', jwtMiddleware, boardController.getPost);

// 게시글 생성
router.post('/posts', jwtMiddleware, boardController.createPost);

// 게시글 수정
router.patch('/posts/:PostIdx', jwtMiddleware, boardController.updatePost);

// 게시글 삭제
router.delete('/posts/:PostIdx', jwtMiddleware, boardController.deletePost);

// 댓글 생성
router.post('/posts/:PostIdx/comments', jwtMiddleware, boardController.createComment);

// 댓글 삭제
router.delete('/posts/:PostIdx/comments/:commentIdx', jwtMiddleware, boardController.deleteComment);

module.exports = router;
