import { getEventAvailability, getEventsDetails } from '@/actions/events';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import EventsDetails from './_components/event-details';
import BookingForm from './_components/booking-form';

// jst to rank my page on google
export async function genrateMetaData( {params} ) {
  const event = await getEventsDetails(params.name, params.eventId);

  if(!event || !event.userId){
    return{
      title: "Event not found",
    }
  }
  else{
    return{
      title: `${event.userId.name} - Schedule a meeting`,
      description: `Book a meeting with ${event.userId.name} to discuss your queries`,
    }
  }
}

// const EventBookingPage = async({params}) => {

//     const { name, eventId } = await params || {};
//     const event = await getEventsDetails(name, eventId);
//     const availability = await getEventAvailability(eventId);

//     console.log(availability);
//     if (!eventId) return notFound(); 

//     if(!event){
//         notFound();
//     }

//   return (
//     <div className='flex flex-col justify-center lg:flex-row px-4 py-8'>
//         <EventsDetails event={event}/>
//         <Suspense fallback={<div>Loading...</div>}>
//             <BookingForm/>
//         </Suspense>
//     </div>
//   )
// }


const EventBookingPage = async ({ params: paramsPromise }) => {
  try {
    const params = await paramsPromise; 
      console.log("Params received:", params);
      const { name, eventId } = params || {};
      if (!eventId) return notFound();

      const event = await getEventsDetails(name, eventId);
      if (!event) return notFound();

      const availability = await getEventAvailability(eventId);
      console.log("Availability Data:", availability);

      return (
          <div className='flex flex-col justify-center lg:flex-row px-4 py-8'>
              <EventsDetails event={event} />
              <BookingForm />
              <pre>{JSON.stringify(availability, null, 2)}</pre> 
          </div>
      );
  } catch (error) {
      console.error("Error loading event details:", error);
      return <div>Error loading event details.</div>;
  }
};

export default EventBookingPage;