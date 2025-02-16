const Bio = require('../model/UserBio')
const User = require('../model/User');
const response = require('../utils/responseHandler');
const { uploadFileToCloudinary } = require('../config/cloudinary');

const createOrUpdateUserBio = async(req,res) =>{
    try {
        const {userId} = req.params;
        const { bioText, liveIn, relationship, workplace, education, phone, hometown}= req.body;

        let bio = await Bio.findOneAndUpdate({user: userId},{
            bioText,
            liveIn,
            relationship,
            workplace,
            education,
            phone,
            hometown
        },{new: true, runValidators: true}
    )
    // if bio does not exist to create new one
    if( !bio ){
        bio = new Bio({
            user: userId,
            bioText,
            liveIn,
            relationship,
            workplace,
            education,
            phone,
            hometown
        })
    }
    await bio.save();
    await User.findByIdAndUpdate(userId,{bio: bio._id})

    return response( res, 201, 'Bio create or update successfully', bio)
    } catch (error) {
        console.log('error getting posts',error)
        return response(res,500,'Internal server error',error.message)
    }
}

const updateCoverPhoto = async(req,res) => {
    try{
        const { userId } = req.params
        const file = req.file;

        let coverPicture = null;
        if( file){
            const uploadResult = await uploadFileToCloudinary(file)
            coverPicture = uploadResult.secure_url
        }

        if( !coverPicture){
            return response(res, 400, 'failed to upload cover photo')
        }
        // update user profile with cover photo
        await User.updateOne({_id: userId},{
            $set:{
                coverPicture
            }
        })
        const updateUser = await User.findById(userId)
        if( !updateUser ){
            return response(res, 404, 'User not found with this id')
        }
        return response(res, 200, 'Cover Picture Update sucessfully', updateUser)
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }
}
const updateUserProfile = async(req,res) => {
    try{
        const { userId } = req.params
        const { name, gender, dateOfBirth} = req.body
        const file = req.file;

        let profilePicture = null;
        if( file){
            const uploadResult = await uploadFileToCloudinary(file)
            profilePicture = uploadResult.secure_url
        }

        // update user profile with profile photo
        await User.updateOne({_id: userId},{
            $set:{
                name,
                gender,
                dateOfBirth,
                ...(profilePicture && {profilePicture})
            }
        })
        const updateUser = await User.findById(userId)
        if( !updateUser ){
            return response(res, 404, 'User not found with this id')
        }
        return response(res, 200, 'Profile Picture Update sucessfully', updateUser)
    } catch (error) {
        console.log(error)
        return response(res,500,'Internal server error',error.message)
    }

}

module.exports = {
    createOrUpdateUserBio, updateCoverPhoto, updateUserProfile
}