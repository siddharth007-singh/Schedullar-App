import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkUserId: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    name:{
        type: String,
    },

    imageUrl:{
        type: String,
    },

    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],

    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],

    availability:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Availability',
        default: null
    }
},{timestamps: true});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;