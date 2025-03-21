"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { deleteEvent } from "@/actions/events";

const EventCard = ({event,username, isPublic=false}) => {

    const router = useRouter();
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async() => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/${username}/${event._id}`);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy: ", err);
        }
    }   

    const {loading, fn:DeleteEvent} = useFetch(deleteEvent);

    const handleDelete = async() => {
        try {
            if(window?.confirm("Are you sure you want to delete this event?")){
                await DeleteEvent(event._id);
                router.reload();
            }
        } catch (error) {
            console.error("Failed to delete event: ", error);
            alert("Failed to delete event: ", error.message);
        }        
    }

    const handleCardClick = (e) => {
      if(e.target.tagName !=="BUTTON" && e.target.tagName !=="svg"){
          window?.open(
              `${window.location.origin}/${username}/${event._id}`,
              "_blank"
          )
      }
    } 

  return (
    <Card
      className="flex flex-col justify-between cursor-pointer mt-3" 
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="text-2xl">{event.title}</CardTitle>
        <CardDescription className="flex justify-between">
          <span>
            {event.duration} mins | {event.isPrivate ? "Private" : "Public"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{event.description.substring(0, event.description.indexOf("."))}.</p>
      </CardContent>
      {!isPublic && (
        <CardFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center"
          >
            <Link className="mr-2 h-4 w-4" />
            {isCopied ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {loading ? "Deleting..." : "Delete"}    
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;
