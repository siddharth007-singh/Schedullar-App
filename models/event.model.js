import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title:{type: String, required: true},
    description:{type: String},
    duration:{type: Number},
    userId:{type:String,required:true},
    bookings:[{type:mongoose.Schema.Types.ObjectId, ref: 'Booking'}],
    isPrivate:{type: Boolean, default: true},
},{timestamps: true});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;