const User = require("../model/User");
const response = require("../utils/responseHandler");

//check if user is authenticated or not 
// const checkUserAuth = async(req, res) =>{
//     try {
//        const userId = req?.user?.userId;
//        if(!userId) return response(res,404, 'unauthenticated ! please login before access the data')

//        //fetch the user details and excude sensitive information
//        const user = await User.findById(userId).select('-password');

//        if(!user) return response(res,403, 'User not found')

//        return response(res,201, 'user retrived and allow to use facebook', user)
//     } catch (error) {
//        return response(res, 500, 'Internal server error', error.message)
//     }
// }


// API for following a user
const followuser = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const userId = req?.user?.userId;

        // Prevent user from following itself
        if (userId === userIdToFollow) {
            return response(res, 400, "You are not allowed to follow yourself");
        }

        const userToFollow = await User.findById(userIdToFollow);
        const currentUser = await User.findById(userId);

        // Check if both users exist
        if (!userToFollow || !currentUser) {
            return response(res, 404, "User not found");
        }

        // Check if already following
        if (currentUser.following.includes(userIdToFollow)) {
            return response(res, 400, "You are already following this account");
        }

        // Add to following list
        currentUser.following.push(userIdToFollow);
        // Add current user as the follower
        userToFollow.followers.push(userId);

        // Update counts
        currentUser.followingCount += 1;
        userToFollow.followerCount += 1;

        await currentUser.save();
        await userToFollow.save();

        return response(res, 200, "User followed successfully");
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
};

// API for unfollowing a user
const unfollowuser = async (req, res) => {
    try {
        const { userIdToUnfollow } = req.body;
        const userId = req?.user?.userId;

        // Prevent user from unfollowing itself
        if (userId === userIdToUnfollow) {
            return response(res, 400, "You are not allowed to unfollow yourself");
        }

        const userToUnfollow = await User.findById(userIdToUnfollow);
        const currentUser = await User.findById(userId);

        // Check if both users exist
        if (!userToUnfollow || !currentUser) {
            return response(res, 404, "User not found");
        }

        // Check if the user is actually following
        if (!currentUser.following.includes(userIdToUnfollow)) {
            return response(res, 400, "You are not following this account");
        }

        // Remove from following list
        currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToUnfollow.toString());
        // Remove from followers list
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId.toString());

        // Update counts
        currentUser.followingCount -= 1;
        userToUnfollow.followerCount -= 1;

        await currentUser.save();
        await userToUnfollow.save();

        return response(res, 200, "User unfollowed successfully");
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
};

