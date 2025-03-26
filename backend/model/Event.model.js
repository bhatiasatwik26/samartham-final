import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    photos: { type: [String], default: [] },
    category: { type: String, required: true },
    registrationStart: { type: Date, required: true },
    registrationEnd: { type: Date, required: true },
    eventStart: { type: Date, required: true },
    eventEnd: { type: Date, required: true },
    geographicalLocation: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], required: true },
    },
    reviews: [{ type: String }], 
    volunteersAssigned: [
        {
            volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            taskName: { type: String, required: true },
            status: { type: String, enum: ["pending", "completed"], default: "pending" },
        },
    ],
    schedule: [
        {
            time: { type: String, required: true },
            heading: { type: String, required: true },
            details: { type: String, required: true },
        }
    ],
    ratings: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
    },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
