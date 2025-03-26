import express from "express";
import {
  getUserById,
  getLeaderboard,
  updateTaskStatus,
  getAllVolunteers,
  registerVolunteer,
  addVolunteer,
  updateVolunteer,
  assignTaskToUser,
  requestVolunteerForEvent,
  getIdOfVolunteer,
  tempHandler
} from "../controllers/user.controller.js"; // Import controller

const router = express.Router();

// send mail
// router.get("/sendMail", sendMail);

// get leaderboard
router.get("/leaderboard", getLeaderboard);

// Route to get all volunteers
router.get("/volunteers", getAllVolunteers);

// register a new volunteer
router.post("/register", registerVolunteer);

// login volunteer
router.get("/mailtoid/:email", getIdOfVolunteer);

// add a new volunteer
router.post("/add", addVolunteer);

// update volunteer details
router.put("/update/:id", updateVolunteer);

// Route to Update task status
router.put("/update-task-status", updateTaskStatus);

// Route to assign task to user
router.post("/assign-task", assignTaskToUser);

// Route to register volunteer for event
router.post("/register-for-event", requestVolunteerForEvent);

// Route to get user by ID
router.get("/:id", getUserById);

router.post('/registerVolunteerOrPart', tempHandler)

export default router;
