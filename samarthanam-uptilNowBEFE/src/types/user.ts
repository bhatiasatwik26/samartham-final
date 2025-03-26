export interface User {
  id: string;
  photo: string;
  email: string;
  name: string;
  rank:
    | "Guardian Angel"
    | "Compassion Warrior"
    | "Hope Bearer"
    | "Kindness Sentinel"
    | "Inclusion Champion";
  eventsVolunteered: number;
  volunteerHour: number;
  pointsForNextRank: number;
  currentPoints: number;
  nextRank: string;
  eventsParticipated: number;
  eventsSubscribed: {
    eventId: string; // Mongoose ObjectId stored as string
    assignedTasks: {
      name: string;
      status: "pending" | "completed";
      deadline?: Date;
    }[];
  }[];
  heatmapActivity: {
    date: Date;
    count: number;
  }[];
}

export interface EventsSubscribed {
  eventId: string;
  // eventName: string;
  assignedTasks: {
    name: string;
    status: "pending" | "completed";
    deadline?: Date;
  }[];
}

export interface heatmapActivity {
  date: Date;
  count: number;
}
export interface Event {
  eventId: string;
  tasks: {
    name: string;
    status: string;
    deadline: string;
  }[];
}

export interface Leaderboards {
  position: number;
  name: string;
  score: number;
  rank:
    | "Guardian Angel"
    | "Compassion Warrior"
    | "Hope Bearer"
    | "Kindness Sentinel"
    | "Inclusion Champion";
}

export interface GeographicalLocation {
  type: string;
  coordinates: [number, number];
}

export interface Event {
  _id: string;
  name: string;
  location: string;
  date: string;
  description: string;
  geographicalLocation: GeographicalLocation;
  photos: string[];
  reviews: string[];
  volunteersAssigned: string[];
}
