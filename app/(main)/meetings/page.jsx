import React, { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUsersMeetings } from '@/actions/meetings'
import MeetingList from './_components/meeting-list'



export const metadata = {
    title: "Yours Meetings",
    description: "View and manage your upcomming and past meetings"
}

const MeetingsPage = () => {
    return (
        <div>
            <Tabs defaultValue="account">
                <TabsList>
                    <TabsTrigger value="upcomming">Upcomming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                <TabsContent value="upcomming">
                    <Suspense fallback={<div>Loading upcomming Meeting...</div>}><UpcommingMeetings/></Suspense>
                </TabsContent>
                <TabsContent value="past">
                    <Suspense fallback={<div>Loading past Meeting...</div>}><PastMeetings/></Suspense>
                </TabsContent>
            </Tabs>
        </div>
    )
}


async function UpcommingMeetings(){
    const meetings = await getUsersMeetings("upcomming");
    return <MeetingList meetings={meetings} type="upcomming" />
}


async function PastMeetings(){
    const meetings = await getUsersMeetings("past");
    return <MeetingList meetings={meetings} type="past" />
}


export default MeetingsPage