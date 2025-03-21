import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({

    eventId:{type:mongoose.Schema.Types.ObjectId, ref: 'Event'},
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    name:{type: String, required: true},
    email:{type: String, required: true},
    additionalInfo:{type: String},
    startTime:{type: Date, required: true},
    endTime:{type: Date, required: true},
    meetLink:{type: String, required: true},
    googleEventId:{type: String, required: true},
}, {timestamps: true});


const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
