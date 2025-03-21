import { getuserByName } from "@/actions/users";
import EventCard from "@/components/event-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import React from "react";

const Userpage = async ({ params }) => {
  if (!params || !params.name) {
    return notFound();
  }

  // Extract the full name and use only the first word for searching
  const firstName = params.name.split(" ")[0];
  const user = await getuserByName(firstName);

  if (!user) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={user.imageUrl} alt={user.name} />
        </Avatar>

        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-600 text-center">
          Welcome to my schedulling page. Please select an event to book a slot, and I will get back to you soon.
        </p>
      </div>

      {user.events.length===0?(
        <p className="text-center text-gray-600">No public events available</p>
      ):(
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {user.events.map((event) => {
            return(
              <EventCard
                key={event._id}
                event={event}
                username={params.name}
                isPublic
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Userpage;



// 3:08:05