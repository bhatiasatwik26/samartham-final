import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Check, Clock, Activity, Flame, Sword, Sparkles, Shield, HeartHandshake, Users } from "lucide-react";
import { events as allEvents } from "@/data/events";

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

const Demo_leaderboard = [
  { name: "Sarah Johnson", points: 980 },
  { name: "John Doe", points: 850 },
  { name: "Michael Chen", points: 780 },
  { name: "Emma Williams", points: 720 },
  { name: "David Lee", points: 650 },
];

const heatmapData = [
  { date: "2023-01-01", count: 3 },
  { date: "2023-01-15", count: 5 },
  { date: "2023-02-01", count: 2 },
  { date: "2023-02-10", count: 4 },
  { date: "2023-03-05", count: 3 },
  { date: "2023-03-15", count: 1 },
  { date: "2023-04-22", count: 6 },
  { date: "2023-05-03", count: 2 },
  { date: "2023-05-18", count: 3 },
  { date: "2023-06-02", count: 4 },
  { date: "2023-06-25", count: 5 },
  { date: "2023-07-12", count: 2 },
];

// Define days for the heatmap
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Enhanced heatmap data - would be from backend
const enhancedHeatmapData = Array.from({ length: 52 * 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (52 * 7 - i));
  return {
    date: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 5), // Random activity count
    dayOfWeek: date.getDay() === 0 ? 6 : date.getDay() - 1, // Adjust Sunday to be last
    week: Math.floor(i / 7),
  };
});

