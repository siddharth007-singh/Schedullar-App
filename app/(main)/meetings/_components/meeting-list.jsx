import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const MeetingList = ({meetings, type}) => {

    if(meetings.length === 0) return <div>No {type} meetings found</div>

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {meetings.map((meeting, index) => {
            return (
                <Card key={index}  className={"flex flex-col justify-between"}>
                    <CardHeader>
                        <CardTitle>{meeting.eventId.title}</CardTitle>
                        <CardDescription>{new Date(meeting.startTime).toLocaleString()}</CardDescription>
                    </CardHeader>

                    <CardContent>
                        
                    </CardContent>
                </Card>
            )
        })}
    </div>
  )
}

export default MeetingList