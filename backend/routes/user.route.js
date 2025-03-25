import express from "express";
import {
  getUserById,
  getLeaderboard,
  updateTaskStatus,
  getAllVolunteers,
} from "../controllers/user.controller.js"; // Import controller

const router = express.Router();

// send mail
// router.get("/sendMail", sendMail);

// get leaderboard
router.get("/leaderboard", getLeaderboard);

// Route to get all volunteers
router.get("/volunteers", getAllVolunteers);

// Route to Update task status
router.put("/update-task-status", updateTaskStatus);

// Route to get user by ID
router.get("/:id", getUserById);



export default router;
