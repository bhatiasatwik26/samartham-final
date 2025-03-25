import Event from "../model/Event.model.js";
import User from "../model/User.model.js";
import Participant from "../model/Participant.model.js";
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




export const findPotentialVolunteers = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }

    // Extract category from event (assuming event has a category field)
    const eventCategory = event.category;
    if (!eventCategory) {
        return res.status(400).json({ error: "Event does not have a category." });
    }

    // Find volunteers who are interested in this category
    const volunteers = await User.find({ interestedCategories: eventCategory });

    if (volunteers.length === 0) {
        return res.status(404).json({ message: "No matching volunteers found for this event." });
    }

    res.status(200).json({ volunteers });
} catch (error) {
    console.error("Error finding potential volunteers:", error);
    res.status(500).json({ error: "Server error" });
}
};


export const getRegisteredVolunteers = async (req, res) => {
  try {
      const { eventId } = req.params;

      // Find users who have subscribed to the given event
      const volunteers = await User.find(
          { "eventsSubscribed.eventId": eventId },
          "name email photo rank eventsSubscribed"
      );

      if (!volunteers || volunteers.length === 0) {
          return res.status(404).json({ error: "No volunteers registered for this event" });
      }

      res.status(200).json({ volunteers });
  } catch (error) {
      console.error("Error fetching registered volunteers:", error);
      res.status(500).json({ error: "Server error" });
  }
};


// Get number of volunteers & participants in a event
export const getEventStats = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Find event and count volunteers
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        const volunteerCount = event.volunteersAssigned.length;

        // Count participants from Participant model
        const participantCount = await Participant.countDocuments({ "participatedEvents.eventId": eventId });

        res.json({
            eventId,
            eventName: event.name,
            volunteerCount,
            participantCount
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};