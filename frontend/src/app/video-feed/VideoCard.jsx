'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MessageCircle, Send, Share2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { ScrollArea } from '@radix-ui/react-scroll-area';
import VideoComments from './VideoComments';
import { Input } from "@/components/ui/input";
import { useRef } from 'react';
import userStore from '@/store/userStore';

const VideoCard = ({ post, isLiked, onShare, onComment, onLike}) => {
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const { user } = userStore()
    const [commentText, setCommentText] = useState("");
    const commentInputRef = useRef(null)

    const handleCommentClick = () =>{
        setShowComments(true);
        setTimeout(() =>{
          commentInputRef?.current?.focus();
        },0)
      }
    
    
      const userPostPlaceholder = user?.name
      ?.split(" ")
      .map((name) => name[0])
      .join("");
    
      const handleCommentSubmit = async () => {
        if (commentText.trim()) {
          onComment({ text: commentText });
          setCommentText("");
        }
      };
    
    
    
      const generateSharedLink = () => {
        return `http://localhost:3000/${post?.id}`;
      };
    const handleShare = (platform) => {
        const url = generateSharedLink();
        let shareUrl;

        switch (platform) {
            case "facebook":
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case "twitter":
                shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
                break;
            case "linkedin":
                shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
                break;
            case "copy":
                navigator.clipboard.writeText(url);
                setIsShareDialogOpen(false);
                return;
            default:
                return;
        }

        window.open(shareUrl, "_blank");
        setIsShareDialogOpen(false);
    };
    return (
        <div>
            <motion.div
                key={post?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='bg-white dark:bg-[rgb(36,37,38)] rounded-lg shadow-lg overflow-hidden'
            >
                <div>
                    <div className='flex items-center justify-between mb-4 px-4 mt-2'>
                        <div className='flex items-center'>
                            <Avatar className='h-10 w-10 rounded mr-3'>
                                {post?.user?.profilePicture ? (
                                    <AvatarImage src={post?.user?.profilePicture}
                                        alt={post?.user?.name} />
                                ) : (
                                    <AvatarFallback className="dark:bg-gray-400">{userPostPlaceholder}</AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <p className='font-semibold dark:text-white'> {post?.user?.name}</p>
                            </div>
                        </div>
                        <div className='flex items-center text-gray-500 dark:text-gray-400'>
                            <Clock className='h-4 w-4 mr-1' />
                            <span className='text-sm'>{post?.createdAt}</span>
                        </div>
                    </div>
                    <div className='relative aspect-video bg-black mb-4'>
                        {post?.mediaUrl && (
                            <video controls className="w-full h-[500px] rounded-lg mb-4">
                                <source src={post?.mediaUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        )}
                    </div>
                </div>
                <div className="md:flex justify-between px-2 mb-2 items-center">
                    <div className="flex justify-start space-x-4">
                        <Button
                            variant="ghost"
                            className={`flex items-center dark:hover:bg-gray-600 ${isLiked ? "text-blue-600" : ""}`}
                            onClick={onLike}
                        >
                            <ThumbsUp className="mr-2 h-4 w-4" />
                            <span>Like</span>
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex items-center dark:hover:bg-gray-600"
                            onClick={handleCommentClick}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            <span>Comment</span>
                        </Button>
                        <Dialog
                            open={isShareDialogOpen}
                            onOpenChange={setIsShareDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center dark:hover:bg-gray-600"
                                    onClick={onShare}
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    <span>Share</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Share This Post</DialogTitle>
                                    <DialogDescription>
                                        Choose how you want to share this post
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col space-y-4 ">
                                    <Button onClick={() => handleShare("facebook")}>
                                        Share on Facebook
                                    </Button>
                                    <Button onClick={() => handleShare("twitter")}>
                                        Share on Twitter
                                    </Button>
                                    <Button onClick={() => handleShare("linkedin")}>
                                        Share on Linkedin
                                    </Button>
                                    <Button onClick={() => handleShare("copy")}>Copy Link</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className='flex space-x-4 ml-5 text-sm text-gray-500 dark:text-gray-400'>
                        <Button variant="ghost" size="sm" >{post?.likeCount} likes</Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>{post?.CommentCount} Comments</Button>
                        <Button variant="ghost" size="sm">{post?.shareCount} Shares</Button>

                    </div>
                </div>
                <Separator className="mb-2 dark:bg-gray-400" />
                <AnimatePresence>
                    {showComments && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ScrollArea className='h-[300px] w-full rounded-md border p-4'>

                                <VideoComments key={post?.comments?._id}
                                    comments={post?.comments}

                                />
                            </ScrollArea>
                            <div className='flex items-center mt-4'>
                                <Avatar className='h-10 w-10 rounded mr-3 ml-3 mb-3'>
                                    {user?.profilePicture? (
                                        <AvatarImage 
                                        src={user?.profilePicture}
                                        alt={user?.name}/>
                                    ):(
                                        <AvatarFallback className="dark:bg-gray-400 p-2">{ userPostPlaceholder}</AvatarFallback>
                                    )}
                                    
                                    
                                </Avatar>
                                <Input className='flex-1 mr-2 mb-2 dark:border-gray-400' 
                                placeholder="Write a comment..."
                                value={commentText}
                                ref={commentInputRef}
                                onChange={(e)=>setCommentText(e.target.value)}
                                onKeyDown={(e)=>e.key==='Enter' && handleCommentSubmit()}/>
                                <Button className='m-3' onClick={handleCommentSubmit}>
                                    <Send className='h-4 w-4' />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
export default VideoCard