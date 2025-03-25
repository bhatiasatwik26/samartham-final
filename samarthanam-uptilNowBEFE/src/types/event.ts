export interface GeographicalLocation {
  type: "Point";
  coordinates: [number, number];
}

export interface VolunteerAssignment {
  volunteerId: string;
  taskName: string;
  status: "pending" | "completed";
}

export interface ScheduleItem {
  time: string;
  heading: string;
  details: string;
}

export interface Event {
  id?: string;
  name: string;
  location: string;
  date: Date;
  description?: string;
  photos?: string[];
  geographicalLocation: GeographicalLocation;
  reviews?: string[];
  volunteersAssigned?: VolunteerAssignment[];
  schedule?: ScheduleItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
