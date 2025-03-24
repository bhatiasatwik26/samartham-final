import express from "express";
import { getEvents, getEventById } from "../controllers/event.controller.js";

const router = express.Router();

// Route to get all events
router.get("/", getEvents);

// Route to get an event by ID
router.get("/:id", getEventById);

export default router;
