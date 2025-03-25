"use server";

import ConnectDb from "@/lib/Db";
import Booking from "@/models/booking.model";
import Event from "@/models/event.model";
import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { google } from "googleapis";
import mongoose from "mongoose";

export const createBooking = async (bookingData) => {
    await ConnectDb();

    const user = await currentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    try {
        console.log("Booking Data:", bookingData);

        const event = await Event.findById(bookingData.eventId)
            .populate({ path: "userId", select: "name email clerkUserId" }).lean();

        console.log("Fetched event:", event);

        if (!event) throw new Error("Event not found");

        console.log("clerkClient.users:", clerkClient.users);
        console.log("clerkClient.users.getUserOauthAccessToken:", clerkClient.users?.getUserOauthAccessToken);
    
        // Get OAuth access token from Clerk
        const response = await clerkClient.users.getUserOauthAccessToken(
            event.userId.clerkUserId,
            "oauth_google"
        );

        console.log("OAuth Response:", response);

        if (!response || response.length === 0) {
            throw new Error("Event creator has not connected Google Calendar.");
        }

        const token = response[0]?.token;
        if (!token) throw new Error("No valid OAuth token found.");

        // Setup Google OAuth client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        // Create Google Calendar event with Meet link
        const meetResponse = await calendar.events.insert({
            calendarId: "primary",
            conferenceDataVersion: 1,
            requestBody: {
                summary: `${bookingData.name} - ${event.title}`,
                description: bookingData.additionalInfo,
                start: { dateTime: bookingData.startTime },
                end: { dateTime: bookingData.endTime },
                attendees: [
                    { email: bookingData.email },
                    { email: event.userId.email }
                ],
                conferenceData: {
                    createRequest: { requestId: `${event.id}-${Date.now()}` },
                },
            },
        });

        const meetLink = meetResponse.data.hangoutLink;
        const googleEventId = meetResponse.data.id;

        console.log("Google Meet Link:", meetLink);

        // Save booking in MongoDB
        const booking = await Booking.create({
            eventId: event._id,
            userId: event.userId._id,
            name: bookingData.name,
            email: bookingData.email,
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            additionalInfo: bookingData.additionalInfo,
            meetLink,
            googleEventId,
        });

        return { success: true, booking: JSON.parse(JSON.stringify(booking)), meetLink };
    } catch (error) {
        console.error("Booking Error:", error);
        throw new Error(error.message);
    }
};