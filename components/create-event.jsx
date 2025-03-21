"use client"

import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
    DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import EventForm from "./event-form";


const createEvent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const create = searchParams.get('create');
        if (create) {
            setIsOpen(true);
        }
    }, [searchParams])

    const handleClose = () => {
        setIsOpen(false);
        if(searchParams.get('create')==="true") {
            router.replace(window.location?.pathname);
        }
    }


  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Event</DrawerTitle>
        </DrawerHeader>
        
        <EventForm onSubmitForm={()=>handleClose()}/>

        <DrawerFooter className="px-6">
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default createEvent