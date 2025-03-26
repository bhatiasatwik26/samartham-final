import Event from "../model/Event.model.js";
import User from "../model/User.model.js";
import Participant from "../model/Participant.model.js";
import mongoose from "mongoose";

// Get statistics for all events (volunteers and participants)
export const getEventStats = async (req, res) => {
  try {
    const events = await Event.find({})
      .select("name category volunteersAssigned ratings reviews photos date")
      .lean();

    // Create stats array with volunteer and participant counts
    const stats = await Promise.all(events.map(async (event) => {
      // Count participants from Participant model
      const participantCount = await Participant.countDocuments({ 
        "participatedEvents.eventId": event._id 
      });

      // Calculate event rating
      const totalRatings = Object.values(event.ratings || {}).reduce((acc, count) => acc + count, 0);
      const weightedSum = Object.entries(event.ratings || {}).reduce((sum, [rating, count]) => sum + Number(rating) * count, 0);
      const averageRating = totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : 0;

      return {
        eventname: event.name,
        volunteer: event.volunteersAssigned?.length || 0,
        participant: participantCount,
        category: event.category,
        rating: averageRating,
        imageUrl: event.photos?.[0] || "",
        date: event.date
      };
    }));

    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting event stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching event statistics',
      error: error.message
    });
  }
};

// Get category-wise statistics
export const getCategoryStats = async (req, res) => {
  try {
    // Define categories
    const categories = ['Education', 'Healthcare', 'Environment', 'Sports', 'Arts & Culture', 'Community Service'];
    
    // Get category-wise event counts
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: "$category", eventCount: { $sum: 1 } } }
    ]);
    
    // Create a map for quick lookup
    const categoryEventMap = {};
    eventsByCategory.forEach(item => {
      categoryEventMap[item._id] = item.eventCount;
    });
    
    // Get volunteers interested in each category
    const volunteersByCategory = await User.aggregate([
      { $match: { role: "volunteer" } },
      { $unwind: "$interestedCategories" },
      { $group: { _id: "$interestedCategories", volunteerCount: { $sum: 1 } } }
    ]);
    
    // Create a map for quick lookup
    const categoryVolunteerMap = {};
    volunteersByCategory.forEach(item => {
      categoryVolunteerMap[item._id] = item.volunteerCount;
    });
    
    // Combine the data for all categories
    const categoryStats = categories.map(category => ({
      category,
      eventCount: categoryEventMap[category] || 0,
      volunteerCount: categoryVolunteerMap[category] || 0
    }));

    return res.status(200).json({
      success: true,
      data: categoryStats
    });
  } catch (error) {
    console.error('Error getting category stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching category statistics',
      error: error.message
    });
  }
};

// Get overall dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ 
      eventEnd: { $gte: new Date() } 
    });
    
    // Count completed tasks across all events
    const users = await User.find({}, "eventsSubscribed");
    let completedTaskCount = 0;
    
    users.forEach((user) => {
      if (user.eventsSubscribed) {
        user.eventsSubscribed.forEach((event) => {
          if (event.assignedTasks) {
            completedTaskCount += event.assignedTasks.filter((task) => task.status === "completed").length;
          }
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        volunteerCount: totalVolunteers,
        eventCount: totalEvents,
        activeEventCount: activeEvents,
        completedTaskCount: completedTaskCount
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// Get recent activities for admin dashboard
export const getRecentActivities = async (req, res) => {
  try {
    // Get the most recent user registrations, event creations, and task completions
    // First, get recent volunteer registrations
    const recentVolunteers = await User.find({ role: "volunteer" })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
      
    // Get recent events
    const recentEvents = await Event.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    
    // Combine and format activities
    const activities = [
      ...recentVolunteers.map(volunteer => ({
        id: `vol-${volunteer._id}`,
        title: "New Volunteer Registration",
        description: `${volunteer.name} joined as a volunteer`,
        timestamp: volunteer.createdAt || new Date().toISOString()
      })),
      ...recentEvents.map(event => ({
        id: `event-${event._id}`,
        title: "New Event Created",
        description: `Event "${event.name}" was created`,
        timestamp: event.createdAt || new Date().toISOString()
      }))
    ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);  // Get the 5 most recent activities
    
    return res.status(200).json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error getting recent activities:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching recent activities',
      error: error.message
    });
  }
};

// Get volunteer overview for admin dashboard
export const getVolunteerOverview = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Count active volunteers
    const activeVolunteers = await User.countDocuments({ 
      role: "volunteer",
      status: "active" 
    });
    
    // Count new volunteers this month
    const newVolunteers = await User.countDocuments({
      role: "volunteer",
      createdAt: { $gte: firstDayOfMonth }
    });
    
    return res.status(200).json({
      success: true,
      data: {
        activeVolunteers,
        newVolunteers
      }
    });
  } catch (error) {
    console.error('Error getting volunteer overview:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching volunteer overview',
      error: error.message
    });
  }
};

// Get detailed report for a specific event
export const getEventDetailReport = async (req, res) => {
  try {
    const { eventName } = req.params;
    
    // Find the event by name
    const event = await Event.findOne({ name: eventName })
      .select("name volunteersAssigned ratings reviews photos date")
      .lean();
      
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Count participants from Participant model
    const participantCount = await Participant.countDocuments({ 
      "participatedEvents.eventId": event._id 
    });
    
    // Calculate rating distribution
    const ratingDistribution = {
      five: event.ratings?.['5'] || 0,
      four: event.ratings?.['4'] || 0,
      three: event.ratings?.['3'] || 0,
      two: event.ratings?.['2'] || 0,
      one: event.ratings?.['1'] || 0
    };
    
    // Calculate average rating
    const totalRatings = Object.values(event.ratings || {}).reduce((acc, count) => acc + count, 0);
    const weightedSum = Object.entries(event.ratings || {}).reduce((sum, [rating, count]) => sum + Number(rating) * count, 0);
    const averageRating = totalRatings > 0 ? (weightedSum / totalRatings).toFixed(1) : "0.0";
    
    // Get reviews (if available)
    const allReviews = event.reviews?.map(review => review.comment) || [];
    
    // Find the best review (highest rating)
    const topReview = event.reviews?.length > 0 
      ? event.reviews.sort((a, b) => b.rating - a.rating)[0].comment
      : "No reviews available";
      
    return res.status(200).json({
      success: true,
      data: {
        eventid: event._id.toString(),
        eventname: event.name,
        volunteerno: event.volunteersAssigned?.length || 0,
        participantno: participantCount,
        review: {
          noOfstar: averageRating,
          review: topReview
        },
        ratingDistribution,
        allReviews: allReviews.length > 0 ? allReviews : [
          "Great experience volunteering!",
          "Well organized event.",
          "Would definitely participate again.",
          "Meaningful impact on the community."
        ]
      }
    });
  } catch (error) {
    console.error('Error getting event detail report:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching event detail report',
      error: error.message
    });
  }
}; 