"use client"
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, User, Users, Video, Bell, Briefcase}  from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import useSidebarStore from '@/store/sidebarStore';
import { useRouter } from "next/navigation";
import userStore from '@/store/userStore';

const LeftSideBar = () => {
    const {isSideBarOpen, toggleSideBar} = useSidebarStore();
    const router = useRouter()
    const {user } = userStore()
    const userPlaceholder = user?.name?.split(" ").map((name) => name[0]).join("")
    
    const handleNavigation = (path,item) =>{
        router.push(path)
    }
    return (
        <aside className={`fixed top-16 left-0 h-full w-64 p-4 transform transition-transform duration-1200 ease-in-out md:translate-x-0 flex flex-col z-50 md:z-0 ${isSideBarOpen? "translate-x-0 bg-white dark:bg-[rgb(36,37,38)] shadow-md":"-translate-x-full"}`}>
            <div className='flex flex-col h-full overflow-y-auto'>
                {/* navigation menu starts here */}
                <nav className='space-y-4 flex-grow'>
                    <div className='flex items-center space-x-2 cursor-pointer'>
                        <Avatar className='h-10 w-10'>
                            { user?.profilePicture? (
                                <AvatarImage src={user?.profilePicture} alt={user?.name}/>
                            ):(
                                <AvatarFallback className='dark:bg-gray-400 dark:text-foreground'>{userPlaceholder}</AvatarFallback>
                            )} 
                        </Avatar>
                        <span className='font-semibold'>{user?.name}</span>
                    </div>
                    
                    <Button
                    variant = "ghost"
                    className="w-full justify-start"
                    onClick = {() => handleNavigation('/')}
                    >
                        <Home className='mr-4'/> Home
                    </Button>
                    <Button
                    variant = "ghost"
                    className="w-full justify-start"
                    onClick = {() => handleNavigation('/friends-list')}
                    >
                        <Users className='mr-4'/> Friends
                    </Button>
                    <Button
                    variant = "ghost"
                    className="w-full justify-start"
                    onClick = {() => handleNavigation('/video-feed')}
                    >
                        <Video className='mr-4'/> Video
                    </Button>
                    <Button
                    variant = "ghost"
                    className="w-full justify-start"
                    onClick = {() => handleNavigation(`/user-profile/${user?._id}`)}
                    >
                        <User className='mr-4'/> Profile
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleNavigation("/job-post")}
                    >
                        <Briefcase className="mr-4" /> Job Posts
                    </Button>
                </nav>
                
                {/* footer section  */}
                <div className='mb-16 bottom-0'>
                    <Separator className='my-4'/>
                    <div className='flex items-center space-x-2 mb-4 cursor-pointer'>
                        <Avatar className='h-10 w-10'>
                           { user?.profilePicture? (
                                <AvatarImage src={user?.profilePicture} alt={user?.name}/>
                            ):(
                                <AvatarFallback className="dark:bg-gray-400 style={{ color: 'white' }}">{userPlaceholder}</AvatarFallback>
                            )} 
                        </Avatar>
                        <span className='font-semibold'>{user?.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>Privacy · Terms · Advertising</p>
                        <p>· TaRaWaPri © 2025</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default LeftSideBar