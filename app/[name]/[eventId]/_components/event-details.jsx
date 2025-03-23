import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Clock, Calendar } from 'lucide-react';
import React from 'react'

const EventsDetails = ({ event }) => {
    if (!event?.user) {
        return <p>Error: User details not available</p>;
    }
    const user  = event.user;


    return (
        <div className='p-10 lg:w-1/3 bg-white'>
            <h1 className='text-3xl font-bold mb-4'>{event.title}</h1>
            <div className='flex items-center mb-4'>
                <Avatar className="w-12 h-12 mb-4">
                    <AvatarImage src={user?.imageUrl}/>
                </Avatar>
                <div>
                    <h2 className='text-xl font-semibold'>{user.name}</h2>
                    <p className='text-gray-600'> @{user.email}</p>
                </div>
            </div>

            <div className='flex items-center mb-2'>
                <Clock className='inline-block mr-2' size={20} />
                <span>{event.duration} minutes</span>
            </div>

             <div className='flex items-center mb-4'>
                <Calendar className='inline-block mr-2' size={20} />
                <span>Google Meet</span>
            </div>

            <p>{event.description}</p>
        </div>
    )
}

export default EventsDetails