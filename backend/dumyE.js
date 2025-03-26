import mongoose from "mongoose";
import Event from "./model/Event.model.js";
import User from "./model/User.model.js";
import Participant from "./model/Participant.model.js";
import connectDB from "./config/db.config.js";

// MongoDB Connection
connectDB();

// Dummy Events
const dummyEvents = [
    {
        name: "Accessibility Tech Expo",
        location: "New York, USA",
        date: new Date("2025-05-10"),
        description: "A tech expo showcasing innovations for disabled individuals.",
        photos: ["event1.jpg", "event2.jpg"],
        category: "Technology",
        registrationStart: new Date("2025-04-01"),
        registrationEnd: new Date("2025-05-05"),
        eventStart: new Date("2025-05-10T09:00:00"),
        eventEnd: new Date("2025-05-10T17:00:00"),
        geographicalLocation: {
            type: "Point",
            coordinates: [-74.006, 40.7128],
        },
        reviews: ["Amazing event!", "Great insights on accessibility tech"],
        volunteersAssigned: [],
        schedule: [
            {
                time: "10:00 AM",
                heading: "Opening Ceremony",
                details: "Keynote speech by industry leaders.",
            },
            {
                time: "12:00 PM",
                heading: "Panel Discussion",
                details: "Experts discussing accessibility challenges.",
            },
        ],
        ratings: { 1: 0, 2: 1, 3: 2, 4: 5, 5: 10 },
    },
    {
        name: "Inclusive Art Workshop",
        location: "San Francisco, USA",
        date: new Date("2025-06-15"),
        description: "An art workshop for disabled artists.",
        photos: ["art1.jpg", "art2.jpg"],
        category: "Art",
        registrationStart: new Date("2025-05-01"),
        registrationEnd: new Date("2025-06-10"),
        eventStart: new Date("2025-06-15T10:00:00"),
        eventEnd: new Date("2025-06-15T16:00:00"),
        geographicalLocation: {
            type: "Point",
            coordinates: [-122.4194, 37.7749],
        },
        reviews: ["Loved the creativity!", "Inspiring workshop!"],
        volunteersAssigned: [],
        schedule: [
            {
                time: "10:30 AM",
                heading: "Painting Techniques",
                details: "Live painting demo by renowned artist.",
            },
            {
                time: "2:00 PM",
                heading: "Sculpting Session",
                details: "Hands-on session for sculpting.",
            },
        ],
        ratings: { 1: 0, 2: 1, 3: 1, 4: 4, 5: 8 },
    },
];

// Dummy Users (Volunteers)
const dummyUsers = [
    {
        email: "volunteer1@example.com",
        name: "Alice Johnson",
        password: "securepassword",
        rank: "Compassion Warrior",
        eventsVolunteered: 3,
        volunteerHour: 10,
        currPoints: 500,
        pointsForNextRank: 100,
        nextRank: "Hope Bearer",
        eventsSubscribed: [],
        interestedCategories: ["Technology", "Health"],
        interestedTasks: ["Logistics", "Registration"],
        skills: ["Event Management", "Public Speaking"],
        availability: ["Monday", "Wednesday", "Friday"],
    },
    {
        email: "volunteer2@example.com",
        name: "John Doe",
        password: "securepassword",
        rank: "Hope Bearer",
        eventsVolunteered: 5,
        volunteerHour: 20,
        currPoints: 800,
        pointsForNextRank: 200,
        nextRank: "Kindness Sentinel",
        eventsSubscribed: [],
        interestedCategories: ["Art", "Education"],
        interestedTasks: ["Workshop Assistance", "Photography"],
        skills: ["Photography", "Graphic Design"],
        availability: ["Tuesday", "Thursday"],
    },
];

// Dummy Participants
const dummyParticipants = [
    {
        firstName: "Emma",
        lastName: "Watson",
        email: "emma@example.com",
        phone: "1234567890",
        password: "securepassword",
        interestedEvents: ["Accessibility Tech Expo", "Inclusive Art Workshop"],
        participatedEvents: [],
    },
    {
        firstName: "Liam",
        lastName: "Smith",
        email: "liam@example.com",
        phone: "0987654321",
        password: "securepassword",
        interestedEvents: ["Inclusive Art Workshop"],
        participatedEvents: [],
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
        await User.insertMany(dummyUsers);
        await Participant.insertMany(dummyParticipants);

        console.log("Dummy Data Inserted Successfully");
    } catch (error) {
        console.error("Error inserting dummy data:", error);
    } finally {
        mongoose.connection.close();
    }
};

// Run script
insertDummyData();
