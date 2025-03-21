"use client";

import { UserButton } from '@clerk/nextjs'
import { ChartNoAxesGantt } from 'lucide-react'
import React from 'react'

const userMenu = () => {
  return (  
    <UserButton appearance={{
        elements:{
            avatarBox: "w-11 h-10",
        },
    }}>

    <UserButton.MenuItems>
        <UserButton.Link label='My Events' labelIcon={<ChartNoAxesGantt size={15}/>} href='/events'>Dashboard</UserButton.Link>
        <UserButton.Action label="manageAccount"/>
    </UserButton.MenuItems>
    </UserButton>
  )
}

export default userMenu