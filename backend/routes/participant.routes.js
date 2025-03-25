import express from "express";
import { getParticipantEvents } from "../controllers/participant.controller.js";

const router = express.Router();

// Route to get all events a participant has participated in
router.get("/:participantId/events", getParticipantEvents);

export default router;
