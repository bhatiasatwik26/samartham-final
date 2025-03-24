import axios from 'axios';

// Define base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Define interfaces for API responses
export interface DashboardStats {
  volunteerCount: number;
  eventCount: number;
  activeEventCount: number;
  completedTaskCount: number;
}

export interface RecentActivity {
  id: string;
  type: 'volunteer_joined' | 'event_created' | 'task_completed' | 'donation_received';
  title: string;
  description: string;
  timestamp: string;
}

export interface EventProgress {
  eventId: string;
  title: string;
  progress: number;
  color: 'green' | 'blue' | 'orange' | 'purple';
}

export interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  interests: string;
  events: string[];
  joined: string;
  status: 'active' | 'inactive';
}

export interface VolunteerOverview {
  activeVolunteers: number;
  newVolunteers: number;
  pendingApprovals: number;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  status: 'upcoming' | 'active' | 'completed';
}

// Admin Dashboard API service
const adminApi = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return fallback data when API fails
      return {
        volunteerCount: 120,
        eventCount: 45,
        activeEventCount: 12,
        completedTaskCount: 89
      };
    }
  },

  // Get recent activities
  getRecentActivities: async (): Promise<RecentActivity[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/activities`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Return fallback data when API fails
      return [
        {
          id: '1',
          type: 'volunteer_joined',
          title: 'New volunteer joined',
          description: 'Sarah Williams registered as a volunteer',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'event_created',
          title: 'Event created',
          description: 'New event "Community Health Camp" added',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'task_completed',
          title: 'Task completed',
          description: 'Volunteer training session completed',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    }
  },

  // Get event progress data
  getEventProgress: async (): Promise<EventProgress[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/event-progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching event progress:', error);
      // Return fallback data when API fails
      return [
        { eventId: '1', title: 'Food Drive', progress: 78, color: 'green' },
        { eventId: '2', title: 'Beach Cleanup', progress: 45, color: 'blue' },
        { eventId: '3', title: 'Education Workshop', progress: 65, color: 'orange' }
      ];
    }
  },

  // Get volunteer overview
  getVolunteerOverview: async (): Promise<VolunteerOverview> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/volunteer-overview`);
      return response.data;
    } catch (error) {
      console.error('Error fetching volunteer overview:', error);
      // Return fallback data when API fails
      return {
        activeVolunteers: 98,
        newVolunteers: 22,
        pendingApprovals: 7
      };
    }
  },

  // Get all volunteers
  getVolunteers: async (): Promise<Volunteer[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/volunteers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      // Return fallback data when API fails
      return [
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "9876543210",
          address: "123 Main St, Bangalore",
          interests: "Teaching, Sports",
          events: ["Food Drive", "Beach Cleanup"],
          joined: "2023-01-15",
          status: "active"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "8765432109",
          address: "456 Park Ave, Bangalore",
          interests: "Art, Music",
          events: ["Education Workshop", "Fundraising Gala"],
          joined: "2023-02-20",
          status: "active"
        }
      ];
    }
  },

  // Add new volunteer
  addVolunteer: async (volunteer: Omit<Volunteer, 'id'>): Promise<Volunteer> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/volunteers`, volunteer);
      return response.data;
    } catch (error) {
      console.error('Error adding volunteer:', error);
      throw error;
    }
  },

  // Update volunteer events
  updateVolunteerEvents: async (volunteerId: number, events: string[]): Promise<Volunteer> => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/admin/volunteers/${volunteerId}/events`, { events });
      return response.data;
    } catch (error) {
      console.error('Error updating volunteer events:', error);
      throw error;
    }
  },

  // Get all events
  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
};

export default adminApi; 