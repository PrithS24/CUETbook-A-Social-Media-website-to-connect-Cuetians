import axiosInstance from "./url.service";

export const getAllFriendsRequest = async() =>{
    try {
         const response = await axiosInstance.get('/users/friend-request')
         return response?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}

export const getAllFriendsSuggestion = async() =>{
    try {
         const response = await axiosInstance.get('/users/user-to-request')
         return response?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}
// ✅ New function to fetch accepted friends
export const getAcceptedFriends = async () => {
    try {
        const response = await axiosInstance.get('/users/accepted-friends');
        console.log("✅ Raw API Response:", response);  // ✅ Debugging
        console.log("✅ Response Data:", response.data);  // ✅ Debugging

        if (!response.data) {
            console.error("🚨 Error: No data in API response!", response);
            return [];
        }

        return response.data;  // ✅ Ensure response data is returned correctly
    } catch (error) {
        console.error("❌ Error fetching accepted friends:", error.response?.data || error);
        return [];
    }
};


export const followUser = async(userId) =>{
    try {
         const response = await axiosInstance.post('/users/follow', {userIdToFollow:userId})
         return response?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}


export const UnfollowUser = async(userId) =>{
    try {
         const response = await axiosInstance.post('/users/unfollow', {userIdToUnFollow:userId})
         return response?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}


export const deleteUserFromRequest = async(userId) =>{
    try {
         const response = await axiosInstance.post('/users/friend-request/remove', {requestSenderId:userId})
         return response?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}


export const fetchUserProfile = async(userId) =>{
    try {
         const response = await axiosInstance.get(`/users/profile/${userId}`)
         return response?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}



export const getMutualFriends = async() =>{
    try {
         const response = await axiosInstance.get('/users/mutual-friends')
         return response?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}



export const updateUserProfile = async(userId,updateData) =>{
    try {
         const response = await axiosInstance.put(`/users/profile/${userId}`,updateData)
         return response?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}


export const updateUserCoverPhoto = async(userId,updateData) =>{
    try {
         const response = await axiosInstance.put(`/users/profile/cover-picture/${userId}`,updateData)
         return response?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}


export const createOrUpdateUserBio = async(userId,bioData) =>{
    try {
         const response = await axiosInstance.put(`/users/bio/${userId}`,bioData)
         return response?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;   
    }
}

// export const getAllUsers = async() =>{
//     try {
//          const response = await axiosInstance.get('/users')
//          return response?.data?.data;
//     } catch (error) {
//         console.log(error);
//         throw error;   
//     }
// }

export const getAllUsers = async (searchQuery = "") => {
    try {
        console.log(`Fetching users with search query: "${searchQuery}"`); // ✅ Debugging
        const response = await axiosInstance.get('/users', { 
            params: { search: searchQuery.trim() } 
        });

        console.log("✅ API Response:", response.data);

        // ✅ Ensure response is valid and return an array
        return response?.data?.users ?? [];
    } catch (error) {
        console.error("Error fetching users:", error);
        return []; // ✅ Prevent undefined error
    }
};


// const response = await axiosInstance.get(`/users/profile/${userId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             return response?.data?.data;
//         } catch (error) {
//             console.log(error);
//     <<<<<<< HEAD:frontend/src/app/service/user.service.js
//             throw error;
//         }
//     =======
//             throw error;
//         }
//     >>>>>>> b893d5bced9d061167a91f5a457d8a5c25fd947b:frontend/src/service/user.service.js
//     }