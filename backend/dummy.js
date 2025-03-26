//-------------------------------
import mongoose from "mongoose";
import Event from "./model/Event.model.js";
import User from "./model/User.model.js";
import Participant from "./model/Participant.model.js";
import connectDB from "./config/db.config.js";

// MongoDB Connection
connectDB();

const dummyEvents = [
    {
        "name": "Free Health Checkup Camp",
        "category": "Healthcare",
        "description": "A free medical checkup camp providing consultations and basic tests.",
        "date": "2025-06-20",
    },
    {
        "name": "Free Health Checkup Camp",
        "category": "Healthcare",
        "description": "A free medical checkup camp providing consultations and basic tests.",
        "date": "2025-06-20",
    }
]
// Dummy Users (Volunteers)
const dummyUsers = [
    {
      photo: "profilePlaceholder.jpeg",
      email: "arjun.sharma@example.com",
      name: "Arjun Sharma",
      password: "hashedpassword1",
      rank: "Guardian Angel",
      eventsVolunteered: 1,
      volunteerHour: 5,
      currPoints: 10,
      pointsForNextRank: 20,
      nextRank: "Compassion Warrior",
      eventsParticipated: 0,
      eventsSubscribed: [{ eventId: new mongoose.Types.ObjectId("67e43526474631007f8ca8a6"), assignedTasks: [] }],
      interestedCategories: ["Sports"],
      interestedTasks: ["Logistics", "On-Ground Support"],
      skills: ["Event Coordination", "First Aid"],
      heatmapActivity: [
        { date: new Date("2024-10-15"), count: 3 },
        { date: new Date("2024-11-02"), count: 1 },
        { date: new Date("2024-12-10"), count: 2 },
        { date: new Date("2025-01-05"), count: 4 },
        { date: new Date("2025-02-20"), count: 2 },
        { date: new Date("2025-03-10"), count: 5 },
      ],
      availability: ["Saturday", "Sunday"],
    },
    {
      photo: "profilePlaceholder.jpeg",
      email: "neha.verma@example.com",
      name: "Neha Verma",
      password: "hashedpassword2",
      rank: "Compassion Warrior",
      eventsVolunteered: 1,
      volunteerHour: 8,
      currPoints: 15,
      pointsForNextRank: 25,
      nextRank: "Hope Bearer",
      eventsParticipated: 1,
      eventsSubscribed: [{ eventId: new mongoose.Types.ObjectId("67e435be474631007f8ca8f4"), assignedTasks: [] }],
      interestedCategories: ["Education"],
      interestedTasks: ["Teaching", "Book Collection"],
      skills: ["Public Speaking", "Content Writing"],
      heatmapActivity: [
        { date: new Date("2024-09-28"), count: 2 },
        { date: new Date("2024-10-18"), count: 1 },
        { date: new Date("2024-11-25"), count: 3 },
        { date: new Date("2025-01-02"), count: 2 },
        { date: new Date("2025-02-15"), count: 4 },
        { date: new Date("2025-03-08"), count: 1 },
      ],
      availability: ["Friday", "Saturday"],
    },
    {
      photo: "profilePlaceholder.jpeg",
      email: "rahul.mehra@example.com",
      name: "Rahul Mehra",
      password: "hashedpassword3",
      rank: "Hope Bearer",
      eventsVolunteered: 2,
      volunteerHour: 12,
      currPoints: 30,
      pointsForNextRank: 40,
      nextRank: "Kindness Sentinel",
      eventsParticipated: 0,
      eventsSubscribed: [{ eventId: new mongoose.Types.ObjectId("67e43635474631007f8ca93c"), assignedTasks: [] }],
      interestedCategories: ["Sports"],
      interestedTasks: ["Refereeing", "Scorekeeping"],
      skills: ["Leadership", "Team Management"],
      heatmapActivity: [
        { date: new Date("2024-08-20"), count: 1 },
        { date: new Date("2024-09-12"), count: 2 },
        { date: new Date("2024-10-30"), count: 4 },
        { date: new Date("2024-12-15"), count: 3 },
        { date: new Date("2025-01-22"), count: 5 },
        { date: new Date("2025-02-28"), count: 2 },
      ],
      availability: ["Sunday"],
    },
    {
      photo: "profilePlaceholder.jpeg",
      email: "sanya.patel@example.com",
      name: "Sanya Patel",
      password: "hashedpassword4",
      rank: "Compassion Warrior",
      eventsVolunteered: 1,
      volunteerHour: 6,
      currPoints: 12,
      pointsForNextRank: 22,
      nextRank: "Hope Bearer",
      eventsParticipated: 1,
      eventsSubscribed: [{ eventId: new mongoose.Types.ObjectId("67e435be474631007f8ca8f4"), assignedTasks: [] }],
      interestedCategories: ["Education"],
      interestedTasks: ["Event Promotion", "Fundraising"],
      skills: ["Marketing", "Social Media"],
      heatmapActivity: [
        { date: new Date("2024-09-10"), count: 3 },
        { date: new Date("2024-10-05"), count: 2 },
        { date: new Date("2024-11-20"), count: 1 },
        { date: new Date("2024-12-28"), count: 4 },
        { date: new Date("2025-02-01"), count: 2 },
        { date: new Date("2025-03-15"), count: 3 },
      ],
      availability: ["Monday", "Wednesday"],
    },
    {
      photo: "profilePlaceholder.jpeg",
      email: "vikas.iyer@example.com",
      name: "Vikas Iyer",
      password: "hashedpassword5",
      rank: "Kindness Sentinel",
      eventsVolunteered: 2,
      volunteerHour: 15,
      currPoints: 35,
      pointsForNextRank: 50,
      nextRank: "Inclusion Champion",
      eventsParticipated: 1,
      eventsSubscribed: [{ eventId: new mongoose.Types.ObjectId("67e43635474631007f8ca93c"), assignedTasks: [] }],
      interestedCategories: ["Sports"],
      interestedTasks: ["Umpiring", "Player Coordination"],
      skills: ["Strategy Planning", "Athletic Coaching"],
      heatmapActivity: [
        { date: new Date("2024-08-05"), count: 4 },
        { date: new Date("2024-09-18"), count: 2 },
        { date: new Date("2024-11-12"), count: 3 },
        { date: new Date("2024-12-30"), count: 5 },
        { date: new Date("2025-01-25"), count: 1 },
        { date: new Date("2025-03-10"), count: 2 },
      ],
      availability: ["Tuesday", "Thursday"],
    },
  ];


// Insert Dummy Data
const insertDummyData = async () => {
    await connectDB();

    try {
        // await Event.deleteMany({});
        // await User.deleteMany({});
        // await Participant.deleteMany({});
        
        await Event.insertMany(dummyEvents);
        // await User.insertMany(dummyUsers);
        // await Participant.insertMany(dummyParticipants);

        console.log("Dummy Data Inserted Successfully");
    } catch (error) {
        console.error("Error inserting dummy data:", error);
    } finally {
        mongoose.connection.close();
    }
};

// Run script
insertDummyData();