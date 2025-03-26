// dummyUser.js
import connectDB from "./config/db.config.js";
import User from "./model/User.model.js";

const seedUsers = async () => {
    try {
        await connectDB();

        // Delete existing users
        await User.deleteMany();

        // Dummy Users Data
        const users = [
            {
                email: "alice@example.com",
                name: "Alice Johnson",
                rank: "Guardian Angel",
                eventsVolunteered: 5,
                volunteerHour: 20,
                currPoints: 150,
                pointsForNextRank: 50,
                nextRank: "Compassion Warrior",
                eventsParticipated: 8,
                interestedCategories: ["Education", "Health"],
                interestedTasks: ["Teaching", "Fundraising"],
                skills: ["Public Speaking", "Event Management"],
                availability: ["Monday", "Wednesday", "Friday"],
            },
            {
                email: "bob@example.com",
                name: "Bob Smith",
                rank: "Compassion Warrior",
                eventsVolunteered: 10,
                volunteerHour: 40,
                currPoints: 300,
                pointsForNextRank: 100,
                nextRank: "Hope Bearer",
                eventsParticipated: 12,
                interestedCategories: ["Environment", "Animal Welfare"],
                interestedTasks: ["Tree Plantation", "Animal Rescue"],
                skills: ["First Aid", "Leadership"],
                availability: ["Tuesday", "Thursday"],
            },
            {
                email: "charlie@example.com",
                name: "Charlie Davis",
                rank: "Hope Bearer",
                eventsVolunteered: 15,
                volunteerHour: 60,
                currPoints: 500,
                pointsForNextRank: 200,
                nextRank: "Kindness Sentinel",
                eventsParticipated: 18,
                interestedCategories: ["Community Service", "Education"],
                interestedTasks: ["Mentoring", "Workshop Facilitation"],
                skills: ["Teaching", "Conflict Resolution"],
                availability: ["Saturday", "Sunday"],
            },
            {
                email: "diana@example.com",
                name: "Diana Evans",
                rank: "Kindness Sentinel",
                eventsVolunteered: 20,
                volunteerHour: 80,
                currPoints: 700,
                pointsForNextRank: 300,
                nextRank: "Inclusion Champion",
                eventsParticipated: 25,
                interestedCategories: ["Disability Support", "Mental Health"],
                interestedTasks: ["Counseling", "Awareness Campaigns"],
                skills: ["Empathy", "Therapeutic Communication"],
                availability: ["Monday", "Thursday", "Sunday"],
            },
            {
                email: "ethan@example.com",
                name: "Ethan Wright",
                rank: "Inclusion Champion",
                eventsVolunteered: 30,
                volunteerHour: 100,
                currPoints: 1000,
                pointsForNextRank: 500,
                nextRank: "Guardian Angel",
                eventsParticipated: 35,
                interestedCategories: ["Social Justice", "Human Rights"],
                interestedTasks: ["Advocacy", "Policy Making"],
                skills: ["Negotiation", "Public Relations"],
                availability: ["Wednesday", "Friday", "Saturday"],
            }
        ];

        await User.insertMany(users);

        console.log("Dummy users inserted successfully!");
        process.exit();
    } catch (error) {
        console.error(`Error inserting dummy users: ${error}`);
        process.exit(1);
    }
};

seedUsers();
