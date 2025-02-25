"use client"
import { Home, LogOut, MessageCircle, Moon, Video, Sun, Users, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import Image from 'next/image'
// import React, { useState } from 'react'
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import useSidebarStore from "@/store/sidebarStore";
import { getAllUsers } from "@/service/user.service";
import React, { useEffect, useRef, useState } from "react";
import { logout } from '@/service/auth.service';
import toast from 'react-hot-toast';
import userStore from '@/store/userStore';

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { theme, setTheme } = useTheme('dark');
    const { toggleSideBar } = useSidebarStore();
    console.log("Current theme:", theme);
    const router = useRouter()
    const { user, clearUser } = userStore()
    const [searchQuery, setSearchQuery] = useState("");
    const [userList, setUserList] = useState([])
    const [filterUsers, setFilterUsers] = useState([])
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    const searchRef = useRef(null)

    const userPlaceholder = user?.name?.split(" ").map((name) => name[0]).join("")

    const handleNavigation = (path, item) => {
        router.push(path);
        setActiveTab(item)
    }

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result?.status == 'success') {
                router.push('/user-login')
            }
            toast.success('user logged out successfully')
            clearUser()
        } catch (error) {
            console.log(error)
            toast.error('failed to log out')
        }
    }
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const result = await getAllUsers()
                setUserList(result);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, [])
    // useEffect(() => {
    //     const fetchFilteredUsers = async () => {
    //         if (!searchQuery.trim()) {
    //             setFilterUsers([]);
    //             setIsSearchOpen(false);
    //             return;
    //         }

    //         try {
    //             setLoading(true);
    //             console.log(`🔍 Fetching users for: ${searchQuery}`);

    //             const result = await getAllUsers(searchQuery); // ✅ Calls backend
    //             console.log("✅ API Response:", result);

    //             // ✅ Ensure `result` is always an array
    //             const usersFromAPI = Array.isArray(result) ? result : [];

    //             // ✅ Ensure `userList` is an array before filtering
    //             const safeUserList = Array.isArray(userList) ? userList : [];

    //             // ✅ First, filter users locally by name
    //             let filterUser = safeUserList.filter(user =>
    //                 user.name.toLowerCase().includes(searchQuery.toLowerCase())
    //             );

    //             // ✅ Merge local name filtering & backend search results
    //             let combinedResults = [...new Set([...filterUser, ...usersFromAPI])];

    //             setFilterUsers(combinedResults);
    //             setIsSearchOpen(true);
    //         } catch (error) {
    //             console.error("Search error:", error);
    //             toast.error("Failed to fetch users");
    //             setFilterUsers([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     const delayDebounce = setTimeout(() => {
    //         fetchFilteredUsers();
    //     }, 300); // 🔹 Debounce API calls

    //     return () => clearTimeout(delayDebounce);
    // }, [searchQuery, userList]); // 🔹 Keep `userList` for local filtering

    useEffect(() => {
        const fetchFilteredUsers = async () => {
          if (!searchQuery.trim()) {
            setFilterUsers([]);
            setIsSearchOpen(false);
            return;
          }
    
          try {
            setLoading(true);
            const result = await getAllUsers(searchQuery);
    
            // 🔥 FIX: Ensure results are unique by using a Map
            const usersFromAPI = Array.isArray(result) ? result : [];
            const safeUserList = Array.isArray(userList) ? userList : [];
    
            let filterUser = safeUserList.filter((user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
    
            // 🔥 FIX: Prevent duplicates using Map
            let combinedResults = [
              ...new Map(
                [...filterUser, ...usersFromAPI].map((user) => [user._id, user]) // 🔥 Unique key fix
              ).values()
            ];
    
            setFilterUsers(combinedResults);
            setIsSearchOpen(true);
          } catch (error) {
            console.error("Search error:", error);
            toast.error("Failed to fetch users");
            setFilterUsers([]);
          } finally {
            setLoading(false);
          }
        };
    
        const delayDebounce = setTimeout(() => {
          fetchFilteredUsers();
        }, 300); // 🔥 FIX: Debounce implemented for performance
    
        return () => clearTimeout(delayDebounce); // 🔥 FIX: Clear timeout properly
      }, [searchQuery, userList]);


    // useEffect(() => {
    //     if (searchQuery) {
    //         const filterUser = userList.filter(user => {
    //             return user.name.toLowerCase().includes(searchQuery.toLowerCase())
    //         })
    //         setFilterUsers(filterUser);
    //         setIsSearchOpen(true)
    //     } else {
    //         setFilterUsers([])
    //         setIsSearchOpen(false)
    //     }
    // }, [searchQuery, userList])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        setIsSearchOpen(false)
    }

    const handleUserClick = async (userId) => {
        try {
            setLoading(true)
            setIsSearchOpen(false)
            setSearchQuery("")
            await router.push(`user-profile/${userId}`)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearchClose = (e) => {
        if (!searchRef.current?.contains(e.target)) {
            setIsSearchOpen(false)
        }
    }
    useEffect(() => {
        document.addEventListener("click", handleSearchClose)
        return () => {
            document.removeEventListener("click", handleSearchClose)
        }
    })

    return (
        <header className='bg-white dark:bg-[rgb(36,37,38)] text-foreground shadow-md h-16 fixed top-0 left-0 right-0 z-50 p-2 '>
            <div className='mx-auto flex justify-between items-center p-2 '>
                <div className='flex items-center gap-2 md:gap-4'>
                    <Image
                        src='/images/Clogo.png'
                        width={40}
                        height={40}
                        alt='Facebook_logo'
                        onClick={() => handleNavigation('/')}
                        className='cursor-pointer'
                    />
                    <div className='relative' ref={searchRef}>
                        <form onSubmit={handleSearchSubmit}>
                            <div className='relative'>
                                <Search className='absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400' />
                                <Input className='pl-8 w-40 md:w-64 h-10 bg-gray-100dark:bg-[rgb(58,59,60)] rounded-full'
                                    placeholder='Search CUETbook...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchOpen(true)}
                                />
                            </div>


                            {isSearchOpen && (
                                <div className='absolute top-full left-0 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 z-50'>
                                    <div className='p-2'>
                                        {filterUsers.length > 0 ? (
                                            filterUsers.map((user) => (
                                                <div className='flex items-center space-x-8 p-2 hover:bg-gray-100dark:hover:bg-gray-700 rounded-md cursor-pointer'  key={`${user._id}`}
                                                    onClick={() => handleUserClick(user?._id)}>
                                                    <Search className='absolute text-sm text-gray-400' />
                                                    <div className='flex items-center gap-2'>
                                                        <Avatar>
                                                            {user?.profilePicture ? (
                                                                <AvatarImage src={user?.profilePicture} alt={user?.name} />
                                                            ) : (
                                                                <AvatarFallback className='dark:bg-gray-400'>{user?.name[0]}</AvatarFallback>
                                                            )}

                                                        </Avatar>
                                                        <span>{user?.name}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                <div className="p-2 text-gray-500">No user Found</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
                <nav className='hidden md:flex justify-around w-[40%] max-w-md'>
                    {[
                        { icon: Home, path: "/", name: 'home' },
                        { icon: Video, path: "/video-feed", name: 'video' },
                        { icon: Users, path: "/friends-list", name: 'friends' }
                    ].map(({ icon: Icon, path, name }) => (
                        <Button
                            key={name}
                            variant="ghost"
                            size="icon"
                            className={`relative text-gray-600 dark:text-gray-400 hover:text-green-600 hover:bg-transparent  ${activeTab === name ? "text-green-600" : " "}`}
                            onClick={() => handleNavigation(path, name)}
                        >
                            <Icon />
                        </Button>
                    ))}
                </nav>

                {/* user profile starts here*/}
                <div className='flex space-x-2 md:space-x-4 items-center'>
                    <Button variant="ghost" size="icon" className="md:hidden text-gray-600 cursor-pointer block" onClick={toggleSideBar}>
                        <Menu />
                    </Button>


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className='relative h-8 w-8 rounded-full'>
                                <Avatar className="h-8 w-8 mr-2">
                                    {user?.profilePicture ? (
                                        <AvatarImage src={user?.profilePicture} alt={user?.name} />
                                    ) : (
                                        <AvatarFallback className='dark:bg-gray-400'>{userPlaceholder}</AvatarFallback>
                                    )}
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='w-64 z-50' align='end'>
                            <DropdownMenuLabel className='font-normal'>
                                <div className='flex flex-col space-y-1'>
                                    <div className='flex items-center'>
                                        <Avatar className='h-8 w-8 mr-2'>
                                            {user?.profilePicture ? (
                                                <AvatarImage src={user?.profilePicture} alt={user?.name} />
                                            ) : (
                                                <AvatarFallback className='dark:bg-gray-400'>{userPlaceholder}</AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className=''>
                                            <p className='text-sm font-medium leading-none'>{user?.name}</p>
                                            <p className='text-xs mt-2 text-gray-medium leading-none'>{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleNavigation(`/user-profile/${user?._id}`)}
                            >
                                <Users /> <span className="ml-2">Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <MessageCircle /><span className='ml-2'>Messeges</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="cursor-pointer">
                                {theme === 'light' ? (
                                    <>
                                        <Moon />
                                        <span className='ml-2'>Dark Mode</span>
                                    </>
                                ) : (
                                    <>
                                        <Sun />
                                        <span className='ml-2'>Light Mode</span>
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                                <LogOut /><span className='ml-2'>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Header