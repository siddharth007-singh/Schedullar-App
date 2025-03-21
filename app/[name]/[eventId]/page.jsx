import { getEventsDetails } from '@/actions/events';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import EventsDetails from './_components/event-details';

// jst to rank my page on google
export async function genrateMetaData( {params} ) {
  const event = await getEventsDetails(params.name, params.eventId);

  if(!user){
    return{
      title: "Event not found",
    }
  }
  else{
    return{
      title: `${user.name} - Schedule a meeting`,
      description: `Book a meeting with ${user.name} to discuss your queries`,
    }
  }
}

const EventDetailspage = async({params}) => {

    const { name, eventId } = await params;
    const event = await getEventsDetails(name, eventId);

    if(!event){
        notFound();
    }

  return (
    <div className='flex flex-col justify-center lg:flex-row px-4 py-8'>
        <EventsDetails event={event}/>
        <Suspense fallback={<div>Loading...</div>}>
            
        </Suspense>
    </div>
  )
}

export default EventDetailspage