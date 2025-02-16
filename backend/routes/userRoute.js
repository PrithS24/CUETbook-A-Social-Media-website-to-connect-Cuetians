const express = require('express')
const authMiddleware = require('../middleware/authMiddleware');
const { createOrUpdateUserBio, updateCoverPhoto, updateUserProfile } = require('../controllers/createOrUpdateController');
const { checkUserAuth } = require('../controllers/userController')
const { multerMiddleware } = require('../config/cloudinary');
const userController = require('../controllers/userController'); 
const router = express.Router()

console.log("User router loaded");

//user follow 
router.post('/follow',authMiddleware,userController.followuser)

//user unfollow
router.post('/unfollow',authMiddleware,userController.unfollowuser)

//remove user from request
router.post('/remove/friend-request',authMiddleware,userController.deleteUserFromRequest);

//get all friends request
router.get('/friend-request',authMiddleware,userController.getAllFriendsRequest )


//get all friends for request
router.get('/user-to-request',authMiddleware,userController.getAllUserForFriendsRequest )


//get all mutual friends 
router.get('/mutual-friends/:userId',authMiddleware,userController.getAllMutualFriends)

// ✅ Get all accepted friends (new route)
router.get('/accepted-friends', authMiddleware, userController.getAcceptedFriends);
//get all users from search
router.get('/',authMiddleware,userController.getAllUser)
//get all users fror search 
router.get('/check-auth',authMiddleware, checkUserAuth)

// create or update user Bio
router.put('/bio/:userId', authMiddleware, createOrUpdateUserBio)
router.get('/profile/:userId',authMiddleware,userController.getUserProfile)
// update user profile
router.put('/profile/:userId', authMiddleware, multerMiddleware.single('profilePicture'), updateUserProfile)

// update user cover
router.put('/profile/cover-picture/:userId', authMiddleware, multerMiddleware.single('coverPicture'), updateCoverPhoto)

module.exports = router