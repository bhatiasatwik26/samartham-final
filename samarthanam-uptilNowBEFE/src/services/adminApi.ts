import axios from "axios";

// Define base URL for API calls
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Define interfaces for API responses
export interface DashboardStats {
  volunteerCount: number;
  eventCount: number;
  activeEventCount: number;
  completedTaskCount: number;
}

export interface Reports {
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

export interface RecentActivity {
  id: string;
  type?:
    | "volunteer_joined"
    | "event_created"
    | "task_completed"
    | "donation_received";
  title: string;
  description: string;
  timestamp: string;
}

export interface EventProgress {
  eventId: string;
  title: string;
  progress: number;
  color: "green" | "blue" | "orange" | "purple";
}

export interface Volunteer {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  address: string;
  interests: string;
  events: string[];
  interestedCategories?: string[];
  status: "active" | "inactive";
}

export interface VolunteerOverview {
  activeVolunteers: number;
  newVolunteers: number;
}

export interface Event {
  id: number | string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  status: "upcoming" | "active" | "completed";
}

// Add reports interfaces
export interface ReportData {
  eventname: string;
  volunteer: number;
  participant: number;
  category?: string;
  rating?: string;
  imageUrl?: string;
  date?: string;
}

export interface CategoryStats {
  category: string;
  eventCount: number;
  volunteerCount: number;
}

// Add event detail interface
export interface EventDetailReport {
  eventid: string;
  eventname: string;
  volunteerno: number;
  participantno: number;
  review: {
    noOfstar: string;
    review: string;
  };
  ratingDistribution: {
    five: number;
    four: number;
    three: number;
    two: number;
    one: number;
  };
  allReviews: string[];
}

// Helper function to assign a random color
const getRandomColor = (): "green" | "blue" | "orange" | "purple" => {
  const colors: ("green" | "blue" | "orange" | "purple")[] = [
    "green",
    "blue",
    "orange",
    "purple",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Admin Dashboard API service
const adminApi = {
  // Get dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return fallback data when API fails
      return {
        volunteerCount: 120,
        eventCount: 45,
        activeEventCount: 12,
        completedTaskCount: 89,
      };
    }
  },

  // Get recent activities
  getRecentActivities: async (): Promise<RecentActivity[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/activities`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      // Return fallback data when API fails
      return [
        {
          id: "1",
          title: "New volunteer joined",
          description: "Sarah Williams registered as a volunteer",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          title: "Event created",
          description: 'New event "Community Health Camp" added',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          title: "Task completed",
          description: "Volunteer training session completed",
          timestamp: new Date(
            Date.now() - 2 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];
    }
  },

  // Get event progress data
  getEventProgress: async (): Promise<EventProgress[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/event/progress`);

      if (
        !response.data?.eventProgress ||
        !Array.isArray(response.data.eventProgress)
      ) {
        throw new Error("Invalid API response format");
      }

      // Map and transform the data
      const transformedData = response.data.eventProgress.map(
        (item, index) => ({
          eventId: (index + 1).toString(),
          title: item.name,
          progress: item.progress,
          color: getRandomColor(),
        })
      );

      return transformedData;
    } catch (error) {
      console.error("Error fetching event progress:", error);
      return [];
    }
  },

  // Get volunteer overview
  getVolunteerOverview: async (): Promise<VolunteerOverview> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/volunteer-overview`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching volunteer overview:", error);

      // Fallback in case of an error
      return {
        activeVolunteers: 0,
        newVolunteers: 0,
      };
    }
  },

  // Get all volunteers
  getVolunteers: async (): Promise<Volunteer[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/volunteers`);

      // Transform the API data into the desired format
      const transformVolunteers = (data: any[]): Volunteer[] => {
        return data.map((user, index) => {
          const hasTasks = user.eventsSubscribed.some(
            (event) => event.assignedTasks && event.assignedTasks.length > 0
          );

          return {
            id: index + 1, // Sequential ID
            name: user.name || "N/A",
            email: user.email || "N/A",
            phone: "9876543210", // Placeholder phone
            address: "123 Main St, Bangalore", // Placeholder address
            interests: "Teaching, Sports", // Placeholder interests
            events: user.eventsSubscribed
              .map((event) => event.assignedTasks.map((task) => task.name))
              .flat(), // Extracting all task names into events array
            interestedCategories: user.interestedCategories || [], // Include category interests
            status: hasTasks ? "active" : "inactive", // Status based on tasks
          };
        });
      };

      return transformVolunteers(response.data);
    } catch (error) {
      console.error("Error fetching volunteers:", error);

      // Fallback data in case of API failure
      // return [
      //   {
      //     id: 1,
      //     name: "John Doe",
      //     email: "john.doe@example.com",
      //     phone: "9876543210",
      //     address: "123 Main St, Bangalore",
      //     interests: "Teaching, Sports",
      //     events: ["Food Drive", "Beach Cleanup"],

      //     status: "active",
      //   },
      //   {
      //     id: 2,
      //     name: "Jane Smith",
      //     email: "jane.smith@example.com",
      //     phone: "8765432109",
      //     address: "456 Park Ave, Bangalore",
      //     interests: "Art, Music",
      //     events: ["Education Workshop", "Fundraising Gala"],

      //     status: "active",
      //   },
      // ];
    }
  },

  // Add new volunteer
  addVolunteer: async (volunteer: Omit<Volunteer, 'id'>): Promise<Volunteer> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/add`, {
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone || "",
        address: volunteer.address || "",
        interests: volunteer.interests || "",
        interestedCategories: volunteer.interestedCategories || [],
        status: volunteer.status
      });
      
      return response.data.volunteer;
    } catch (error) {
      console.error("Error adding volunteer:", error);
      throw new Error("Failed to add volunteer");
    }
  },

  // Update volunteer details
  updateVolunteer: async (
    volunteerId: string,
    volunteerData: Partial<Volunteer>
  ): Promise<Volunteer> => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/user/update/${volunteerId}`,
        volunteerData
      );
      return response.data.volunteer;
    } catch (error) {
      console.error("Error updating volunteer:", error);
      throw new Error("Failed to update volunteer");
    }
  },

  // Update volunteer events
  updateVolunteerEvents: async (
    volunteerId: number,
    events: string[]
  ): Promise<Volunteer> => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/admin/volunteers/${volunteerId}/events`,
        { events }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating volunteer events:", error);
      throw error;
    }
  },

  // Get all events
  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/event`);

      const transformEvents = (data: any[]): Event[] => {
        const currentDate = new Date();

        return data.map((event, index) => {
          const startDate = new Date(event.date);
          const endDate = new Date(startDate);
          endDate.setHours(endDate.getHours() + 6); // Assuming 6 hours event duration

          let status: "upcoming" | "active" | "completed";

          if (currentDate < startDate) {
            status = "upcoming";
          } else if (currentDate >= startDate && currentDate <= endDate) {
            status = "active";
          } else {
            status = "completed";
          }

          return {
            id: event._id || index.toString(),  // Use actual ID from backend
            title: event.name || "N/A",
            description: event.description || "No description available",
            date: startDate.toISOString(),
            location: event.location || "Unknown location",
            imageUrl:
              event.photos?.[0] || "https://placehold.co/300x300?text=Event",
            status,
          };
        });
      };

      return transformEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },

  // Get all event stats for reports
  getAllStats: async (): Promise<ReportData[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/events`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching event stats:", error);
      return [];
    }
  },

  // Get category stats for reports
  getCategoryStats: async (): Promise<CategoryStats[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/categories`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching category stats:", error);
      return [];
    }
  },

  // Get detailed report for a specific event
  getEventDetailReport: async (eventName: string): Promise<EventDetailReport | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports/event/${encodeURIComponent(eventName)}/detail`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching detailed report for event ${eventName}:`, error);
      return null;
    }
  }
};

export default adminApi;
