"use client"

import { availabilitySchema } from '@/app/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { timeSlots } from '../data'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/use-fetch'
import { updateAvailability } from '@/actions/availiblity'


const availabilityForm = ({ initialdata }) => {

    const {fn:fnUpdateAvailability, loading, error} = useFetch(updateAvailability);

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(availabilitySchema),
        defaultValues: { ...initialdata },
    })

    const onSubmit =async (data) => {
        await fnUpdateAvailability(data);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday"
                ].map((day) => {

                    const isAvailable = watch(`${day}.isAvailable`);

                    return (
                        <div key={day} className='flex items-center space-x-4 mb-4'>
                            <Controller name={`${day}.isAvailable`} control={control}
                                render={({ field }) => {
                                    return (
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                setValue(`${day}.isAvailable`, checked);
                                                if (!checked) {
                                                    setValue(`${day}.startTime`, "09:00");
                                                    setValue(`${day}.endTime`, "17:00");
                                                }
                                            }}
                                        />
                                    )
                                }}
                            />
                            <span className='w-24'>{day.charAt(0).toUpperCase() + day.slice(1)}</span>

                            {isAvailable && (
                                <>
                                    <Controller name={`${day}.startTime`} control={control}
                                        render={({ field }) => {
                                            return (
                                                <>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue placeholder="Start Time" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timeSlots.map((time) => (
                                                                <SelectItem key={time} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </>
                                            )
                                        }}
                                    />

                                    <span>To</span>

                                    <Controller name={`${day}.endTime`} control={control}
                                        render={({ field }) => {
                                            return (
                                                <>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <SelectTrigger className="w-32">
                                                            <SelectValue placeholder="End Time" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timeSlots.map((time) => (
                                                                <SelectItem key={time} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </>
                                            )
                                        }}
                                    />
                                    {errors[day]?.endTime && <span className='text-red-500'>{errors[day].endTime.message}</span>}
                                </>
                            )}
                        </div>
                    )
                })}

                <div className="flex items-center space-x-4">
                    <span className="w-48">Minimum gap before booking (minutes):</span>

                    <Input
                        type="number"
                        {...register("timeGap", {
                            valueAsNumber: true,
                        })}
                        className="w-32"
                    />

                    {errors.timeGap && (
                        <span className="text-red-500 text-sm">{errors.timeGap.message}</span>
                    )}
                </div>
                {error && <span className='text-red-500'>{error}</span>}
                <div className="h-5"></div>
                <Button type="submit" className="mt-5" disabled={loading}>
                    {loading ? "updating..." : "update availability"}
                </Button>
            </form>
        </div>
    )
}

export default availabilityForm