import Participant from "../model/Participant.model.js";

// Controller to get events a participant has participated in
export const getParticipantEvents = async (req, res) => {
    try {
        const { participantId } = req.params;

        const participant = await Participant.findById(participantId).populate("participatedEvents.eventId");

        if (!participant) {
            return res.status(404).json({ error: "Participant not found" });
        }

        res.json({ events: participant.participatedEvents });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// Register/SignUpp a new Participant
export const signupParticipant = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, interestedEvents, additionalInfo } = req.body;

        // Check if user already exists
        let participant = await Participant.findOne({ email });
        if (participant) {
            return res.status(400).json({ message: "Email already registered!" });
        }

        // Create new participant
        participant = new Participant({
            firstName,
            lastName,
            email,
            phone,
            password, // Storing password as plain text (Not Recommended)
            interestedEvents,
            additionalInfo
        });

        await participant.save();

        res.status(201).json({ message: "Participant registered successfully!", participant });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


