import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    interestedEvents: [{ type: String }],
    additionalInfo: { type: String },
    participatedEvents: [
        {
            eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
            status: { type: String, enum: ["registered", "attended", "completed"], default: "registered" },
        }
    ]
});

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;