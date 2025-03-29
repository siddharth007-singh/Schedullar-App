import { getuserByName } from "@/actions/users";
import EventCard from "@/components/event-card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

// jst to rank my page on google
export async function genrateMetaData({ params }) {
  const user = await getuserByName(params.firstName);

  if (!user) {
    return {
      title: "User not found",
    }
  }
  else {
    return {
      title: `${user.name} - Schedule a meeting`,
      description: `Book a meeting with ${user.name} to discuss your queries`,
    }
  }
}

const Userpage = async ({ params }) => {
  // ✅ Ensure params are accessed properly
  if (!params || typeof params !== "object" || !("name" in params)) {
    console.error("Invalid params:", params);
    return notFound();
  }

  // ✅ Extract `name` properly
  const { name } = await params;

  // ✅ Ensure `name` is a valid string
  if (!name || typeof name !== "string") {
    return notFound();
  }

  console.log("Userpage params:", name);

  const firstName = name.split(" ")[0];
  try {
    const user = await getuserByName(firstName);

    // if (!user) {
    //   return notFound();
    // }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src={user.imageUrl} alt={user.name} />
          </Avatar>

          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-gray-600 text-center">
            Welcome to my scheduling page. Please select an event to book a slot, and I will get back to you soon.
          </p>
        </div>

        {user.events.length === 0 ? (
          <p className="text-center text-gray-600">No public events available</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {user.events.map((event) => (
              <EventCard key={event._id} event={event} username={name} isPublic />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in Userpage:", error);
    return <div className="text-center text-red-500">Error loading user page.</div>;
  }
};

export default function UserPageWrapper(props) {
  return (
    <Suspense fallback={<div>Loading user page...</div>}>
      <Userpage {...props} />
    </Suspense>
  );
}