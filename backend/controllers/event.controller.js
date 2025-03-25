import Event from "../model/Event.model.js";
import User from "../model/User.model.js";
import { sendEmail } from "../utils/email.utils.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};


export const registerForEvent = async (req, res) => {
  try {
      const { userId, eventId } = req.body;

      // Validate input
      if (!userId || !eventId) {
          return res.status(400).json({ message: "User ID and Event ID are required" });
      }

      // Find user and event
      const user = await User.findById(userId);
      const event = await Event.findById(eventId);

      if (!user || !event) {
          return res.status(404).json({ message: "User or Event not found" });
      }

      // Check if user is already registered for the event
      const isAlreadyRegistered = user.eventsSubscribed.some(sub => sub.eventId.equals(eventId));

      if (isAlreadyRegistered) {
          return res.status(400).json({ message: "User is already registered for this event" });
      }

      // Register user for the event
      user.eventsSubscribed.push({
          eventId: event._id,
          assignedTasks: [] // No tasks assigned initially
      });

      await user.save();

      // Send registration email
      await sendEmail(user.email, "registrationSuccess", { name: user.name });

      res.status(200).json({ message: "User registered for event successfully", user });
  } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};


// Controller to post a review for an event
export const postReview = async (req, res) => {
  try {
      const { id } = req.params; // Event ID
      const { review } = req.body; // Review text

      if (!review) {
          return res.status(400).json({ error: "Review cannot be empty" });
      }

      // Find the event and update the reviews array
      const updatedEvent = await Event.findByIdAndUpdate(
          id,
          { $push: { reviews: review } }, // Append the review
          { new: true } // Return updated event
      );

      if (!updatedEvent) {
          return res.status(404).json({ error: "Event not found" });
      }

      res.json({ message: "Review added successfully", event: updatedEvent });
  } catch (error) {
      console.error("Error posting review:", error);
      res.status(500).json({ error: "Server error" });
  }
};


export const getEventTasks = async (req, res) => {
  try {
      const { eventId } = req.params;

      const event = await Event.findById(eventId)
          .populate("volunteersAssigned.volunteerId", "name email");

      if (!event) {
          return res.status(404).json({ error: "Event not found" });
      }

      res.json({
          event: event.name,
          volunteersAssigned: event.volunteersAssigned, // Directly return assigned volunteers
      });

  } catch (error) {
      console.error("Error fetching event tasks:", error);
      res.status(500).json({ error: "Server error" });
  }
};