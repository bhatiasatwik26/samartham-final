import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Home,
  Users,
  Calendar,
  Settings,
  MessageSquare,
  BarChart3,
  LogOut,
  Search,
  UserPlus,
  FileText,
  Edit,
  Eye,
  Moon,
  Sun,
  X,
  Loader2
} from 'lucide-react';
import { events } from '@/data/events'; // Import events from data file
import adminApi, { 
  DashboardStats, 
  RecentActivity, 
  EventProgress, 
  Volunteer, 
  VolunteerOverview 
} from '@/services/adminApi';
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddVolunteerModalOpen, setIsAddVolunteerModalOpen] = useState(false);
  const [isEditEventsModalOpen, setIsEditEventsModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [currentVolunteer, setCurrentVolunteer] = useState<any>(null);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [newVolunteer, setNewVolunteer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    interests: '',
    status: 'active'
  });
  
  // API data states
  const [isLoading, setIsLoading] = useState({
    stats: false,
    activities: false,
    eventProgress: false,
    volunteerOverview: false,
    volunteers: false,
    events: false,
    addVolunteer: false,
    createEvent: false,
    generateReport: false,
    sendNotification: false
  });
  const [stats, setStats] = useState<DashboardStats>({
    volunteerCount: 0,
    eventCount: 0,
    activeEventCount: 0,
    completedTaskCount: 0
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [eventProgress, setEventProgress] = useState<EventProgress[]>([]);
  const [volunteerOverview, setVolunteerOverview] = useState<VolunteerOverview>({
    activeVolunteers: 0,
    newVolunteers: 0,
    pendingApprovals: 0
  });
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Add admin info to state
  const [adminInfo, setAdminInfo] = useState({
    name: "Admin Dashboard",
    role: "Administrator",
    isLoading: true
  });

  // Search and filter volunteers
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || volunteer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    // Fetch stats
    setIsLoading(prev => ({ ...prev, stats: true }));
    try {
      const statsData = await adminApi.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, stats: false }));
    }
    
    // Fetch recent activities
    setIsLoading(prev => ({ ...prev, activities: true }));
    try {
      const activitiesData = await adminApi.getRecentActivities();
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, activities: false }));
    }
    
    // Fetch event progress
    setIsLoading(prev => ({ ...prev, eventProgress: true }));
    try {
      const progressData = await adminApi.getEventProgress();
      setEventProgress(progressData);
    } catch (error) {
      console.error("Error fetching event progress:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, eventProgress: false }));
    }
    
    // Fetch volunteer overview
    setIsLoading(prev => ({ ...prev, volunteerOverview: true }));
    try {
      const overviewData = await adminApi.getVolunteerOverview();
      setVolunteerOverview(overviewData);
    } catch (error) {
      console.error("Error fetching volunteer overview:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, volunteerOverview: false }));
    }
  };
  
  // Fetch volunteers
  const fetchVolunteers = async () => {
    setIsLoading(prev => ({ ...prev, volunteers: true }));
    try {
      const volunteersData = await adminApi.getVolunteers();
      setVolunteers(volunteersData);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      toast({
        title: "Error",
        description: "Failed to load volunteers data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(prev => ({ ...prev, volunteers: false }));
    }
  };
  
  // Add function to fetch admin info
  const fetchAdminInfo = async () => {
    try {
      setAdminInfo(prev => ({ ...prev, isLoading: true }));
      // Attempt to get admin data from backend
      // For now we'll use fallback data since we're connecting to mock API
      setTimeout(() => {
        setAdminInfo({
          name: "Admin Dashboard",
          role: "Administrator",
          isLoading: false
        });
      }, 1000);
    } catch (error) {
      console.error("Error fetching admin info:", error);
      setAdminInfo(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Load data based on active section
  useEffect(() => {
    fetchAdminInfo();
    if (activeSection === "dashboard") {
      fetchDashboardData();
    } else if (activeSection === "volunteers") {
      fetchVolunteers();
    }
  }, [activeSection]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Navigation items
  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", section: "dashboard" },
    { icon: <Users size={20} />, label: "Volunteers", section: "volunteers" },
    { icon: <Calendar size={20} />, label: "Events", section: "events" },
    { icon: <MessageSquare size={20} />, label: "Messages", section: "messages" },
    { icon: <BarChart3 size={20} />, label: "Reports", section: "reports" },
    { icon: <Settings size={20} />, label: "Settings", section: "settings" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVolunteer(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format relative time for activities
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Handle adding a new volunteer
  const handleAddVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const volunteer = {
        name: newVolunteer.name,
        email: newVolunteer.email,
        phone: newVolunteer.phone,
        address: newVolunteer.address,
        interests: newVolunteer.interests,
        events: [],
        joined: new Date().toISOString().split('T')[0],
        status: newVolunteer.status as 'active' | 'inactive'
      };
      
      // Call API to add volunteer
      await adminApi.addVolunteer(volunteer);
      
      // Refresh volunteer list
      fetchVolunteers();
      
      // Show success toast
      toast({
        title: "Success",
        description: "Volunteer added successfully",
        variant: "default"
      });
      
      // Reset form and close modal
      setNewVolunteer({
        name: '',
        email: '',
        phone: '',
        address: '',
        interests: '',
        status: 'active'
      });
      setIsAddVolunteerModalOpen(false);
    } catch (error) {
      console.error("Error adding volunteer:", error);
      toast({
        title: "Error",
        description: "Failed to add volunteer",
        variant: "destructive"
      });
    }
  };

  // Available events for selection
  const availableEvents = [
    "Food Drive",
    "Beach Cleanup",
    "Education Workshop",
    "Fundraising Gala",
    "Community Health Camp",
    "Tree Planting",
    "Children's Art Program",
    "Senior Citizens Outreach"
  ];

  const openEditEventsModal = (volunteer: any) => {
    setCurrentVolunteer(volunteer);
    setSelectedEvents([...volunteer.events]);
    setIsEditEventsModalOpen(true);
  };

  const handleEventSelectionChange = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter(e => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  // Handle saving volunteer events
  const saveVolunteerEvents = async () => {
    if (!currentVolunteer) return;
    
    try {
      // Call API to update volunteer events
      await adminApi.updateVolunteerEvents(currentVolunteer.id, selectedEvents);
      
      // Update local state to reflect changes
      setVolunteers(volunteers.map(v => 
        v.id === currentVolunteer.id 
          ? { ...v, events: selectedEvents } 
          : v
      ));
      
      // Show success toast
      toast({
        title: "Success",
        description: "Volunteer events updated successfully",
        variant: "default"
      });
      
      // Close modal
      setIsEditEventsModalOpen(false);
    } catch (error) {
      console.error("Error updating volunteer events:", error);
      toast({
        title: "Error",
        description: "Failed to update volunteer events",
        variant: "destructive"
      });
    }
  };

  // Render Dashboard section
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg relative overflow-hidden">
          {isLoading.stats && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          )}
          <h3 className="font-semibold">Total Volunteers</h3>
          <p className="text-2xl font-bold">{stats.volunteerCount}</p>
        </div>
        
        <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg relative overflow-hidden">
          {isLoading.stats && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          )}
          <h3 className="font-semibold">Total Events</h3>
          <p className="text-2xl font-bold">{stats.eventCount}</p>
        </div>
        
        <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg relative overflow-hidden">
          {isLoading.stats && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          )}
          <h3 className="font-semibold">Active Events</h3>
          <p className="text-2xl font-bold">{stats.activeEventCount}</p>
        </div>
        
        <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg relative overflow-hidden">
          {isLoading.stats && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
              <Loader2 className="h-6 w-6 animate-spin text-yellow-600" />
            </div>
          )}
          <h3 className="font-semibold">Tasks Completed</h3>
          <p className="text-2xl font-bold">{stats.completedTaskCount}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
          {isLoading.activities && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id}>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activities</p>
            )}
          </div>
        </div>
        
        {/* Event Progress */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
          {isLoading.eventProgress && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          <h3 className="text-lg font-semibold mb-4">Event Progress</h3>
          <div className="space-y-4">
            {eventProgress.length > 0 ? (
              eventProgress.map((event) => (
                <div key={event.eventId}>
                  <div className="flex justify-between mb-1">
                    <p className="font-medium">{event.title}</p>
                    <span className={`text-sm text-${event.color}-600`}>{event.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-${event.color}-500 h-2 rounded-full`} 
                      style={{ width: `${event.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No events in progress</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => {
                if (isLoading.addVolunteer) return;
                setIsLoading(prev => ({ ...prev, addVolunteer: true }));
                setTimeout(() => {
                  setIsAddVolunteerModalOpen(true);
                  setIsLoading(prev => ({ ...prev, addVolunteer: false }));
                  toast({
                    title: "Add Volunteer",
                    description: "Opening volunteer registration form"
                  });
                }, 300);
              }}
              disabled={isLoading.addVolunteer}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-4 rounded-xl transition-all duration-200 hover:shadow-md group h-24 relative overflow-hidden"
            >
              {isLoading.addVolunteer ? (
                <Loader2 size={24} className="text-blue-600 dark:text-blue-400 animate-spin absolute" />
              ) : (
                <>
                  <div className="bg-blue-100 dark:bg-blue-800/40 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <UserPlus size={20} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-center sm:text-left">Add Volunteer</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => {
                if (isLoading.createEvent) return;
                setIsLoading(prev => ({ ...prev, createEvent: true }));
                setTimeout(() => {
                  setIsCreateEventModalOpen(true);
                  setIsLoading(prev => ({ ...prev, createEvent: false }));
                  toast({
                    title: "Create Event",
                    description: "Opening event creation form"
                  });
                }, 300);
              }}
              disabled={isLoading.createEvent}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl transition-all duration-200 hover:shadow-md group h-24 relative overflow-hidden"
            >
              {isLoading.createEvent ? (
                <Loader2 size={24} className="text-green-600 dark:text-green-400 animate-spin absolute" />
              ) : (
                <>
                  <div className="bg-green-100 dark:bg-green-800/40 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <Calendar size={20} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium text-center sm:text-left">Create Event</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => {
                if (isLoading.generateReport) return;
                setIsLoading(prev => ({ ...prev, generateReport: true }));
                setTimeout(() => {
                  setActiveSection("reports");
                  setIsLoading(prev => ({ ...prev, generateReport: false }));
                  toast({
                    title: "Generate Report",
                    description: "Navigating to reports section"
                  });
                }, 300);
              }}
              disabled={isLoading.generateReport}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-4 rounded-xl transition-all duration-200 hover:shadow-md group h-24 relative overflow-hidden"
            >
              {isLoading.generateReport ? (
                <Loader2 size={24} className="text-purple-600 dark:text-purple-400 animate-spin absolute" />
              ) : (
                <>
                  <div className="bg-purple-100 dark:bg-purple-800/40 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <FileText size={20} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-center sm:text-left">Generate Report</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => {
                if (isLoading.sendNotification) return;
                setIsLoading(prev => ({ ...prev, sendNotification: true }));
                setTimeout(() => {
                  setActiveSection("messages");
                  setIsLoading(prev => ({ ...prev, sendNotification: false }));
                  toast({
                    title: "Send Notification",
                    description: "Navigating to messaging section"
                  });
                }, 300);
              }}
              disabled={isLoading.sendNotification}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-4 rounded-xl transition-all duration-200 hover:shadow-md group h-24 relative overflow-hidden"
            >
              {isLoading.sendNotification ? (
                <Loader2 size={24} className="text-orange-600 dark:text-orange-400 animate-spin absolute" />
              ) : (
                <>
                  <div className="bg-orange-100 dark:bg-orange-800/40 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <MessageSquare size={20} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="font-medium text-center sm:text-left">Send Notification</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Volunteer Overview */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
          {isLoading.volunteerOverview && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          <h3 className="text-lg font-semibold mb-4">Volunteer Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div>
                <p className="font-medium">Active Volunteers</p>
                <p className="text-sm text-gray-500">Currently participating</p>
              </div>
              <p className="text-xl font-bold text-green-600">{volunteerOverview.activeVolunteers}</p>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div>
                <p className="font-medium">New Volunteers</p>
                <p className="text-sm text-gray-500">Joined this month</p>
              </div>
              <p className="text-xl font-bold text-blue-600">{volunteerOverview.newVolunteers}</p>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div>
                <p className="font-medium">Pending Approvals</p>
                <p className="text-sm text-gray-500">Waiting for review</p>
              </div>
              <p className="text-xl font-bold text-orange-600">{volunteerOverview.pendingApprovals}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ongoing Events */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Ongoing Events</h3>
          <button 
            onClick={() => setActiveSection("events")}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/3">
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full h-40 sm:h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/300x300?text=Event";
                  }}
                />
              </div>
              <div className="w-full sm:w-2/3 p-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm line-clamp-1">{event.title}</h3>
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{event.date}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-1">{event.location}</p>
                <div className="flex justify-end">
                  <button 
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="px-2 py-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Volunteers section
  const renderVolunteers = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Volunteer Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
          <button 
            onClick={() => {
              // Export volunteer data as CSV
              const headers = "Name,Email,Phone,Status,Joined\n";
              const csvContent = volunteers.reduce((acc, vol) => {
                return acc + `${vol.name},"${vol.email}","${vol.phone}",${vol.status},${vol.joined}\n`;
              }, headers);
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', 'volunteers.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              toast({
                title: "Export Complete",
                description: "Volunteers data downloaded as CSV"
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg"
          >
            <FileText size={16} />
            <span>Export</span>
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={() => setIsAddVolunteerModalOpen(true)}
          >
            <UserPlus size={16} />
            <span>Add Volunteer</span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search volunteers..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="px-4 py-2 border rounded-lg w-full sm:w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden">
        {isLoading.volunteers && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-red-600 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Loading volunteers...</p>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          {filteredVolunteers.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredVolunteers.map(volunteer => (
                  <tr key={volunteer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{volunteer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{volunteer.email}</td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center">
                        <div className="max-w-[200px] overflow-hidden">
                          {volunteer.events.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {volunteer.events.map((event: string, index: number) => (
                                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full whitespace-nowrap">
                                  {event}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">No events assigned</span>
                          )}
                        </div>
                        <button 
                          className="ml-2 text-blue-600 hover:text-blue-800" 
                          onClick={() => openEditEventsModal(volunteer)}
                          title="Edit events"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        volunteer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {volunteer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        className="p-1 text-gray-600 mr-1" 
                        onClick={() => {
                          // Set the current volunteer data and open edit modal
                          setCurrentVolunteer(volunteer);
                          setNewVolunteer({
                            name: volunteer.name,
                            email: volunteer.email,
                            phone: volunteer.phone,
                            address: volunteer.address,
                            interests: volunteer.interests,
                            status: volunteer.status
                          });
                          setIsAddVolunteerModalOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="p-1 text-gray-600"
                        onClick={() => {
                          navigate(`/admin/volunteers/${volunteer.id}`);
                        }}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500">No volunteers found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile view for volunteers on small screens */}
      <div className="lg:hidden mt-4 space-y-4">
        {filteredVolunteers.map(volunteer => (
          <div key={volunteer.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{volunteer.name}</h3>
                <p className="text-sm text-gray-600">{volunteer.email}</p>
                <div className="mt-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    volunteer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {volunteer.status}
                  </span>
                </div>
              </div>
              <div className="flex">
                <button 
                  className="p-2 text-gray-600" 
                  onClick={() => openEditEventsModal(volunteer)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="p-2 text-gray-600"
                  onClick={() => {
                    navigate(`/admin/volunteers/${volunteer.id}`);
                  }}
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Assigned Events:</p>
              {volunteer.events.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {volunteer.events.map((event, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {event}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No events assigned</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Add/Edit Volunteer Modal */}
      {isAddVolunteerModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto mx-auto" style={{ maxWidth: "90vw" }}>
            <div className="flex justify-between items-center p-3 border-b sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-lg font-semibold">
                {currentVolunteer ? "Edit Volunteer" : "Add New Volunteer"}
              </h3>
              <button 
                onClick={() => {
                  setIsAddVolunteerModalOpen(false);
                  setCurrentVolunteer(null);
                  setNewVolunteer({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    interests: '',
                    status: 'active'
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddVolunteer} className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newVolunteer.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newVolunteer.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newVolunteer.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    name="status"
                    value={newVolunteer.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={newVolunteer.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter address"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Interests/Skills</label>
                  <textarea
                    name="interests"
                    value={newVolunteer.interests}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter volunteer's interests or skills"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddVolunteerModalOpen(false);
                    setCurrentVolunteer(null);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  {currentVolunteer ? "Update Volunteer" : "Add Volunteer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Render Events section
  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
          <button 
            onClick={() => {
              // Export events data as CSV
              const headers = "Title,Date,Location,Status\n";
              const csvContent = events.reduce((acc, event) => {
                // Determine event status based on date (since the events from data/events.ts doesn't have status)
                const eventDate = new Date(event.date.split('-')[0]);
                const status = eventDate < new Date() ? 'active' : 'upcoming';
                return acc + `"${event.title}","${event.date}","${event.location}","${status}"\n`;
              }, headers);
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', 'events.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              toast({
                title: "Export Complete",
                description: "Events data downloaded as CSV"
              });
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg"
          >
            <FileText size={16} />
            <span>Export</span>
          </button>
          <Link to="/events" className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
            <Eye size={16} />
            <span>Explore Events</span>
          </Link>
          <button 
            onClick={() => setIsCreateEventModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            <Calendar size={16} />
            <span>Create Event</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="relative">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-48 object-cover" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/300x300?text=Event";
                }}
              />
              <div className="absolute top-2 right-2">
                {/* Set status based on date */}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  new Date(event.date.split('-')[0]) < new Date() 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {new Date(event.date.split('-')[0]) < new Date() ? 'Active' : 'Upcoming'}
                </span>
              </div>
            </div>
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{event.date} • {event.location}</p>
              
              <div className="flex justify-between mt-auto pt-4">
                <button 
                  onClick={() => {
                    // Placeholder for edit action
                    toast({
                      title: "Edit Event",
                      description: `Opening edit form for event: ${event.title}`
                    });
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Edit
                </button>
                <button 
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="px-3 py-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Event Create Modal */}
      {isCreateEventModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-lg font-semibold">Create New Event</h3>
              <button 
                onClick={() => setIsCreateEventModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Placeholder for event creation
                toast({
                  title: "Success",
                  description: "New event created successfully"
                });
                setIsCreateEventModalOpen(false);
              }} 
              className="p-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Event Title</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter event description"
                    rows={3}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter event location"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6 gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateEventModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "volunteers":
        return renderVolunteers();
      case "events":
        return renderEvents();
      case "messages":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <p className="text-gray-500">Message system coming soon.</p>
          </div>
        );
      case "reports":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Reports</h2>
            <p className="text-gray-500">Reporting system coming soon.</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-gray-500">Settings panel coming soon.</p>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen relative ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header isAdmin={true} />
      
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 pt-16 bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="lg:hidden fixed bottom-6 right-6 z-50 bg-red-600 text-white p-3 rounded-full shadow-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Home size={24} />}
          </button>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-72 bg-gradient-to-b from-red-100 via-red-50 to-red-100 dark:from-gray-800 dark:via-gray-800/95 dark:to-gray-800 backdrop-blur-md fixed top-0 bottom-0 left-0 shadow-xl border-r border-red-200 dark:border-gray-700 z-20 overflow-y-auto">
            <div className="p-4 border-b border-red-200 dark:border-gray-700">
              <Link to="/" className="flex items-center justify-center mb-6" aria-label="Samarthanam NGO Home">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg overflow-hidden w-full max-w-[200px]">
                  <img 
                    src="/images/logo_for_site.jpg" 
                    alt="Samarthanam NGO" 
                    className="h-24 w-auto mx-auto rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://placehold.co/300x300?text=Logo";
                    }}
                  />
                </div>
              </Link>
              <h2 className="font-bold text-xl text-gray-800 dark:text-white pl-2">
                {adminInfo.isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin text-red-600" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <span>{adminInfo.name}</span>
                )}
              </h2>
            </div>
            <nav className="p-6 pb-24">
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.section}>
                    <button
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                        activeSection === item.section
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105'
                          : 'hover:bg-white dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:scale-105 hover:shadow-md'
                      }`}
                      onClick={() => setActiveSection(item.section)}
                    >
                      <span className={`mr-3 transition-transform duration-300 ${
                        activeSection === item.section 
                          ? 'scale-110' 
                          : 'group-hover:scale-110 group-hover:text-red-600 dark:group-hover:text-red-400'
                      }`}>
                        {item.icon}
                      </span>
                      <span className={`font-medium transition-colors duration-300 ${
                        activeSection !== item.section &&
                        'group-hover:text-red-600 dark:group-hover:text-red-400'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-red-200 dark:border-gray-700 bg-gradient-to-b from-red-100 to-red-50 dark:from-gray-800 dark:to-gray-800 backdrop-blur-md">
              <button 
                className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-white dark:text-red-400 dark:hover:bg-gray-700/60 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md group"
                onClick={() => {
                  navigate('/');
                  toast({
                    title: "Logged Out",
                    description: "You have been logged out successfully"
                  });
                }}
              >
                <LogOut size={20} className="mr-3 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">Logout</span>
              </button>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Mobile */}
          {isMobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg w-[90%] max-w-md p-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-xl">
                    {adminInfo.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin text-red-600" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      <span>{adminInfo.name}</span>
                    )}
                  </h2>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <nav>
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.section}>
                        <button
                          className={`w-full flex items-center px-4 py-3 rounded-lg ${
                            activeSection === item.section
                              ? 'bg-red-600 text-white'
                              : 'text-gray-700 dark:text-gray-200'
                          }`}
                          onClick={() => {
                            setActiveSection(item.section);
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <span className="mr-3">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      </li>
                    ))}
                    <li>
                      <button 
                        className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 rounded-lg"
                        onClick={() => {
                          navigate('/');
                          toast({
                            title: "Logged Out",
                            description: "You have been logged out successfully"
                          });
                        }}
                      >
                        <LogOut size={20} className="mr-3" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={toggleDarkMode}
                        className="w-full flex items-center px-4 py-3 rounded-lg"
                        aria-label="Toggle dark mode"
                      >
                        {isDarkMode ? (
                          <>
                            <Sun size={20} className="mr-3" />
                            <span className="font-medium">Light Mode</span>
                          </>
                        ) : (
                          <>
                            <Moon size={20} className="mr-3" />
                            <span className="font-medium">Dark Mode</span>
                          </>
                        )}
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className="lg:ml-72 p-4 md:p-8 relative z-10">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 md:p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Overview</h1>
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full mt-auto">
          <div className="lg:ml-72">
            <Footer />
          </div>
        </div>

        {/* Edit Events Modal */}
        {isEditEventsModalOpen && currentVolunteer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h3 className="text-lg font-semibold">Edit Events for {currentVolunteer.name}</h3>
                <button 
                  onClick={() => setIsEditEventsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-4">Select the events this volunteer is participating in:</p>
                
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                  {availableEvents.map((event, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`event-${index}`}
                        checked={selectedEvents.includes(event)}
                        onChange={() => handleEventSelectionChange(event)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor={`event-${index}`} className="text-sm">{event}</label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setIsEditEventsModalOpen(false)}
                    className="px-4 py-2 border rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveVolunteerEvents}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
                  >
                    Save Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 