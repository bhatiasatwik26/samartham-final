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
  console.log("ok");
  console.log(req.body);
  try {
    const { userId, eventId } = req.body;

    // Validate input
    if (!userId || !eventId) {
      return res
        .status(400)
        .json({ message: "User ID and Event ID are required" });
    }

    // Find user and event
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!user || !event) {
      return res.status(404).json({ message: "User or Event not found" });
    }

    // Check if user is already registered for the event
    const isAlreadyRegistered = user.eventsSubscribed.some((sub) =>
      sub.eventId.equals(eventId)
    );

    if (isAlreadyRegistered) {
      return res
        .status(400)
        .json({ message: "User is already registered for this event" });
    }

    // Register user for the event
    user.eventsSubscribed.push({
      eventId: event._id,
      assignedTasks: [], // No tasks assigned initially
    });

    await user.save();

    // Send registration email
    await sendEmail(user.email, "registrationSuccess", { name: user.name });

    res
      .status(200)
      .json({ message: "User registered for event successfully", user });
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

    const event = await Event.findById(eventId).populate(
      "volunteersAssigned.volunteerId",
      "name email"
    );

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
      return res
        .status(404)
        .json({ message: "No matching volunteers found for this event." });
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
      return res
        .status(404)
        .json({ error: "No volunteers registered for this event" });
    }

    res.status(200).json({ volunteers });
  } catch (error) {
    console.error("Error fetching registered volunteers:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get number of volunteers, participants & rating of every event

export const getAllEventStats = async (req, res) => {
  try {
    const events = await Event.find();

    if (!events.length) {
      return res.status(404).json({ message: "No events found" });
    }

    // Prepare event stats array
    const eventStats = await Promise.all(
      events.map(async (event) => {
        const volunteerCount = event.volunteersAssigned.length;

        // Count participants from Participant model
        const participantCount = await Participant.countDocuments({
          "participatedEvents.eventId": event._id,
        });

        // Calculate event rating
        const totalRatings = Object.values(event.ratings).reduce(
          (acc, count) => acc + count,
          0
        );
        const weightedSum = Object.entries(event.ratings).reduce(
          (sum, [rating, count]) => sum + rating * count,
          0
        );
        const averageRating =
          totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : 0;

        return {
          eventId: event._id,
          eventName: event.name,
          eventImage: event.photos,
          eventDate: event.date,
          volunteerCount,
          participantCount,
          rating: averageRating,
          ratingDistribution: event.ratings,
        };
      })
    );

    res.status(200).json(eventStats);
  } catch (error) {
    console.error("Error fetching event stats:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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
    const participantCount = await Participant.countDocuments({
      "participatedEvents.eventId": eventId,
    });

    res.json({
      eventId,
      eventName: event.name,
      volunteerCount,
      participantCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStatsOverview = async (req, res) => {
  try {
    // Count total volunteers
    const volunteerCount = await User.countDocuments();

    // Count total events
    const eventCount = await Event.countDocuments();

    // Count active events (assuming an "isActive" field in the Event model)
    const activeEventCount = await Event.countDocuments({ isActive: true });

    // Count completed tasks from all users
    const users = await User.find({}, "eventsSubscribed");
    let completedTaskCount = 0;

    users.forEach((user) => {
      user.eventsSubscribed.forEach((event) => {
        completedTaskCount += event.assignedTasks.filter(
          (task) => task.status === "completed"
        ).length;
      });
    });

    // Return response
    res.status(200).json({
      volunteerCount,
      eventCount,
      activeEventCount,
      completedTaskCount,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEventProgress = async (req, res) => {
  try {
    // Fetch all events
    const events = await Event.find();

    // Calculate progress for each event
    const eventProgress = events.map((event) => {
      const totalTasks = event.volunteersAssigned.length;
      const completedTasks = event.volunteersAssigned.filter(
        (task) => task.status === "completed"
      ).length;
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        name: event.name,
        progress,
      };
    });

    res.status(200).json({ eventProgress });
  } catch (error) {
    console.error("Error fetching event progress:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Create Event API
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      date,
      time,
      location,
      imageUrl,
      registrationStart,
      registrationEnd,
      eventStart,
      eventEnd,
      geographicalLocation,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !category ||
      !description ||
      !date ||
      !time ||
      !location ||
      !registrationStart ||
      !registrationEnd ||
      !eventStart ||
      !eventEnd
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create new event
    const newEvent = new Event({
      name,
      category,
      description,
      date: new Date(date),
      time,
      location,
      photos: imageUrl ? [imageUrl] : [],
      registrationStart: new Date(registrationStart),
      registrationEnd: new Date(registrationEnd),
      eventStart: new Date(eventStart),
      eventEnd: new Date(eventEnd),
      geographicalLocation: geographicalLocation || {
        type: "Point",
        coordinates: [0, 0], // Default coordinates if none provided
      },
    });

    // Save to database
    await newEvent.save();

    // Find volunteers interested in this category
    const interestedVolunteers = await User.find({
      interestedCategories: category,
    });
    console.log(
      `Found ${interestedVolunteers.length} volunteers interested in ${category}`
    );

    // Send notification emails to interested volunteers
    if (interestedVolunteers.length > 0) {
      const notificationPromises = interestedVolunteers.map((volunteer) => {
        return sendEmail(volunteer.email, "newEventNotification", {
          name: volunteer.name,
          eventName: name,
          eventCategory: category,
          eventDate: new Date(date).toLocaleDateString(),
          eventLocation: location,
          registrationDeadline: new Date(registrationEnd).toLocaleDateString(),
        });
      });

      // Wait for all emails to be sent
      await Promise.all(notificationPromises);
    }

    res.status(201).json({
      message: "Event created successfully and notifications sent!",
      event: newEvent,
      notificationsSent: interestedVolunteers.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// delete a event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params; // Get event ID from URL params

    // Check if event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete event
    await Event.findByIdAndDelete(id);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Assign Task to Multiple Volunteers
export const assignTask = async (req, res) => {
  try {
    const { eventId, volunteerIds, taskName, deadline } = req.body;

    // Validate input
    if (!eventId || !volunteerIds || !taskName) {
      return res.status(400).json({
        message: "Event ID, volunteer IDs, and task name are required",
      });
    }

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find volunteers
    const volunteers = await User.find({ _id: { $in: volunteerIds } });
    if (volunteers.length === 0) {
      return res.status(404).json({ message: "No valid volunteers found" });
    }

    // Assign task to each volunteer
    const assignedVolunteers = [];
    for (const volunteer of volunteers) {
      event.volunteersAssigned.push({
        volunteerId: volunteer._id,
        taskName,
        status: "pending",
      });

      // Send Task Assigned Email
      await sendEmail(volunteer.email, "taskAssigned", {
        name: volunteer.name,
        task: taskName,
        eventName: event.name,
        deadline: deadline || "No deadline specified",
      });

      assignedVolunteers.push(volunteer.name);
    }

    await event.save();

    res.status(200).json({
      message: "Task assigned successfully and emails sent!",
      assignedVolunteers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Push only the review as a string
    if (review) event.reviews.push(review);

    // Ensure event.ratings exists and update the rating count
    event.ratings[rating] = (event.ratings[rating] || 0) + 1;

    await event.save();

    res.status(201).json({ message: "Feedback added successfully", event });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get an event data for making its report
export const getEventReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the event by ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Calculate total ratings
    const totalRatings =
      event.ratings[1] +
      event.ratings[2] +
      event.ratings[3] +
      event.ratings[4] +
      event.ratings[5];
    const weightedSum =
      event.ratings[1] * 1 +
      event.ratings[2] * 2 +
      event.ratings[3] * 3 +
      event.ratings[4] * 4 +
      event.ratings[5] * 5;
    const avgRating = totalRatings
      ? (weightedSum / totalRatings).toFixed(1)
      : 0;

    // Prepare response
    const eventReport = {
      eventid: id,
      volunteerno: event.volunteersAssigned.length,
      participantno: 150, // Hardcoded as per UI, update dynamically if needed
      review: {
        noOfstar: avgRating,
        review: event.reviews.length > 0 ? event.reviews[0] : "No reviews yet",
      },
      ratingDistribution: {
        five: event.ratings[5],
        four: event.ratings[4],
        three: event.ratings[3],
        two: event.ratings[2],
        one: event.ratings[1],
      },
      allReviews: event.reviews, // Sending all reviews
    };

    res.status(200).json(eventReport);
  } catch (error) {
    console.error("Error fetching event report:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
