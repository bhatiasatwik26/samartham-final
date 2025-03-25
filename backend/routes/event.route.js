import express from "express";
import { getEvents, getEventById, registerForEvent, postReview, getEventTasks } from "../controllers/event.controller.js";

const router = express.Router();

// Route to get all events
router.get("/", getEvents);

// Route to get an event by ID
router.get("/:id", getEventById);

// Event registration route
router.post("/register", registerForEvent);

// Route to post a review for an event
router.post("/:id/review", postReview);


// Route to get tasks assigned to volunteers for an event
router.get("/:eventId/tasks", getEventTasks);
export default router;
