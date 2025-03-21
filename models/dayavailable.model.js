import mongoose from "mongoose";

const DayOfWeekEnum = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
];

const dayAvailableSchema = new mongoose.Schema({
    availabilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Availability', required: true },
    day: { type: String, enum: DayOfWeekEnum, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
},{timestamps: true});

const DayAvailability = mongoose.models.DayAvailability || mongoose.model("DayAvailability", dayAvailableSchema);
export default DayAvailability;