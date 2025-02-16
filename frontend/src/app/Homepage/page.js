// "use client";
// import React, { useState } from "react"
// import LeftSideBar from '../components/LeftSideBar'
// import RightSideBar from '../components/RightSideBar'
// import StorySection from '@/app/story/StorySection'
// import NewPostForm from "../posts/NewPostForm"
// import Header from "../components/Header"
// import PostCard from "../posts/PostCard"

// const HomePage = () => {
//     const [isPostFormOpen, setIsPostFormOpen] = useState(false)

//     const posts = [{
//         _id: 1,
//         content: "Petals of perfection 🌸",
//         mediaUrl: "https://images.pexels.com/photos/25820097/pexels-photo-25820097/free-photo-of-colorful-flowers-at-florists.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         mediaType: "image",
//         user: {
//             username: "Rashme Akther",
//             profilePicture: "https://example.com/profile1.jpg"
//         },
//         createdAt: "2024-05-05T10:00:00Z",
//         comments: [
//             {
//             text: "Nice Picture",
//             userName: "Pritha Saha",
//             }
            
//         ],
//         likes: 5,
//         shares:7,
//     },
//     {  
//         _id: 2,
//         content: "🌅🌇🌙",
//         mediaUrl: "https://cdn.pixabay.com/video/2022/03/18/111204-689949818_tiny.mp4",
//         mediaType: "video",
//         user: {
//             username: "Pritha Saha",
//             profilePicture: "https://example.com/profile5.jpg"
//         },
//         createdAt: "2025-01-01T08:45:00Z",
//         comments: [
//           {
//             text: "OMG",
//             userName: "Rashme Akther",
//           },
//           {
//             text: "Nice video",
//             userName: "Muntaha Alam",
//           }
//         ],
//         likes: 8,
//         shares:5
//     },
//     {
//         _id: 3,
//         content: "The stars are out to play tonight 🌠",
//         mediaUrl: "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=600",
//         mediaType: "image",
//         user: {
//           username: "Walisa Alam",
//           profilePicture: "https://example.com/profile2.jpg"
//         },
//         createdAt: "2024-12-11T18:00:00Z",
//         comments: [
//           {
//             text: "WOW",
//             userName: "Habiba Akther",
//           },
//           {
//             text: "Nice Picture",
//             userName: "Pritha Saha",
//           }
//         ],
//         likes: 7,
//         shares:2,
//       },
//       {
//         _id: 4,
//         content: "Happiness is homemade 🎂",
//         mediaUrl: "https://images.pexels.com/photos/1639564/pexels-photo-1639564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//         mediaType: "image",
//         user: {
//           username: "Nusrat Tazin",
//           profilePicture: "https://example.com/profile3.jpg"
//         },
//         createdAt: "2024-11-26T14:30:00Z",
//         comments: [
//           {
//             text: "Nice & Attractive",
//             userName: "RAISA Afa",
//           },
//           {
//             text: "Nice Picture",
//             userName: "Pritha Saha",
//           },
//           {
//             text: "Nice Picture",
//             userName: "Pritha Saha",
//           }
//         ],
//         likes: 3,
//         shares:2,
//       },
//       {
//         _id: 5,
//         content: "Amazing travel moments ✈️",
//         mediaUrl: "https://media.istockphoto.com/id/1753779792/video/aerial-drone-shot-of-morning-mist-over-tranquil-farmland-with-single-big-tree-under-orange.mp4?s=mp4-640x640-is&k=20&c=Vnku2vtoVM61shIsqaYyXX2s-slAC39mWZ4Vzz4dOaM=",
//         mediaType: "video",
//         user: {
//           username: "Nazifa",
//           profilePicture: "https://example.com/profile4.jpg"
//         },
//         createdAt: "2024-09-20T09:15:00Z",
//         comments: [
//           {
//             text: "Nice video",
//             userName: "Muntaha Alam",
//           }
//         ],
//         likes: 1,
//         shares:9,
//       },
//     ];
//     console.log(posts)
//     return (
//         <div className='flex flex-col min-h-screen bg-background text-foreground'>
//             <main className='flex flex-1 pt-16'>
//                 <LeftSideBar/>
//                 <div className="flex-1 px-4 py-6 md:ml-64 lg:max-w-2xl xl:max-w-3xl mx-auto">
//                     <div className=" lg:ml-2 xl:ml-28">
//                         <StorySection/>
//                         <NewPostForm
//                             isPostFormOpen = {isPostFormOpen}
//                             setIsPostFormOpen = {setIsPostFormOpen}
//                         />
//                         <div className="mt-6 space-y-6">
//                             {posts.map( post => (
//                                 <PostCard
//                                     key = {post._id}
//                                     post = {post}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//                 <div className='hidden lg:block lg:w-64 xl:w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-4'>
//                     <RightSideBar/>
//                 </div>
//             </main>
//         </div>
    
//     )
// }

// export default HomePage

"use client"
import React, { useEffect, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import RightSideBar from "../components/RightSideBar";
import StorySection from "@/app/story/StorySection";
import NewPostForm from "../posts/NewPostForm";
import PostCard from "../posts/PostCard";
import { usePostStore } from "../../store/usePostStore";
import toast from "react-hot-toast";

const HomePage = () => {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [likePosts,setLikePosts] = useState(new Set());
  const {posts,fetchPost,handleLikePost,handleCommentPost,handleSharePost} = usePostStore();

  useEffect(() =>{
    fetchPost()
  },[fetchPost])

  useEffect(() =>{
    const saveLikes = localStorage.getItem('likePosts');
    if(saveLikes){
      setLikePosts(new Set(JSON.parse(saveLikes)));
    }
  },[]);


  const handleLike = async(postId)=>{
    const updatedLikePost = new Set(likePosts);
    if(updatedLikePost.has(postId)){
      updatedLikePost.delete(postId);
      toast.error('post disliked successfully')
    }else {
      updatedLikePost.add(postId)
      toast.success('post like successfully')
    }
    setLikePosts(updatedLikePost);
    localStorage.setItem('likePosts',JSON.stringify(Array.from(updatedLikePost)))

    try {
      await handleLikePost(postId);
      await fetchPost();
    } catch (error) {
       console.error(error);
       toast.error('failed to like or unlike the post')
    }
  }


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex flex-1 pt-16">
        <LeftSideBar />
        <div className="flex-1 px-4 py-6 md:ml-64 lg:mr-64 lg:max-w-3xl xl:max-w-4xl mx-auto ">
          <div className="lg:ml-2 xl:ml-28 ">
            <StorySection />
            <NewPostForm
            
              isPostFormOpen={isPostFormOpen}
              setIsPostFormOpen={setIsPostFormOpen}
            />
            <div className="mt-6 space-y-6 mb-4">
              {posts.map((post) => (
                <PostCard key={post._id} 
                  post={post}
                  isLiked = {likePosts.has(post?._id)}
                  onLike={() => handleLike(post?._id)}
                  onComment={async(comment) => {
                    await handleCommentPost(post?._id,comment.text);
                    await fetchPost();
                  }}
                  onShare = {async() =>{
                  await handleSharePost(post?._id)
                  await fetchPost();
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-64 xl:w-80 fixed right-0 top-16 bottom-0 overflow-y-auto p-4">
          <RightSideBar />
        </div>
      </main>
    </div>
  );
};

export default HomePage;