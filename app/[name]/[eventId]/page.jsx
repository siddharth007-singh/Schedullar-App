import { getEventAvailability, getEventsDetails } from '@/actions/events';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import EventsDetails from './_components/event-details';
import BookingForm from './_components/booking-form';

// jst to rank my page on google
export async function genrateMetaData({ params }) {
  const event = await getEventsDetails(params.name, params.eventId);

  if (!event || !event.userId) {
    return {
      title: "Event not found",
    }
  }
  else {
    return {
      title: `${event.userId.name} - Schedule a meeting`,
      description: `Book a meeting with ${event.userId.name} to discuss your queries`,
    }
  }
}


const EventBookingPage = async ({ params: paramsPromise }) => {
  try {
    // ✅ Await params to ensure it's fully resolved
    const params = await paramsPromise; 

    if (!params || typeof params !== 'object') {
      console.error("Error: Invalid params object received.");
      return notFound();
    }

    // ✅ Extract `name` and `eventId` properly
    const name = params?.name;
    const eventId = params?.eventId;

    if (!name || !eventId) {
      console.error("Error: Missing required params - name or eventId.");
      return notFound();
    }

    console.log(`Params Received: name=${name}, eventId=${eventId}`);

    // ✅ Fetch event details safely
    const event = await getEventsDetails(name, eventId);

    if (!event) {
      console.error(`Error: Event not found for name=${name} & eventId=${eventId}`);
      return notFound();
    }

    // ✅ Handle errors while fetching availability
    let availability = [];
    try {
      availability = await getEventAvailability(eventId);
      console.log("Availability Data:", availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
      availability = []; // Prevents crashing
    }

    return (
      <div className='flex flex-col justify-center lg:flex-row px-4 py-8'>
        <EventsDetails event={event} />
        <BookingForm />
      </div>
    );
  } catch (error) {
    console.error("Error fetching event details:", error);
    return <div className="text-center text-red-500">Error loading event details.</div>;
  }
};

export default EventBookingPage;