// Components
const EventCard = ({ event }) => {
  // Use the card to display real events from events.ts
  if (event.title) {
    // This is a real event from events.ts
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 h-full">
        <div className="w-full h-40 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
          />
        </div>
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{event.title}</h3>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {event.date}
            </span>
          </div>
          
          <div className="flex-grow">
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">
              {event.description}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link 
              to={`/events/${event.id}`}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium flex items-center justify-center"
            >
              View Event Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  } else {
    // This is the original mock event format
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-100 dark:border-gray-700 h-full">
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{event.name}</h3>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {event.tasks.length} Tasks
            </span>
          </div>
          
          <div className="flex-grow">
            <ul className="space-y-2 mb-4">
              {event.tasks.map((task, index) => (
                <li key={index} className="flex items-start">
                  <div className={`flex-shrink-0 w-4 h-4 mt-1 rounded-full ${task.status === 'pending' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                  <div className="ml-2">
                    <p className="text-gray-700 dark:text-gray-300">{task.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due: {task.deadline}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link 
              to={`/events/${event.id}`}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium flex items-center justify-center"
            >
              View Event Details
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

const WelcomeSection = ({ user }) => {
  const now = new Date();
  const hours = now.getHours();
  
  let greeting;
  if (hours < 12) greeting = "Good Morning";
  else if (hours < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";
  
  return (
    <div className="bg-gradient-to-r from-red-50 to-white dark:from-red-900/10 dark:to-gray-800 rounded-2xl shadow-md p-8 mb-8 border border-red-100 dark:border-red-900/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{greeting}, {user.name}!</h2>
          <p className="text-gray-600 dark:text-gray-300">Welcome to your volunteer dashboard. Here's an overview of your activities and upcoming tasks.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            to="/events"
            className="bg-red-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-red-700 transition-all duration-300 flex items-center"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Explore Events
          </Link>
        </div>
      </div>
    </div>
  );
};

const AchievementBadges = ({ user }) => {
  // Mock streak data - would come from backend in real app
  const currentStreak = 12; // days
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Your Achievements</h3>
        <div className="mt-2 md:mt-0 flex items-center bg-orange-50 dark:bg-orange-900/10 px-4 py-2 rounded-full border border-orange-100 dark:border-orange-900/30">
          <Flame className="h-5 w-5 text-orange-500 mr-2" />
          <span className="text-sm font-semibold text-gray-800 dark:text-white">{currentStreak} Day Streak</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-900/30 hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
            <HeartHandshake className="h-8 w-8 text-purple-600 dark:text-purple-500" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">Guardian Angel</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30 hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-2">
            <Sword className="h-8 w-8 text-red-600 dark:text-red-500" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">Compassion Warrior</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-900/30 hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-2">
            <Sparkles className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">Hope Bearer</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-500" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">Kindness Sentinel</span>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30 hover:shadow-md transition-all">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
            <Users className="h-8 w-8 text-green-600 dark:text-green-500" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">Inclusion Champion</span>
        </div>
      </div>
    </div>
  );
};

const TaskSummary = ({ events }) => {
  const pendingTasks = events ? events.reduce((count, event) => {
    return count + (event.tasks ? event.tasks.filter(task => task.status === 'pending').length : 1);
  }, 0) : 0;
  
  const completedTasks = events ? events.reduce((count, event) => {
    return count + (event.tasks ? event.tasks.filter(task => task.status !== 'pending').length : 0);
  }, 0) : 0;
  
  const totalTasks = pendingTasks + completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Task Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mr-4">
              <Clock className="h-6 w-6 text-yellow-700 dark:text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{pendingTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-4">
              <Check className="h-6 w-6 text-green-700 dark:text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{completedTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4">
              <Activity className="h-6 w-6 text-blue-700 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{completionRate}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple placeholder for Heatmap component - to be implemented later with a proper calendar heatmap library
const Heatmap = ({ data }) => {
  // Function to determine the color intensity based on count
  const getColorIntensity = (count) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count === 1) return 'bg-green-200 dark:bg-green-900/30';
    if (count === 2) return 'bg-green-300 dark:bg-green-700/60';
    if (count === 3) return 'bg-green-400 dark:bg-green-600';
    return 'bg-green-500 dark:bg-green-500';
  };

  // Generate month labels
  const generateMonths = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() - 11 + i);
      months.push(MONTHS[date.getMonth()]);
    }
    return months;
  };

  // Generate data grid resembling the leetcode style
  const generateDummyData = () => {
    // Generate 52 weeks of data (columns)
    return Array.from({ length: 52 }, () => 
      // Each week has 7 days (rows)
      Array.from({ length: 7 }, () => ({
        count: Math.floor(Math.random() * 5) // Random activity level 0-4
      }))
    );
  };

  const monthLabels = generateMonths();
  const activityData = generateDummyData();
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Your activity (past 52 weeks)</h4>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="mr-2">Less</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-200 dark:bg-green-900/30 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-300 dark:bg-green-700/60 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-500 dark:bg-green-500 rounded-sm"></div>
          </div>
          <span className="ml-2">More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div style={{ minWidth: "900px" }}>
          {/* Month labels row */}
          <div className="flex pl-14 mb-2">
            {monthLabels.map((month, i) => (
              <div key={i} className="flex-1 text-xs text-gray-600 dark:text-gray-400">{month}</div>
            ))}
          </div>
          
          {/* Activity grid with day labels */}
          <div className="flex">
            {/* Day labels column */}
            <div className="flex flex-col pr-3" style={{ width: "30px" }}>
              {DAYS_OF_WEEK.map((day, i) => (
                <div key={i} className="h-[15px] text-xs text-gray-600 dark:text-gray-400 flex items-center justify-end my-[3px]">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Activity cells */}
            <div className="flex flex-1 space-x-[3px]">
              {activityData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-[15px] h-[15px] rounded-sm ${getColorIntensity(day.count)}`}
                      title={`${day.count} contributions`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import the missing icons
import { Briefcase, Calendar, Trophy } from "lucide-react";

const VolunteerDashboard = () => {
  const [user, setUser] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribedEvents, setSubscribedEvents] = useState([]);

  const fetchUserData = async () => {
    try {
      // This will be replaced with actual API call later
      // const response = await fetch("https://api.example.com/user");
      // if (!response.ok) throw new Error("Failed to fetch user data");
      // const data = await response.json();
      // setUser(data.user);
      // setLeaderboard(data.leaderboard);
      
      // Using mock data for development
      setTimeout(() => {
        setUser(Demo_user);
        setLeaderboard(Demo_leaderboard);
        
        // Get real events that the user is subscribed to
        const userEvents = allEvents.filter(event => Demo_user.subscribedEventIds.includes(event.id));
        setSubscribedEvents(userEvents);
        
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-32 md:pt-36">
        <WelcomeSection user={user} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AchievementBadges user={user} />
            <TaskSummary events={subscribedEvents} />
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Your Events</h3>
                <Link to="/events" className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium flex items-center">
                  View All Events
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscribedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Stats Highlights</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Current Rank</span>
                  <span className="font-bold text-gray-800 dark:text-white capitalize">{user.rank}</span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Progress to {user.nextRank}</span>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{user.pointsForNextRank} points needed</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-red-600 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Events Participated</span>
                  <span className="font-bold text-gray-800 dark:text-white">{user.eventsVolunteered}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Volunteer Hours</span>
                  <span className="font-bold text-gray-800 dark:text-white">{user.volunteerHour}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Events</span>
                  <span className="font-bold text-gray-800 dark:text-white">{subscribedEvents.length}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Leaderboard</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">Top Volunteers</span>
              </div>
              
              <div className="space-y-4">
                {leaderboard.slice(0, 5).map((person, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 
                    ${person.name === user.name ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30' : 'border border-transparent'}`}
                  >
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full mr-3 
                      ${index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 border-2 border-yellow-400' : 
                        index === 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-2 border-gray-400' : 
                        index === 2 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-500 border-2 border-amber-400' : 
                        'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'} 
                      font-bold text-sm`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-grow">
                      <p className={`font-medium ${person.name === user.name ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
                        {person.name}
                      </p>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
                        <div 
                          className={`h-1.5 rounded-full ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-500' : 
                            index === 2 ? 'bg-amber-500' : 
                            'bg-blue-500'}`
                          } 
                          style={{ width: `${(person.points / leaderboard[0].points) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium flex flex-col items-end">
                      <span className="text-lg">{person.points}</span>
                      <span className="text-xs text-gray-500">points</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 text-red-600 dark:text-red-400 text-sm font-medium border border-red-200 dark:border-red-900/30 rounded-lg py-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                View Full Leaderboard
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Activity Calendar</h3>
          <Heatmap data={enhancedHeatmapData} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VolunteerDashboard; 