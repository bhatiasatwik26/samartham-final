export interface Report {
  eventname: string;
  volunteer: number;
  participant: number;
}
export interface Reports {
  volunteer: any;
  eventId: string;
  eventName: string;
  eventImage: string[];
  eventDate: string;
  volunteerCount: number;
  participantCount: number;
  rating: string;
  ratingDistribution: {
    [key: string]: number; // Rating distribution as { "5": 10, "4": 8, ... }
  };
}

export interface Event {
  eventid: string;
  eventname: string;
  eventdate: string;
  eventparticipant: number;
  eventvolunteer: number;
  eventimage: string;
}

export interface EventDetail {
  eventid: string;
  volunteerno: number;
  participantno: number;
  review: {
    noOfstar: number;
    review: string;
  };
  ratingDistribution?: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
}

export interface EventAnalysis {
  eventId: string;
  participantRatio: number;
  volunteerRatio: number;
  satisfactionRate: number;
  efficiency: number;
}
