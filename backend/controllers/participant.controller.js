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
