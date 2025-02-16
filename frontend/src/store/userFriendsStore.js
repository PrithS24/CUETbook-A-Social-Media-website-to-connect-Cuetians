import { deleteUserFromRequest, followUser, getAllFriendsRequest, getAllFriendsSuggestion, getMutualFriends,  getAcceptedFriends,UnfollowUser } from "../service/user.service";
import toast from "react-hot-toast";
import { create } from "zustand";





export const userFriendStore = create((set,get) => ({
    friendRequest:[],
    friendSuggestion:[],
    mutualFriends:[],
    friendsList:[],
    loading:false,

   fetchFriendRequest: async() =>{
    set({loading:true})
    try {
          const friend = await getAllFriendsRequest();
          set({friendRequest: friend.data, loading:false})
    } catch (error) { 
       set({error, loading:false})
    }finally{
      set({loading:false})
    }
   },

   fetchFriendSuggestion: async() =>{
    set({loading:true})
    try {
          const friend = await getAllFriendsSuggestion();
          set({friendSuggestion: friend.data, isLoading:false})
    } catch (error) { 
       set({error, loading:false})
    }finally{
      set({loading:false})
    }
   },
   fetchMutualFriends: async() =>{
    set({loading:true})
    try {
          const friend = await getMutualFriends();
          set({mutualFriends: friend, loading:false})
    } catch (error) { 
       set({error, loading:false})
    }finally{
      set({loading:false})
    }
   },
   followUser:async(userId) =>{
    set({loading:true})
    try {
        await followUser(userId)
    } catch (error) {
      set({error, loading:false})
    }
   },
   UnfollowUser: async(userId) =>{
    set({loading:true})
    try {
        await UnfollowUser(userId)
    } catch (error) {
      set({error, loading:false})
    }
   },
   fetchFriendsList: async () => {  
    set({ loading: true });
    try {
        const response = await getAcceptedFriends();  
        console.log("✅ Friends API Response in Frontend:", response);

        if (!Array.isArray(response.data)) {
            console.error("🚨 Error: Friends list is not an array!", response);
            return;
        }

        set(() => ({ friendsList: [...response.data], loading: false }));  // ✅ Forces a shallow copy update
        console.log("🟢 Updated friendsList in Zustand:", response.data);
    } catch (error) {
        console.error("❌ Error fetching friends list:", error);
        set({ friendsList: [], loading: false });
    }
 },
 
   deleteUserFromRequest: async(userId) =>{
    set({loading:true})
    try {
        await deleteUserFromRequest(userId)
        toast.success("you have deleted friend successfully")
    } catch (error) {
      set({error, loading:false})
    }
   }

}))