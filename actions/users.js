"use server"

import ConnectDb from "@/lib/Db";
import User from "@/models/user.model";
import { currentUser } from "@clerk/nextjs/server";
import Booking from "@/models/booking.model";

export const updateUsername = async (username) => {
    await ConnectDb();

    const user = await currentUser(); // ✅ Fetch current user
    if (!user || !user.id) throw new Error("Unauthorized");

    try {
        const existinguserName = await User.findOne({ name: username });

        if (existinguserName && existinguserName.userId !== user.id) {
            throw new Error("Username already taken");
        }

        await User.updateOne({ clerkUserId: user.id }, { name: username });

        return { message: "Username updated successfully" };


    } catch (error) {
        throw new Error(error.message);
    }
};


export const getuserByName = async (name) => {
    await ConnectDb();
    try {
        // Use case-insensitive search
        const user = await User.findOne({
            name: { $regex: new RegExp(`^${name}`, "i") } // Match first name case-insensitively
        })
        .select("id name email imageUrl") // Selecting relevant fields
        .populate({
            path: "events",
            match: { isPrivate: false }, // Filtering only public events
            options: { sort: { createdAt: -1 } }, // Sorting events by descending creation date
            select: "id title description duration isPrivate",
            populate: {
                path: "bookings",
                select: "_id", // Only fetching IDs for counting
            },
        })
        .lean();

        if (!user) return null;

        return {
            ...user,
            _id: user._id.toString(), //Extra
            events: user.events.map((event) => ({
                ...event,
                _id: event._id.toString(), //Extra
                _count: { bookings: event.bookings.length }, // Count of bookings
            })),
        };
    } catch (error) {
        throw new Error(error.message);
    }
}