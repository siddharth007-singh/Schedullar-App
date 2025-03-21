import mongoose from 'mongoose';

const availableSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId, ref: 'User'},
    days:[{type:mongoose.Schema.Types.ObjectId, ref: 'DayAvailability'}],
    timeGap:{type: Number},
}, {timestamps: true});

const Availability = mongoose.models.Availability || mongoose.model("Availability", availableSchema);
export default Availability;