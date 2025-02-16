"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { UserMinus, UserPlus } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const FriendRequest = ({ friend, onAction }) => {
    const [isClient, setIsClient] = useState(false);
    console.log("Friend Request Data:", friend);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Prevents hydration errors caused by `undefined` values
    const userPlaceholder = useMemo(() => {
        return friend?.name
            ? friend.name.split(" ").map((name) => name[0]).join("")
            : "U";
    }, [friend]);

    // Prevent rendering before the client has mounted
    if (!isClient) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white mb-4 dark:bg-gray-800 p-4 shadow rounded-lg"
            >
                <Avatar className="h-32 w-32 rounded mx-auto mb-4">
                    {friend?.profilePicture ? (
                        <AvatarImage src={friend.profilePicture} alt={friend.name} />
                    ) : (
                        <AvatarFallback className="dark:bg-gray-400 font-semibold">{userPlaceholder}</AvatarFallback>
                    )}
                </Avatar>
                <h3 className="text-lg font-semibold text-center mb-4">
                    {friend?.name || "Unknown User"}
                </h3>
                <div className="flex flex-col justify-between">
                    <Button className="bg-green-500" size="lg" onClick={() => onAction("confirm", friend?._id)}>
                        <UserPlus className="mr-2 h-4 w-4" /> Confirm
                    </Button>
                    <Button className="mt-2" size="lg" onClick={() => onAction("delete", friend?._id)}>
                        <UserMinus className="mr-2 h-4 w-4" /> Delete
                    </Button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FriendRequest;
