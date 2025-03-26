import express from "express";
import { getEvents, getEventById, registerForEvent, 
    postReview, getEventTasks, findPotentialVolunteers, getRegisteredVolunteers, getEventStats
, getStatsOverview, getEventProgress, createEvent, deleteEvent, assignTask,
addFeedback, getEventReport, getAllEventStats} from "../controllers/event.controller.js";

const router = express.Router();

// Route to get all events
router.get("/", getEvents);


//  Create a new event
router.post("/create", createEvent);

router.get("/overview", getStatsOverview);

// get event prograss
router.get("/progress", getEventProgress);


// Get number of volunteers, participants & rating of every event
router.get('/getAllEventStats', getAllEventStats);

// Assign Task to a Volunteer
router.post("/assign-task", assignTask);

// DELETE - Delete Event by ID
router.delete("/delete/:id", deleteEvent);

// store feedback  --> it will add feadback and rating
router.post("/:id/feedback", addFeedback);

// get event data to genrate a report of event 
router.get('/:id/report', getEventReport);


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
