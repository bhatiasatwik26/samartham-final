import User from "../model/User.model.js"; // Adjust path if needed
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// get users details by id
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id).select("-password"); // Exclude password field
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find()
      .sort({ currPoints: -1 })
      .limit(10)
      .select("name currPoints rank")
      .lean();

    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    res.status(200).json(
      topUsers.map((user, index) => ({
        position: index + 1,
        name: user.name,
        score: user.currPoints,
        rank: user.rank,
      }))
    );
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { userId, eventId, taskName, status } = req.body;
    console.log(req.body);

    // Validate input
    if (!userId || !eventId || !taskName || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the event inside eventsSubscribed
    const event = user.eventsSubscribed.find(
      (event) => event.eventId.toString() === eventId
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found for this user" });
    }

    // Find the task inside assignedTasks
    const task = event.assignedTasks.find((task) => task.name === taskName);
    if (!task) {
      return res.status(404).json({ message: "Task not found in this event" });
    }

    // Update task status
    task.status = status;

    // Save the updated user
    await user.save();

    res.json({ message: "Task status updated successfully", user });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
