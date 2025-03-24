import express from "express";
import {
  getUserById,
  getLeaderboard,
  updateTaskStatus,
} from "../controllers/user.controller.js"; // Import controller

const router = express.Router();

// send mail
// router.get("/sendMail", sendMail);

// get leaderboard
router.get("/leaderboard", getLeaderboard);

// Route to get user by ID
router.get("/:id", getUserById);

// Route to Update task status
router.put("/update-task-status", updateTaskStatus);

export default router;
