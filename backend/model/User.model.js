// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  photo: { type: String, default: "profilePlaceholder.jpeg" },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  rank: {
    type: String,
    enum: ["Guardian Angel", "Compassion Warrior", "Hope Bearer", "Kindness Sentinel", "Inclusion Champion"],
    default: "Guardian Angel",
  },
  eventsVolunteered: { type: Number, default: 0 },
  volunteerHour: { type: Number, default: 0 },
  currPoints: { type: Number, default: 0 },
  pointsForNextRank: { type: Number, default: 0 },
  nextRank: { type: String, default: "Compassion Warrior" },
  eventsParticipated: { type: Number, default: 0 },
  eventsSubscribed: [
    {
      eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
      assignedTasks: [
        {
          name: { type: String, required: true },
          status: { type: String, enum: ["pending", "completed"], default: "pending" },
          deadline: { type: Date },
        },
      ],   
    },
  ],
    interestedCategories: [{ type: String }], 
    interestedTasks: [{ type: String }], 
    skills: [{ type: String }], 
  heatmapActivity: [
    {
      date: { type: Date, required: true },
      count: { type: Number, required: true },
    },
  ],
  availability: {
    type: [String],
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    default: [], // User can select available days
  },
});

const User = mongoose.model('User', UserSchema);
export default User;