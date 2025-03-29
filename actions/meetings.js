"use server"

import ConnectDb from "@/lib/Db"
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import { currentUser } from "@clerk/nextjs/server";

export const getUsersMeetings = async (type = "upcomming") => {
    await ConnectDb();
    const user = await currentUser();
    if (!user || !user.id) return res.status(401).json({ message: "Unauthorized" });

    try {

        const existUser = await User.findOne({ clerkUserId: user.id });
        if (!existUser) return res.status(404).json({ message: "User not found" });

        console.log("User Found in DB:", existUser);



        const now = new Date();
        console.log("Current Time (UTC):", now.toISOString());

        const filter = {
            userId: existUser._id,
            startTime: type === "upcomming" ? { $gte: now } : { $lt: now }
        };

        console.log("Query Filter:", filter);

        const meetings = await Booking.find(filter)
            .populate({ path: "eventId", populate: { path: "userId", select: "name email" } })
            .sort({ startTime: type === "upcomming" ? 1 : -1 })
            .lean();

        console.log("Meetings Found:", meetings);
        return meetings;
    } catch (error) {
        console.error("Error fetching meetings:", error.message, error.stack);
        return [];
    }
}