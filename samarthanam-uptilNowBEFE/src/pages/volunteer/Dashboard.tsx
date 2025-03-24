import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { events as allEvents } from "@/data/events";
import { updateUserActivity } from "@/services/activityApi";
import { updateLoginStreak } from "@/services/streakService";

// Import all subcomponents through the barrel file
import { 
  WelcomeSection, 
  AchievementBadges, 
  TaskSummary, 
  EventCard, 
  Heatmap,
  RegisteredEventsSection,
  Leaderboard,
  StreakDisplay
} from "@/pages/volunteer/components";

// Mock data for development
const Demo_user = {
  id: "001",
  name: "John Doe",
  email: "john.doe@example.com",
  rank: "gold",
  nextRank: "platinum",
  pointsForNextRank: 250,
  eventsVolunteered: 12,
  volunteerHour: 48,
  // We'll replace these mock events with real ones
  subscribedEventIds: ["event-1", "event-3", "event-5"],
};

// Mock event tasks for development
const Demo_event_tasks = {
  "event-1": [
    { id: "task-1", name: "Give water", deadline: "12/31/2024", status: "completed" },
    { id: "task-2", name: "Drink Give water", deadline: "2/18/2025", status: "pending" },
  ],
  "event-3": [
    { id: "task-3", name: "Distribute bikes", deadline: "3/5/2025", status: "completed" },
    { id: "task-4", name: "Take back bikes", deadline: "2/7/2025", status: "completed" },
  ],
  "event-5": [
    { id: "task-5", name: "Setup registration booth", deadline: "1/15/2025", status: "pending" },
    { id: "task-6", name: "Distribute t-shirts", deadline: "1/15/2025", status: "pending" },
    { id: "task-7", name: "Clean up area", deadline: "1/15/2025", status: "pending" },
  ]
};

const Demo_leaderboard = [
  { name: "Sarah Johnson", points: 980 },
  { name: "John Doe", points: 850 },
  { name: "Michael Chen", points: 780 },
  { name: "Emma Williams", points: 720 },
  { name: "David Lee", points: 650 },
];

