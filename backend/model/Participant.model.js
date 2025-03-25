import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords
    participatedEvents: [
        {
            eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
            status: { type: String, enum: ["registered", "attended", "completed"], default: "registered" },
        }
    ]
});

const Participant = mongoose.model("Participant", participantSchema);
export default Participant;