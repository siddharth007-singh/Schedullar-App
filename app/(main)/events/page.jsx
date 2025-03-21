import { getEvents } from '@/actions/events'
import React, { Suspense } from 'react'
import EventCard from "@/components/event-card";


export default async function Events() {

    const { events, username } = await getEvents();

    if (!events || events.length === 0) {
        return <p>You haven&apos;t created any events yet.</p>;
    }

    return (
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {events.map((event) => (
            <EventCard key={event._id} event={event} username={username} />
          ))}
        </div>
    );
}
