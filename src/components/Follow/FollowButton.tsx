"use client" 

import { useState } from 'react'
import { Button } from '../ui/button';
import { Loader2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import { ToggleFollow } from '@/actions/user-action';

const FollowButton = ( {userid} : {userid: string}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
      setIsLoading(true);
  
      try {
        await ToggleFollow(userid);
        toast.success("User followed successfully");
      } catch (error) {
        console.error("toggle Follow:", error)
        toast.error("Error following user");
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Button
        size={"sm"}
        variant={"secondary"}
        onClick={handleFollow}
        disabled={isLoading}
        className="w-20"
      >
        {isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}
      </Button>
    );
}

export default FollowButton