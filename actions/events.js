"use server"

import ConnectDb from "@/lib/Db"
import Event from "@/models/event.model";
import User from "@/models/user.model";
import { currentUser } from "@clerk/nextjs/server";
import { addDays, format, parseISO, startOfDay } from "date-fns";
import Availability from "@/models/available.model";
import DayAvailability from "@/models/dayavailable.model";
import mongoose from "mongoose";
import Booking from "@/models/booking.model";


export const createEvents = async (data) => {
    await ConnectDb();
    const user = await currentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    try {

        // find user
        let existingUser = await User.findOne({ clerkUserId: user.id });

        if (!existingUser) {
            console.log("🔹 User not found in DB");

            existingUser = await User.create({
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: `${user.firstName} ${user.lastName}`,
            });
        }

        const event = await Event.create({
            ...data,
            userId: existingUser.id
        });

        existingUser.events.push(event._id);
        await existingUser.save();

        return event;
    } catch (error) {
        throw new Error(error.message);
    }
}


export const getEvents = async () => {
    await ConnectDb(); // Ensure DB connection is established
    const user = await currentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    try {
        const events = await Event.find()
            .populate("userId", "firstName")// Populate only required fields
            .sort({ createdAt: -1 })
            .lean();

        return {
            events, username: user.fullName
        };
    } catch (error) {
        console.error("Error fetching events:", error);
        throw new Error("Failed to fetch events: " + error.message);
    }
};

export const deleteEvent = async (id) => {
    await ConnectDb();
    const user = await currentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    try {
        // 🔹 Find the event by ID
        const event = await Event.findById(id);
        if (!event) {
            throw new Error("Event not found");
        }

        const existingUser = await User.findOne({ clerkUserId: user.id });
        if (!existingUser) {
            throw new Error("User not found");
        }

        // 🔹 Convert ObjectId to String before comparison
        const eventOwnerId = event.userId.toString(); // Convert ObjectId to string
        const currentUserId = existingUser._id.toString(); // Convert User's ObjectId to string

        // 🔹 Ensure the user is the owner of the event
        if (eventOwnerId !== currentUserId) {
            throw new Error("Unauthorized: You do not have permission to delete this event.");
        }

        // 🔹 Delete the event
        await Event.findByIdAndDelete(id);

        return { success: true, message: "Event deleted successfully." };
    } catch (error) {
        throw new Error("Failed to delete event: " + error.message);
    }
};


export const getEventsDetails = async (name, eventId) => {
    await ConnectDb();

    try {
        // Fetch the event and populate userId (user details)
        const event = await Event.findById(eventId)
            .populate({
                path: "userId",
                model: "User",   // ✅ Explicitly define the User model
                select: "name email imageUrl", // ✅ Fetch only necessary fields
            })
            .lean();

        if (!event) {
            throw new Error("Event not found");
        }

        // ✅ Ensure user exists
        if (!event.userId) {
            throw new Error("User details not found for this event");
        }

        // Rename `userId` to `user` for consistency
        const eventWithUser = { ...event, user: event.userId };
        return eventWithUser;
    } catch (error) {
        throw new Error("Failed to fetch event details: " + error.message);
    }
}


export const getEventAvailability = async (eventId) => {
    await ConnectDb();

    try {
        const event = await Event.findById(eventId)
            .populate({
                path: 'userId',
                model: 'User',
                populate: {
                    path: 'availability',
                    populate: {
                        path: 'days',
                        select: 'day startTime endTime'
                    }
                }
            })
            .populate('bookings', 'startTime endTime')
            .lean();

        if (!event || !event.userId || !event.userId.availability || !Array.isArray(event.userId.availability.days)) {
            console.error("No availability found for the event.");
            return [];
        }


        const { availability, bookings } = event.userId;

        const startDate = startOfDay(new Date());
        const endDate = addDays(startDate, 30);

        const availableDates = [];

        for (let date = startDate; date <= endDate; date = addDays(startDate, 1)) {
            const dayOfWeek = format(date, 'EEEE').toUpperCase();
            const dayAvailability = availability?.days?.find((d) => d.day === dayOfWeek);

            if (dayAvailability) {
                const dateStr = format(date, 'yyyy-MM-dd');

                const slots = genrateAvailableTimeSlot(
                    dayAvailability.startTime,
                    dayAvailability.endTime,
                    event.duration,
                    bookings,
                    dateStr,
                    availability.timeGap
                );

                availableDates.push({
                    date: dateStr,
                    slots,
                });
            }
        }

        return availableDates;

    } catch (error) {
        throw new Error("Failed to fetch event availability: " + error.message);
    }
};



function genrateAvailableTimeSlot(startTime, endTime, duration, bookings, dateStr, timeGap = 0) {
    const slots = [];

    let currentTime = parseISO(`${dateStr}T${startTime.toISOString().slice(11, 16)}`);
    const slotEndTime = parseISO(`${dateStr}T${endTime.toISOString().slice(11, 16)}`);


    const now = new Date();
    if (format(now, "yyyy-MM-dd") === dateStr) {
        currentTime = isBefore(currentTime, now)
            ? addMinutes(now, timeGap)
            : currentTime;
    }


    while (currentTime < slotEndTime) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60000);

        const isSlotAvailable = !bookings.some(({ startTime, endTime }) => {
            const bookingStart = parseISO(startTime);
            const bookingEnd = parseISO(endTime);
            return (
                (currentTime >= bookingStart && currentTime < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (currentTime <= bookingStart && slotEnd >= bookingEnd)
            );
        });

        if (isSlotAvailable) {
            slots.push(format(currentTime, "HH:mm"));
        }

        currentTime = slotEnd;
    }

    return slots;
}






