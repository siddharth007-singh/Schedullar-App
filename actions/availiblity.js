"use server";

import mongoose from "mongoose";
import ConnectDb from "@/lib/Db";
import User from "@/models/user.model";
import Availability from "@/models/available.model";
import DayAvailability from "@/models/dayavailable.model";
import { currentUser } from "@clerk/nextjs/server";

export const getAvailiblit = async () => {
    await ConnectDb(); 

    const user = await currentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    try {
        const existUser = await User.findOne({ clerkUserId: user.id });

        if (!existUser || !existUser.availability) {
            return null;
        }

        // ✅ Ensure availability is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(existUser.availability)) {
            console.warn(`Invalid ObjectId: ${existUser.availability}`);
            return null;
        }

        // ✅ Fetch Availability data only if the ObjectId is valid
        const availability = await Availability.findById(existUser.availability)
            .populate("days")
            .lean();

        if (!availability) return null;

        const daysArray = availability.days || [];
        const availabilityData = {
            timeGap: availability.timeGap || null,
        };

        [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ].forEach((day) => {
            const dayAvailability = daysArray.find((d) => d.day === day.toUpperCase());
            availabilityData[day] = {
                isAvailable: !!dayAvailability,
                startTime: dayAvailability ? dayAvailability.startTime.toISOString().slice(11, 16) : "09:00",
                endTime: dayAvailability ? dayAvailability.endTime.toISOString().slice(11, 16) : "17:00",
            };
        });

        return availabilityData;
    } catch (error) {
        console.error("Error fetching availability:", error);
        throw new Error("Failed to fetch user availability");
    }
};


export const updateAvailability = async (data) => {
    await ConnectDb();

    const user = await currentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    try {
        let existUser = await User.findOne({ clerkUserId: user.id }).populate("availability");

        // If the user has no availability, create a new one
        if (!existUser.availability) {
            const newAvailability = await new Availability({
                userId: existUser._id,
                timeGap: data.timeGap || null,
                days: [],
            }).save();

            existUser = await User.findByIdAndUpdate(
                existUser._id,
                { availability: newAvailability._id },
                { new: true }
            ).populate("availability");
        }

        // Prepare availability data and create `DayAvailability` documents
        const availabilityData = await Promise.all(
            Object.entries(data).flatMap(async ([day, { isAvailable, startTime, endTime }]) => {
                if (isAvailable) {
                    const baseDate = new Date().toISOString().split("T")[0];

                    const newDayAvailability = await new DayAvailability({
                        availabilityId: existUser.availability._id,
                        day: day.toUpperCase(),
                        startTime: new Date(`${baseDate}T${startTime}:00Z`),
                        endTime: new Date(`${baseDate}T${endTime}:00Z`)
                    }).save();

                    return newDayAvailability._id;
                }
                return null;
            })
        );

        // Filter out null values (in case some days were not available)
        const validDays = availabilityData.filter(Boolean);

        // Update the `Availability` document with new `DayAvailability` IDs
        await Availability.findByIdAndUpdate(existUser.availability._id, {
            timeGap: data.timeGap,
            days: validDays,
        });

        return { success: true };

    } catch (error) {
        console.error("Error updating availability:", error);
        return { success: false, error: error.message };
    }
};
