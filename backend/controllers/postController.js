const { uploadFileToCloudinary } = require("../config/cloudinary");
const Post = require("../model/Post"); 
const Story = require("../model/story");
const response = require('../utils/responseHandler')

const createPost = async(req,res) => {
    try {
        const userId = req.user.userId;

        const { content } = req.body;
        const file = req.file;
        let mediaUrl = null;
        let mediaType = null;
        if ( file ){
            const uploadResult = await uploadFileToCloudinary(file)
            mediaUrl = uploadResult?.secure_url;
            mediaType = file.mimetype.startsWith('video') ? 'video' : 'image'
        }

        // create a new post 
        const newPost = await new Post({
            user: userId,
            content,
            mediaUrl,
            mediaType,
            likeCount: 0,
            commentCount: 0,
            shareCount: 0,
        })

        await newPost.save();
        return response( res, 201, 'Post created Successfully', newPost)
    } catch (error) {
        console.log('error creating post')
        return response( res, 500, 'Internal Server Error', error.message)
    }
}
//create story 

const createStory = async(req,res) =>{
    try {
        const userId = req.user.userId;
        const file= req.file;
        
        if(!file) {
            return response(res,400, 'file is required to create a story')
        }
        let mediaUrl = null;
        let mediaType = null;

        if(file) {
          const uploadResult = await uploadFileToCloudinary(file)
          mediaUrl= uploadResult?.secure_url;
          mediaType= file.mimetype.startsWith('video') ? 'video' : 'image';
        }
       
        //create a new story
        const newStory = await new Story({
            user:userId,
            mediaUrl,
            mediaType
        })

        await newStory.save();
        return response(res,201,'Story created successfully', newStory)

    } catch (error) {
         console.log('error creating story',error)
         return response(res,500, 'Internal server error',error.message)
    }
}


//getAllStory
const getAllStory = async(req, res) => {
    try {
        const story = await Story.find()
        .sort({createdAt: -1})
        .populate('user','_id name profilePicture email')

        return response(res, 201, 'Get all story successfully', story)
    } catch (error) {
        console.log('error getting story',error)
        return response(res,500,'Internal server error',error.message)
    }
}


//get all posts

const getAllPosts = async(req,res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1})
        .populate('user','_id name profilePicture email')
        .populate({
            path: 'comments.user',
            select: 'name, profilePicture'
        })
        return response(res, 201, 'Get all posts successfully', posts)
    } catch (error) {
        console.log('error getting posts',error)
        return response(res,500,'Internal server error',error.message)
    }
}
//get post by userId
const getPostByUserId = async(req,res) => {
    const { userId } = req.params;  // ✅ Correctly extract userId

    try {
        if (!userId) {
            return response(res, 400, 'UserId is required to get user post(s)');
        }

        console.log("🔍 Fetching posts for user ID:", userId);  // ✅ Debugging

        const posts = await Post.find({ user: userId })  // ❌ `findById` is incorrect, use `find`
            .sort({ createdAt: -1 })
            .populate('user', '_id name profilePicture email')
            .populate({
                path: 'comments.user',
                select: 'name profilePicture'
            });

        if (!posts.length) {
            return response(res, 404, 'No posts found for this user');
        }

        return response(res, 200, 'Get all posts by userId successfully', posts);
    } catch (error) {
        console.error("❌ Error getting user posts:", error);
        return response(res, 500, 'Internal server error', error.message);
    }
};

//like post api
const likePost = async(req,res) => {
    const { postId } = req.params;
    const userId = req.user.userId;
    try {
        const post = await Post.findById(postId)
        if( !post ){
            return response(res, 404, 'Post not Found')
        }
        const hasLiked = post.likes.includes(userId)
        if( !hasLiked){
            post.likes.push(userId),
            post.likeCount = post.likeCount + 1
        }else{
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString()),
            post.likeCount = post.likeCount - 1
        }
        // save the link in updated post
        const updatedPost = await post.save()
        return response( res, 201, hasLiked ? "Post Unliked Successfully" : "Post Liked Successfully",updatedPost)
    } catch (error) {
        console.log('error getting posts',error)
        return response(res,500,'Internal server error',error.message)
    }
}
//post comments by user

const addCommentToPost = async(req,res) =>{
    const {postId} = req.params;
    const userId= req.user.userId;
    const {text} = req.body;
    try {
         const post = await Post.findById(postId)
         if(!post) {
            return response(res,404,'post not found')
         }


         post.comments.push({user:userId,text})
         post.commentCount+=1;
          
         //save the post with new comments
         await post.save()
         return response(res, 201, "comments added successfully", post )
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }
}



//share on post by user
const sharePost = async(req, res) => {
    const {postId} = req.params;
    const userId= req.user.userId;
    try {
         const post = await Post.findById(postId)
         if(!post) {
            return response(res,404,'post not found')
         }
         const hasUserShared = post.share.includes(userId)
         if(!hasUserShared){
             post.share.push(userId)
         }

         post.shareCount +=1;

         //save the share in updated post
          await post.save()
         return response(res, 201, 'post share successfully', post )
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }
}
module.exports= {
    createPost,
    getAllPosts,
    getPostByUserId,
    likePost,
    addCommentToPost,
    sharePost,
    createStory,
    getAllStory
}