// models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    photos: { type: [String], default: [] }, // Array of image URLs
    geographicalLocation: {
        type: { type: String, default: "Point" },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    reviews: [{ type: String }], // Array of review strings
    volunteersAssigned: [
        {
        volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        taskName: { type: String, required: true },
        status: { type: String, enum: ["pending", "completed"], default: "pending" },
        },
    ],
    schedule: [
        {
            time: { type: String, required: true }, // e.g., "8:00 AM"
            heading: { type: String, required: true }, // e.g., "Registration & Check-in"
            details: { type: String, required: true }, // e.g., "Arrive early to complete your registration..."
        }
    ],
    });

const Event = mongoose.model('Event', eventSchema);
export default Event;