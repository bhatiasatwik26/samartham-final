import express from "express";
import { getEvents, getEventById, registerForEvent, 
    postReview, getEventTasks, findPotentialVolunteers, getRegisteredVolunteers, getEventStats} from "../controllers/event.controller.js";

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

// Route to find potential volunteers
router.get("/:eventId/potential-volunteers", findPotentialVolunteers);

// Route to fetch volunteers registered for a particular event
router.get("/:eventId/volunteers", getRegisteredVolunteers);

// Route to get event vounteer & participant count
router.get("/:eventId/stats", getEventStats);

export default router;
