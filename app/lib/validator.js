import { z } from "zod";

export const userNameSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
})


export const eventSchema = z.object({
    title: z.string().min(3).max(100, 'Title must be between 3 and 100 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
    isPrivate: z.boolean(),
})

export const daySchema = z
    .object({
        isAvailable: z.boolean(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
    })
    .refine(
        (data) => {
            if (data.isAvailable) {
                return data.startTime < data.endTime;
            }
            return true;
        },
        {
            message: "End time must be more than start time",
            path: ["endTime"],
        }
    );


export const availabilitySchema = z.object({
    monday: daySchema,
    tuesday: daySchema,
    wednesday: daySchema,
    thursday: daySchema,
    friday: daySchema,
    saturday: daySchema,
    sunday: daySchema,
    timeGap: z.number().min(0, "Time gap must be 0 or more minutes").int(),
});