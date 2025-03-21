import { Avatar, AvatarImage } from '@/components/ui/avatar';
import React from 'react'

const EventsDetails = ({ event }) => {
    if (!event?.user) {
        return <p>Error: User details not available</p>;
    }

    const user  = event.user;
    console.log("🚀 User Data in EventDetails:", user); 
    return (
        <div>
            <h1>{event.title}</h1>
            <div>
                <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={user?.imageUrl}/>
                </Avatar>
                    
                <p className="text-gray-600 text-center">
                    Welcome to my schedulling page. Please select an event to book a slot, and I will get back to you soon.
                </p>
            </div>

            <h2 className='text-3xl font-bold mb-2'>{user.name}</h2>
            <p className='text-3xl font-bold mb-2'> @{user.email}</p>
        </div>
    )
}

export default EventsDetails