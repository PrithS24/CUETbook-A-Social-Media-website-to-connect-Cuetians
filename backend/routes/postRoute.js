const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const { multerMiddleware } = require('../config/cloudinary')
const { createPost, getAllPosts,getAllJobPosts, getPostByUserId, likePost, sharePost, addCommentToPost, getAllStory, createStory } = require('../controllers/postController')
const router = express.Router()
//create post
router.post('/posts', authMiddleware, multerMiddleware.single('media'), createPost)
//get all posts
router.get('/posts',authMiddleware, getAllPosts)
//get all job posts
// router.get('/posts',authMiddleware, getAllJobPosts)
//get posts by userId
router.get('/posts/user/:userId',authMiddleware, getPostByUserId)
//user like post route
router.post('/posts/likes/:postId', authMiddleware, likePost)
//user share post route
router.post('/posts/share/:postId',authMiddleware,sharePost)


//user comments post route
router.post('/posts/comments/:postId',authMiddleware,addCommentToPost)

//create story
router.post('/story',authMiddleware,multerMiddleware.single('media'),createStory)

//get all story
router.get('/story',authMiddleware,getAllStory)

module.exports = router