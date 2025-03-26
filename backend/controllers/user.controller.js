import User from "../model/User.model.js"; // Adjust path if needed
import Event from "../model/Event.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { sendEmail } from "../utils/email.utils.js";
import Participant from "../model/Participant.model.js";
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
    const user = await User.findById(userId).select("-password");
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

    const task = event.assignedTasks.find((task) => task.name === taskName);
    if (!task) {
      return res.status(404).json({ message: "Task not found in this event" });
    }

    // Update task status
    task.status = status;
    console.log("Ok1");

    // Save the updated user
    await user.save();

    res.json({ message: "Task status updated successfully", user });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllVolunteers = async (req, res) => {
  try {
    // Fetch all users (volunteers don't need to have volunteered yet)
    const volunteers = await User.find();

    if (volunteers.length === 0) {
      return res.status(404).json({ message: "No volunteers found." });
    }

    res.status(200).json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Register a Volunteer
export const registerVolunteer = async (req, res) => {
  try {
    const {
      email,
      name,
      interestedCategories,
      interestedTasks,
      skills,
      availability,
    } = req.body;

    // Check if the user already exists

    let user = await User.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ message: "User already registered as a volunteer!" });
    }

    // Create a new user with volunteer role
    user = new User({
      email,
      password: email,
      name,
      interestedCategories,
      interestedTasks,
      skills,
      availability,
    });

    await user.save();
    res
      .status(201)
      .json({ message: "Volunteer registered successfully!", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add a new volunteer
export const addVolunteer = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      interests,
      interestedCategories,
      status,
    } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if the volunteer already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "A volunteer with that email already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      interestedCategories: interestedCategories || [],
      // Add other fields as needed
    });

    await newUser.save();

    res.status(201).json({
      message: "Volunteer added successfully",
      volunteer: newUser,
    });
  } catch (error) {
    console.error("Error adding volunteer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update volunteer details
export const updateVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      interests,
      interestedCategories,
      events,
      status,
    } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (interestedCategories) user.interestedCategories = interestedCategories;

    // Save the updated user
    await user.save();

    res.status(200).json({
      message: "Volunteer updated successfully",
      volunteer: user,
    });
  } catch (error) {
    console.error("Error updating volunteer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Assign task to a user for a specific event
export const assignTaskToUser = async (req, res) => {
  try {
    const { userId, eventId, taskName, status, deadline } = req.body;

    // Validate input
    if (!userId || !eventId || !taskName) {
      return res.status(400).json({ message: "User ID, Event ID, and Task Name are required" });
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid User ID or Event ID format" });
    }

    // Find user and update eventsSubscribed
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let eventSubscription = user.eventsSubscribed.find(
      (event) => event.eventId.toString() === eventId
    );

    // If user is not subscribed, add event
    if (!eventSubscription) {
      eventSubscription = {
        eventId,
        assignedTasks: [],
      };
      user.eventsSubscribed.push(eventSubscription);
    }

    // Add task to assignedTasks
    eventSubscription.assignedTasks.push({
      name: taskName,
      status: status || "pending",
      deadline: deadline ? new Date(deadline) : null,
    });

    // Update in DB using `findByIdAndUpdate`
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { eventsSubscribed: user.eventsSubscribed }, $inc: { eventsVolunteered: user.eventsVolunteered === 0 ? 1 : 0 } },
      { new: true, runValidators: false } // `runValidators: false` to avoid password validation
    );

    const event = await Event.findById(eventId)
    sendEmail(user.email, "taskAssigned", {name: user.name, task: taskName, eventName: event.name, deadline: deadline});

    res.status(200).json({
      message: "Task assigned successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Register a volunteer for an event
export const requestVolunteerForEvent = async (req, res) => {
  try {
    const { userId, eventId } = req.body;

    // Validate input
    if (!userId || !eventId) {
      return res
        .status(400)
        .json({ message: "User ID and Event ID are required" });
    }

    // Validate MongoDB ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(eventId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid User ID or Event ID format" });
    }

    // Find the user
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already subscribed to the event
    const isAlreadySubscribed = user.eventsSubscribed.some(
      (event) => event.eventId.toString() === eventId
    );

    if (isAlreadySubscribed) {
      return res
        .status(400)
        .json({ message: "User is already registered for this event" });
    }

    // Send email with await to ensure it completes
    const emailResult = await sendEmail(
      user.email,
      "requestforEventRegistration",
      {
        name: user.name,
        eventName: event.name,
        eventCategory: event.category,
        eventDate: new Date(event.date).toLocaleDateString(),
        eventLocation: event.location,
        registrationDeadline: new Date(
          event.registrationEnd
        ).toLocaleDateString(),
      }
    );

    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
    }

    res.status(200).json({
      message: "Volunteer registered for event successfully",
      user,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Error registering volunteer for event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getIdOfVolunteer = async (req, res) => {
  const email = req.params.email;
  console.log(email);
  try {
    const user = await User.findOne({ email }).select("_id");
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }
    res.json({ error: false, id: user._id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export const tempHandler = async (req, res) => {
  console.log(req.body);
  try {
      const { email, participationType, eventId } = req.body;  
      

      if (!email || !participationType || !eventId) {
          return res.status(400).json({ message: "Email, type, and eventId are required." });
      }

      if (!mongoose.Types.ObjectId.isValid(eventId)) {
          return res.status(400).json({ message: "Invalid Event ID format." });
      }

      if (participationType === 'participant') {
          // Add event to participant's participatedEvents
          const participant = await Participant.findOneAndUpdate(
              { email },
              { 
                  $addToSet: { 
                      participatedEvents: { eventId, status: "registered" } 
                  } 
              },
              { new: true, upsert: true } // Create participant if not found
          );

          if (!participant) {
              return res.status(404).json({ message: "Participant not found." });
          }

          return res.status(200).json({
              message: "Event added to participant successfully.",
              participant
          });
      } else {
          // Add event to user's eventsSubscribed
          const user = await User.findOneAndUpdate(
              { email },
              { 
                  $addToSet: { 
                      eventsSubscribed: { eventId, assignedTasks: [] } 
                  } 
              },
              { new: true, upsert: true } // Create user if not found
          );

          if (!user) {
              return res.status(404).json({ message: "Volunteer not found." });
          }

          return res.status(200).json({
              message: "Event added to volunteer successfully.",
              user
          });
      }
  } catch (error) {
      console.error("Error in tempHandler:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};
