"use server"

import ConnectDb from "@/lib/Db"
import Event from "@/models/event.model";
import User from "@/models/user.model";
import { currentUser } from "@clerk/nextjs/server";
import mongoose from "mongoose";


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
            events, username:user.fullName  
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
