"use client"

import { eventSchema } from '@/app/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import useFetch from '@/hooks/use-fetch';
import { createEvents } from '@/actions/events';
import { useRouter } from "next/navigation";

const eventForm = ({ onSubmitForm }) => {
    const router = useRouter();
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: '',
            description: '',
            duration: 30,
            isPrivate: true
        }
    });

    const { loading, error, fn: fnCreateEvent } = useFetch(createEvents);

    const onSubmit = async (data) => {
        await fnCreateEvent(data);

        if (!loading && !error) onSubmitForm();
        router.refresh();
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 flex flex-col gap-4">
                <div>
                    <label htmlFor="title" className='block text-sm font-medium text-gray-700'>Event Title</label>
                    <Input id="title" {...register("title")} className="mt-1" />
                    {errors.title && (
                        <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>

                    <Textarea
                        {...register("description")}
                        id="description"
                        className="mt-1"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>


                <div>
                    <label
                        htmlFor="duration"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Duration (minutes)
                    </label>

                    <Input
                        id="duration"
                        {...register("duration", {
                            valueAsNumber: true,
                        })}
                        type="number"
                        className="mt-1"
                    />

                    {errors.duration && (
                        <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>
                    )}
                </div>


                <div>
                    <label
                        htmlFor="isPrivate"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Event Privacy
                    </label>

                    <Controller
                        name="isPrivate"
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => field.onChange(value === "true")}
                                value={field.value ? "true" : "false"}
                            >
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select privacy" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Private</SelectItem>
                                    <SelectItem value="false">Public</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />

                    {errors.isPrivate && (

                        <p className="text-red-500 text-xs mt-1">{errors.isPrivate.message}</p>
                    )}
                </div>

                {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}

                <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Create Event"}
                </Button>
            </form>
        </div>
    )
}

export default eventForm