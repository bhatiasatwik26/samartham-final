import express from "express";
import { getParticipantEvents, signupParticipant } from "../controllers/participant.controller.js";

const router = express.Router();

// signup new participant
router.post("/signup", signupParticipant);

// Route to get all events a participant has participated in
router.get("/:participantId/events", getParticipantEvents);

export default router;