//to delete friend request
const deleteUserFromRequest = async(req,res)=>{
    try {
        const loggedInUserId = req.user.userId;
        const {requestSenderId} = req.body;

        const requestSender = await User.findById(requestSenderId);
        const loggedInUser = await User.findById(loggedInUserId);

        if (!requestSender || !loggedInUser) {
            return response(res, 404, "User not found");
        }
        //check if the request sender is following loggedin user or not
        const isRequestSend = requestSender.following.includes(loggedInUserId)
        if(!isRequestSend){
            return response(res,404, 'No request found for this user')
        }

        //remove the loggedin userId from request sender following list
        requestSender.following = requestSender.following.filter(user=>user.toString !== loggedInUserId )
        //remove the sender userId from loggedIn user followers list
        loggedInUser.followers = loggedInUser.followers.filter(user=>user.toString !== requestSenderId )

        //update follower and following counts
        loggedInUser.followerCount=loggedInUser.followers.length;
        requestSender.followingCount=requestSender.following.length;

        //save both users
        await loggedInUser.save();
        await requestSender.save();

        return response(res,200,`Friend request from ${requestSender.username} deleted successfully`)
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
}

//get all friend request
const getAllFriendsRequest = async(req,res)=>{
    try {
        const loggedInUserId = req.user.userId;

        //find the logged in user and retrieve their followers and following
        const loggedInUser = await User.findById(loggedInUserId).select('followers following')
        if(!loggedInUser){
           return response(res,404, 'User not found') 
        }
        //find user who follow the logged in user but are not followed back
        const userToFollowBack = await User.find({
            _id:{
                $in: loggedInUser.followers, //user who follow the loggedin user
                $nin: loggedInUser.following //exclude the logged in user's following list

            }
        }).select('name profilePicture email followerCount followingCount department userType studentID')

        return response(res,200,'user to follow back done',userToFollowBack)
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
}

//get all friend request for user
const getAllUserForFriendsRequest = async(req,res)=>{
    try {
        const loggedInUserId = req.user.userId;

        //find the logged in user and retrieve their followers and following
        const loggedInUser = await User.findById(loggedInUserId).select('followers following')
        if(!loggedInUser){
           return response(res,404, 'User not found') 
        }
        //find user who neither following nor follower of the logged in user
        const userForFriendRequest = await User.find({
            _id:{
                $ne: loggedInUser, //user who follow the loggedin user
                $nin: [...loggedInUser.following, ...loggedInUser.followers] //exclude both

            }
        }).select('name profilePicture email followerCount followingCount department userType studentID')

        return response(res,200,'users to send friend request',userForFriendRequest)
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
}
const getAcceptedFriends = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;

        // ✅ Ensure logged-in user exists
        const loggedInUser = await User.findById(loggedInUserId).select("followers following");
        if (!loggedInUser) {
            return response(res, 404, "User not found");
        }

        // ✅ Fetch mutual friends (users who follow each other)
        const acceptedFriends = await User.find({
            _id: { $in: loggedInUser.following, $in: loggedInUser.followers }  // ✅ Ensure mutual follow check
        }).select("name profilePicture email");

        console.log("Accepted Friends Backend Response:", acceptedFriends);  // ✅ Debugging

        return response(res, 200, "Accepted friends retrieved successfully", acceptedFriends);
    } catch (error) {
        console.error("Error fetching accepted friends:", error);
        return response(res, 500, "Internal server error", error.message);
    }
};

//api for mutual friends
const getAllMutualFriends= async(req,res)=>{
    try {
        const loggedInUserId = req.user.userId;

        //find the logged in user and retrieve their followers and following
        const loggedInUser = await User.findById(loggedInUserId)
        .select('followers following')
        .populate('followers', 'name profilePicture email followerCount followingCount department userType studentID')
        .populate('following', 'name profilePicture email followerCount followingCount department userType studentID')
        if(!loggedInUser){
           return response(res,404, 'User not found') 
        }
        
        //create a set of user id that logged in user is following
        const followingUserId = new Set(loggedInUser.following.map(user => user._id.toString()))

        //filter followers to get only those who are also following u and followed by logged in user
        const mutualFriends = loggedInUser.followers.filter(follower=>
            followingUserId.has(follower._id.toString())
        )

        return response(res,200,'Mutual friends got successfully',mutualFriends)
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
}

const getAllUser = async (req, res) => {
    try {
        const { search } = req.query;
        console.log("DEBUG: Received Search Query ->", search); 

        let filter = {};

        if (search && search.trim() !== "") {  
            const searchTerms = search.toLowerCase().split(" ").filter(term => term.trim() !== ""); 
            let orConditions = [];
            let andConditions = [];

            searchTerms.forEach(term => {
                if (!isNaN(term)) {
                    orConditions.push({ studentID: term });
                    orConditions.push({ batch: term });
                } else {
                    orConditions.push({ name: { $regex: new RegExp(term, "i") } });
                    orConditions.push({ email: { $regex: new RegExp(term, "i") } });
                    orConditions.push({ department: { $regex: new RegExp(term, "i") } });
                    orConditions.push({ userType: { $regex: new RegExp(term, "i") } });

                    if (["cse", "eee", "mecha"].includes(term)) {
                        andConditions.push({ department: { $regex: new RegExp(term, "i") } });
                    }
                    if (["student", "alumni", "faculty"].includes(term)) {
                        andConditions.push({ userType: { $regex: new RegExp(term, "i") } });
                    }
                }
            });

            if (orConditions.length > 0) {
                filter.$or = orConditions;
            }
        }

        console.log("DEBUG: Applied Search Filter ->", JSON.stringify(filter, null, 2));

        const users = await User.find(filter).select('name email studentID department userType batch');

        // ✅ Always return a proper response
        return res.status(200).json({ message: "Got users successfully", users: users ?? [] });

    } catch (error) {
        console.error("ERROR:", error);
        return res.status(500).json({ message: "Internal server error", users: [] });
    }
};


// const getAllUser = async (req, res) => {
//     try {
//         const { search } = req.query;
//         console.log("DEBUG: Received Search Query ->", search); // ✅ Log search query

//         let filter = {};

//         if (search && search.trim() !== "") {  // ✅ Ensure search query is not empty
//             const searchTerms = search.toLowerCase().split(" ").filter(term => term.trim() !== ""); 
//             let orConditions = [];

//             searchTerms.forEach(term => {
//                 if (!isNaN(term)) {
//                     // ✅ Exact match for studentID and batch
//                     orConditions.push({ studentID: term });
//                     orConditions.push({ batch: term });
//                 } else {
//                     // ✅ Proper regex to prevent errors
//                     orConditions.push({ name: { $regex: new RegExp(term, "i") } });
//                     orConditions.push({ email: { $regex: new RegExp(term, "i") } });
//                     orConditions.push({ department: { $regex: new RegExp(term, "i") } });
//                     orConditions.push({ userType: { $regex: new RegExp(term, "i") } });
//                 }
//             });

//             if (orConditions.length > 0) {
//                 filter.$or = orConditions;
//             }
//         }

//         console.log("DEBUG: Applied Search Filter ->", JSON.stringify(filter, null, 2));

//         const users = await User.find(filter).select('name email studentID department userType batch');

//         return res.status(200).json({ message: "Got users successfully", users });
//     } catch (error) {
//         console.error("ERROR:", error);
//         return res.status(500).json({ message: "Internal server error", error: error.message });
//     }
// };

// module.exports = { getAllUser };


// const getAllUser = async (req, res) => {
//     try {
//         const { search } = req.query;
//         let filter = {}; // Initialize an empty filter

//         if (search) {
//             const searchTerms = search.toLowerCase().split(" ");  // Split the search query into individual terms

//             let orConditions = [];

//             searchTerms.forEach(term => {
                
//                 // Match in string fields (name, email, username, department, userType)
//                 orConditions.push({ 
//                     name: { $regex: new RegExp(term, "i") }  // Match name (e.g., "Pritha", "Saha")
//                 });

//                 orConditions.push({ 
//                     email: { $regex: new RegExp(term, "i") }  // Match email
//                 });

//                 orConditions.push({ 
//                     studentID: { $regex: new RegExp(term, "i") }  // Match studentID (e.g., "1504013")
//                 });

//                 orConditions.push({ 
//                     department: { $regex: new RegExp(term, "i") }  // Match department (e.g., "CSE")
//                 });

//                 orConditions.push({ 
//                     userType: { $regex: new RegExp(term, "i") }  // Match userType (e.g., "alumni")
//                 });

//                 // Apply exact match for batch if the term is a number (do not use regex for batch)
//                 if (!isNaN(term)) {
//                     orConditions.push({ 
//                         batch: term  // Exact match for batch
//                     });
//                 }
//             });

//             filter.$or = orConditions;  // Set $or condition with all the individual term matches
//         }

//         // Execute the query with dynamic filter
//         const users = await User.find(filter).select('name email studentID department userType batch');

//         return response(res, 200, "Got users successfully", users);
//     } catch (error) {
//         console.error(error);
//         return response(res, 500, "Internal server error", error.message);
//     }
// };


//check if user is authenticated or not 
const checkUserAuth = async(req, res) =>{
    try {
       const userId = req?.user?.userId;
       if(!userId) return response(res,404, 'unauthenticated ! please login before access the data')

       //fetch the user details and excude sensitive information
       const user = await User.findById(userId).select('-password');

       if(!user) return response(res,403, 'User not found')

       return response(res,201, 'user retrived and allow to use facebook', user)
    } catch (error) {
       return response(res, 500, 'Internal server error', error.message)
    }
}
const getUserProfile=async(req,res)=>{
    try {
        const {userId} = req.params;
        const loggedInUserId=req?.user?.userId

        //fetch user details, leave out sensitive data
        const userProfile= await User.findById(userId).select('-password');
        if(!userProfile) return response(res,403, 'User not found')
            
        const isOwner = loggedInUserId ===userId;
        return response(res,201,'User profile found successfully',{profile:userProfile, isOwner})
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    } 
}
module.exports = {
    followuser,
    unfollowuser,
    deleteUserFromRequest,
    getAllFriendsRequest,
    getAllUserForFriendsRequest,
    getAllMutualFriends,
    getAllUser,
    checkUserAuth,
    getUserProfile,
    getAcceptedFriends
};

