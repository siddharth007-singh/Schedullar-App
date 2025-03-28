import mongoose from 'mongoose';
import User from './user.model';

const eventSchema = new mongoose.Schema({
    title:{type: String, required: true},
    description:{type: String},
    duration:{type: Number},
    userId:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    bookings:[{type:mongoose.Schema.Types.ObjectId, ref: 'Booking'}],
    isPrivate:{type: Boolean, default: true},
},{timestamps: true});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;