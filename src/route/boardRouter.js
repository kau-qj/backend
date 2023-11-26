const express = require('express');
const router = express.Router();

const jwtMiddleware = require('../middleware/jwtMiddleware');
const boardController = require('../controller/boardController');

router.post('/posts', jwtMiddleware, boardController.createPost);
router.get('/posts', jwtMiddleware, boardController.getPosts);
router.patch('/posts/:postIdx', jwtMiddleware, boardController.updatePost);
router.delete('/posts/:postIdx', jwtMiddleware, boardController.deletePost);
router.post('/posts/:postIdx/comments', jwtMiddleware, boardController.createComment);
router.delete('/posts/:postIdx/comments/:commentIdx', jwtMiddleware, boardController.deleteComment);

module.exports = router;
