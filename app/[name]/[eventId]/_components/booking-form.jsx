"use client"
import { bookingSchema } from '@/app/lib/validator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import "react-day-picker/style.css";
import { useForm } from 'react-hook-form'

const bookingForm = ({event, availability}) => {

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

 const {register, handleSubmit, formState:{errors}, setValue} =  useForm({
    resolver:zodResolver(bookingSchema)
  })


  const availabilityDays = availability.map((day)=>new Date(day.date));
  const timeSlots = selectedDate? availability.find((day)=>day.date === format(selectedDate, "yyyy-MM-dd"))?.slots || []:[];


  useEffect(() => {
    if(selectedDate){
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate])

  useEffect(() => {
    if(selectedTime){
      setValue("time", selectedTime);
    }
  }, [selectedTime])

  const onSubmit = async (data)=>{
    console.log("Form submitted with data:", data);
  }

  return (
    <div className='flex flex-col gap-8 p-10 border bg-white'>
      <div className='md:h-96 flex flex-col md:flex-row gap-5'>
        <div className='w-full'>
          <DayPicker mode="single" selected={selectedDate}
            onSelect={(date)=>{
                setSelectedDate(date);
                setSelectedTime(null);
            }} 
            disabled={[{before: new Date()}]}
            modifiers={{
                available: availabilityDays, 
            }}
            modifiersStyles={{
              available:{
                background:"lightgreen",
                borderRadius:100
              }
            }}
          />
        </div>

        <div className='w-full h-full md:overflow-scroll no-scrollbar'>
            {selectedDate && (
              <div className='mb-4'>
                <h3 className='text-lg font-semibold mb-2'>Available Time Slots</h3>
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-2'>
                    {timeSlots.map((slot)=>{
                        return(
                          <Button key={slot} onClick={()=>setSelectedTime(slot)} variant={selectedTime===slot?"default":"outline"}>{slot}</Button>
                        )
                    })}
                </div>
              </div>
            )}
        </div>
      </div>
      {
        selectedTime && (<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div>
            <Input {...register("name")} placeholder='Full Name'/>
            {errors.name && (<span>{errors.name.message}</span>)}
          </div>
          <div>
            <Input {...register("email")} type="email" placeholder='Email'/>
            {errors.email && (<span>{errors.email.message}</span>)}
          </div>
          <div>
            <Textarea {...register("additionalInfo")} placeholder='Additional Information'/>
            {errors.message && (<span>{errors.message.message}</span>)}
          </div>

          <Button type="submit" className="w-full">Schedule Event</Button>
        </form>)
      }
    </div>
  )
}

export default bookingForm