const VolunteerDashboard = () => {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribedEvents, setSubscribedEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [userStats, setUserStats] = useState({
    rank: '',
    nextRank: '',
    pointsForNextRank: 0,
    eventsParticipated: 0,
    volunteerHours: 0,
    activeEvents: 0
  });

  const fetchUserData = async () => {
    try {
      // This will be replaced with actual API call later
      // INTEGRATION POINT: Replace the mock data with real API calls
      // const response = await fetch("https://api.example.com/user");
      // if (!response.ok) throw new Error("Failed to fetch user data");
      // const userData = await response.json();
      // 
      // // Fetch registered events with tasks
      // const eventsResponse = await fetch(`https://api.example.com/user/${userData.id}/events`);
      // if (!eventsResponse.ok) throw new Error("Failed to fetch events data");
      // const eventsData = await eventsResponse.json();
      // 
      // // Fetch leaderboard data
      // const leaderboardResponse = await fetch("https://api.example.com/leaderboard");
      // if (!leaderboardResponse.ok) throw new Error("Failed to fetch leaderboard data");
      // const leaderboardData = await leaderboardResponse.json();
      //
      // setUser(userData);
      // setLeaderboard(leaderboardData);
      // setRegisteredEvents(eventsData);
      // updateUserStats(eventsData, userData);
      
      // Using mock data for development
      setTimeout(() => {
        setUser(Demo_user);
        setLeaderboard(Demo_leaderboard);
        
        // Get real events that the user is subscribed to
        const userEvents = allEvents.filter(event => Demo_user.subscribedEventIds.includes(event.id));
        setSubscribedEvents(userEvents);
        
        // Create registered events with tasks
        const eventsWithTasks = userEvents.map(event => ({
          id: event.id,
          title: event.title,
          tasks: Demo_event_tasks[event.id] || []
        }));
        setRegisteredEvents(eventsWithTasks);
        
        // Update user stats
        updateUserStats(eventsWithTasks, Demo_user);
        
        setLoading(false);
        
        // Update login streak whenever a user logs in (dashboard loads)
        updateUserLoginStreak(Demo_user.id);
      }, 1000);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  };

  // Function to update the user's login streak
  const updateUserLoginStreak = async (userId: string) => {
    try {
      // Update login streak for this user
      await updateLoginStreak(userId);
      console.log("Login streak updated successfully");
    } catch (error) {
      console.error("Error updating login streak:", error);
      // Non-critical error, don't disrupt the user experience
    }
  };

  // Calculate user stats based on registered events and completed tasks
  const updateUserStats = (events, userData) => {
    if (!events || !userData) return;
    
    // INTEGRATION POINT: These calculations can be moved to the backend API
    // when real API integration is implemented. The front-end would then just display
    // the calculated values provided by the API.
    
    // Calculate total completed tasks
    const completedTasks = events.reduce((total, event) => {
      return total + event.tasks.filter(task => task.status === 'completed').length;
    }, 0);
    
    // Calculate active events (events with pending tasks)
    const activeEvents = events.filter(event => 
      event.tasks.some(task => task.status === 'pending')
    ).length;
    
    // Calculate volunteer hours (mock calculation - in real API this would come from backend)
    // For demo: 2 hours per completed task
    // IMPORTANT: When integrating with the real backend API, the hours should be provided by the API
    // as they may be calculated based on more complex business logic
    const volunteerHours = completedTasks * 2;
    
    // Update stats
    setUserStats({
      rank: userData.rank,
      nextRank: userData.nextRank,
      pointsForNextRank: userData.pointsForNextRank,
      eventsParticipated: events.length,
      volunteerHours: volunteerHours,
      activeEvents: activeEvents
    });
    
    // INTEGRATION POINT: When a task is completed, you may need to notify the backend
    // This could be implemented in the handleTaskStatusChange function with a POST request
    // Example:
    // await fetch(`https://api.example.com/events/${eventId}/tasks/${taskId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: isCompleted ? 'completed' : 'pending' })
    // });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleTaskStatusChange = async (eventId, taskId, isCompleted) => {
    try {
      // INTEGRATION POINT: Update task status on the backend
      // When API is ready, uncomment and modify this code:
      // const response = await fetch(`https://api.example.com/events/${eventId}/tasks/${taskId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: isCompleted ? 'completed' : 'pending' })
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to update task status');
      // }
      
      // Update activity data when task is completed/uncompleted
      if (user?.id) {
        const today = new Date().toISOString().split('T')[0];
        try {
          // Update user activity with the change
          await updateUserActivity(user.id, today, isCompleted);
          
          // Note: In a real implementation, you might want to refresh 
          // the activity calendar data here, but for performance reasons
          // you might choose to do this less frequently
        } catch (activityError) {
          console.error("Failed to update activity data:", activityError);
          // Not interrupting the main flow if just the activity update fails
        }
      }
      
      // Update local state
      setRegisteredEvents(prevEvents => {
        const updatedEvents = prevEvents.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              tasks: event.tasks.map(task => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    status: isCompleted ? 'completed' : 'pending'
                  };
                }
                return task;
              })
            };
          }
          return event;
        });
        
        // Update user stats when task status changes
        updateUserStats(updatedEvents, user);
        
        return updatedEvents;
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      // You could add user notification here for failed task updates
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchUserData}
            className="bg-red-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-700 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-red-50 to-gray-50 dark:from-gray-900 dark:via-red-900/10 dark:to-gray-900 background-animate">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8 pt-32 md:pt-36 relative z-10">
        <WelcomeSection user={user} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AchievementBadges user={user} />
            <TaskSummary events={registeredEvents} />
            
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-8 border border-red-100/40 dark:border-red-900/20">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Activity Calendar</h3>
              <Heatmap userId={user?.id} />
            </div>
            
            <RegisteredEventsSection 
              events={registeredEvents} 
              onTaskStatusChange={handleTaskStatusChange} 
            />
          </div>
          
          <div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-8 border border-red-100/40 dark:border-red-900/20">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Stats Highlights</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current Rank</span>
                  <span className="font-bold text-gray-800 dark:text-white capitalize">{userStats.rank}</span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress to {userStats.nextRank}</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{userStats.pointsForNextRank} points needed</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-red-600 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Events Participated</span>
                  <span className="font-bold text-gray-800 dark:text-white">{userStats.eventsParticipated}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Volunteer Hours</span>
                  <span className="font-bold text-gray-800 dark:text-white">{userStats.volunteerHours}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Events</span>
                  <span className="font-bold text-gray-800 dark:text-white">{userStats.activeEvents}</span>
                </div>
              </div>
            </div>
            
            {user?.id && <StreakDisplay userId={user.id} />}
            
            <Leaderboard currentUserId={user?.id} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VolunteerDashboard; 