"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userNameSchema } from '@/app/lib/validator';
import useFetch from '@/hooks/use-fetch';
import { updateUsername } from '@/actions/users';
import { BarLoader } from 'react-spinners';




const page = () => {

    const { isLoaded, user } = useUser();
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setOrigin(window.location.origin);
        }
    }, []);

    const {register, handleSubmit, setValue, formState:{errors} } = useForm({
        resolver:zodResolver(userNameSchema),
    })

    useEffect(()=>{
        if(isLoaded){
            setValue("username", user?.firstName)
        }
    },[isLoaded, setValue]);

    const {loading,error, fn:FnUpdateUsername } = useFetch(updateUsername);

    const onSubmit = async(data)=>{
        FnUpdateUsername(data.username);
    }

    return (        
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user?.firstName}</CardTitle>
                </CardHeader>

            {/*latest Update*/}
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Your Unique Link</CardTitle>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span>{origin}</span>
                                    <Input {...register("username")} placeholder="Username"/>
                                </div>

                                {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                                {error && <p className="text-red-500">{error?.message}</p>}
                                {loading && <BarLoader className='mb-4 w-1/2' color='#36d7b7'/>}

                            </div>

                            <Button type="submit">Update Username</Button>
                        </form>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    )
}

export default page