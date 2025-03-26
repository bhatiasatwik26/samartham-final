import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Loader2,
  MapPin,
} from "lucide-react";
import { events } from "@/data/events"; // Import events from data file
import adminApi, {
  DashboardStats,
  RecentActivity,
  EventProgress,
  Volunteer,
  VolunteerOverview,
  ReportData,
  CategoryStats,
} from "@/services/adminApi";
import { useToast } from "@/components/ui/use-toast";
import ReportCharts from "@/components/ReportCharts";

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
  const [reports, setReports] = useState<ReportData[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [newVolunteer, setNewVolunteer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    interests: "",
    status: "active",
  });
  
  // State for managing selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
    sendNotification: false,
  });
  const [stats, setStats] = useState<DashboardStats>({
    volunteerCount: 0,
    eventCount: 0,
    activeEventCount: 0,
    completedTaskCount: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [eventProgress, setEventProgress] = useState<EventProgress[]>([]);
  const [volunteerOverview, setVolunteerOverview] = useState<VolunteerOverview>(
    {
      activeVolunteers: 0,
      newVolunteers: 0,
    }
  );
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Add admin info to state
  const [adminInfo, setAdminInfo] = useState({
    name: "Admin Dashboard",
    role: "Administrator",
    isLoading: true,
  });

  // Local events state with extended type that includes status
  const [localEvents, setLocalEvents] = useState(events);

  // Search and filter volunteers
  const filteredVolunteers = volunteers.filter((volunteer) => {
    const matchesSearch =
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" || volunteer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    // Fetch stats
    setIsLoading((prev) => ({ ...prev, stats: true }));
    try {
      const statsData = await adminApi.getDashboardStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, stats: false }));
    }

    // Fetch recent activities
    setIsLoading((prev) => ({ ...prev, activities: true }));
    try {
      const activitiesData = await adminApi.getRecentActivities();
      setActivities(activitiesData);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, activities: false }));
    }

    // Fetch event progress
    setIsLoading((prev) => ({ ...prev, eventProgress: true }));
    try {
      const progressData = await adminApi.getEventProgress();
      setEventProgress(progressData);
    } catch (error) {
      console.error("Error fetching event progress:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, eventProgress: false }));
    }

    // Fetch volunteer overview
    setIsLoading((prev) => ({ ...prev, volunteerOverview: true }));
    try {
      const overviewData = await adminApi.getVolunteerOverview();
      setVolunteerOverview(overviewData);
    } catch (error) {
      console.error("Error fetching volunteer overview:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, volunteerOverview: false }));
    }
    
    // Also fetch events when loading dashboard
    fetchEvents();
  };

  // Fetch volunteers
  const fetchVolunteers = async () => {
    setIsLoading((prev) => ({ ...prev, volunteers: true }));
    try {
      const volunteersData = await adminApi.getVolunteers();
      setVolunteers(volunteersData);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      toast({
        title: "Error",
        description: "Failed to load volunteers data",
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, volunteers: false }));
    }
  };
  
  const fetchEvents = async () => {
    setIsLoading((prev) => ({ ...prev, events: true }));
    try {
      const eventData = await adminApi.getEvents();
      console.log("Fetched events:", eventData);
      // Use type assertion to safely convert different event types
      setLocalEvents(eventData as any);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to load events data",
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, events: false }));
    }
  };

  const fetchEventStats = async () => {
    setIsLoading((prev) => ({ ...prev, generateReport: true }));
    try {
      // Fetch event statistics
      const stats = await adminApi.getAllStats();
      setReports(stats);
      
      // Also fetch category statistics
      const catStats = await adminApi.getCategoryStats();
      setCategoryStats(catStats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast({
        title: "Error",
        description: "Failed to load statistics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, generateReport: false }));
    }
  };

  // Add function to fetch admin info
  const fetchAdminInfo = async () => {
    try {
      setAdminInfo((prev) => ({ ...prev, isLoading: true }));

      setTimeout(() => {
        setAdminInfo({
          name: "Admin Dashboard",
          role: "Administrator",
          isLoading: false,
        });
      }, 1000);
    } catch (error) {
      console.error("Error fetching admin info:", error);
      setAdminInfo((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // Load data based on active section
  useEffect(() => {
    fetchAdminInfo();
    // Always fetch events initially
    fetchEvents();
    
    if (activeSection === "dashboard") {
      fetchDashboardData();
    } else if (activeSection === "volunteers") {
      fetchVolunteers();
    } else if (activeSection === "reports") {
      fetchEventStats();
    }
  }, [activeSection]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Switch to the reports section and load data if needed
  const handleReportsClick = () => {
    setActiveSection("reports");
    // Fetch event statistics if they haven't been loaded yet
    if (reports.length === 0) {
      fetchEventStats();
    }
    // Close mobile menu if it's open
    setIsMobileMenuOpen(false);
  };

  // Navigation items
  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", section: "dashboard", onClick: () => { setActiveSection("dashboard"); setIsMobileMenuOpen(false); } },
    { icon: <Users size={20} />, label: "Volunteers", section: "volunteers", onClick: () => { setActiveSection("volunteers"); setIsMobileMenuOpen(false); } },
    { icon: <Calendar size={20} />, label: "Events", section: "events", onClick: () => { setActiveSection("events"); setIsMobileMenuOpen(false); } },
    { icon: <BarChart3 size={20} />, label: "Reports", section: "reports", onClick: handleReportsClick },
    { icon: <Settings size={20} />, label: "Settings", section: "settings", onClick: () => { setActiveSection("settings"); setIsMobileMenuOpen(false); } },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewVolunteer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format relative time for activities
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
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
        interestedCategories: selectedCategories,
        status: newVolunteer.status as "active" | "inactive",
      };

      if (currentVolunteer) {
        // Update existing volunteer using MongoDB ObjectId
        const volunteerId = typeof currentVolunteer.id === 'object' 
          ? currentVolunteer.id.toString() 
          : currentVolunteer.id;
          
        await adminApi.updateVolunteer(volunteerId, {
          ...volunteer,
          events: currentVolunteer.events // Preserve existing events
        });
        
        toast({
          title: "Success",
          description: "Volunteer updated successfully",
          variant: "default",
        });
      } else {
        // Call API to add volunteer
        await adminApi.addVolunteer(volunteer);
        
        toast({
          title: "Success",
          description: "Volunteer added successfully",
          variant: "default",
        });
      }

      // Refresh volunteer list
      fetchVolunteers();

      // Reset form and close modal
      setNewVolunteer({
        name: "",
        email: "",
        phone: "",
        address: "",
        interests: "",
        status: "active",
      });
      setSelectedCategories([]);
      setIsAddVolunteerModalOpen(false);
      setCurrentVolunteer(null);
    } catch (error) {
      console.error("Error managing volunteer:", error);
      toast({
        title: "Error",
        description: currentVolunteer ? "Failed to update volunteer" : "Failed to add volunteer",
        variant: "destructive",
      });
    }
  };

  // Available events for selection
  const availableEvents = [
    "Education",
    "Healthcare",
    "Environment", 
    "Sports",
    "Arts & Culture",
    "Community Service"
  ];

  const openEditEventsModal = (volunteer: any) => {
    setCurrentVolunteer(volunteer);
    setSelectedEvents([...volunteer.events]);
    setIsEditEventsModalOpen(true);
  };

  const handleEventSelectionChange = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  const saveVolunteerEvents = async () => {
    if (!currentVolunteer) return;

    try {
      // Call API to update volunteer events
      await adminApi.updateVolunteerEvents(currentVolunteer.id, selectedEvents);

      // Update local state to reflect changes
      setVolunteers(
        volunteers.map((v) =>
          v.id === currentVolunteer.id ? { ...v, events: selectedEvents } : v
        )
      );

      // Show success toast
      toast({
        title: "Success",
        description: "Volunteer events updated successfully",
        variant: "default",
      });

      // Close modal
      setIsEditEventsModalOpen(false);
    } catch (error) {
      console.error("Error updating volunteer events:", error);
      toast({
        title: "Error",
        description: "Failed to update volunteer events",
        variant: "destructive",
      });
    }
  };

  // Modify exportEventData to build CSV properly
  const exportEventsData = () => {
    const headers = "Title,Date,Location,Status\n";
    const csvContent = localEvents.reduce((acc: string, event) => {
      const status = (event as any).status || "active";
      return (
        acc +
        `"${event.title}","${event.date}","${event.location}","${status}"\n`
      );
    }, headers);

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "events.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Complete",
      description: "Events data downloaded as CSV",
    });
  };

  // Handler for category checkbox changes
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const renderReports = () => {
    if (isLoading.generateReport) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-8">Reports and Analytics</h1>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-500">Loading report data...</p>
          </div>
        </div>
      );
    }
    return <ReportCharts reports={reports} categoryStats={categoryStats} />;
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
                  <p className="text-sm text-gray-500">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
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
              eventProgress.slice(0, 5).map(
                (
                  event , i// Show only first 3 events
                ) => (
                  <div key={event.eventId}>
                    <div className="flex justify-between mb-1">
                      <p className="font-medium">{event.title}</p>
                      <span className={`text-sm font-medium text-red-500`}>

                        {i%3===0 ?(i+3)*2:(i+7)*3}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-red-400`}
                        style={{
                          width: `${i%3===0 ?(i+3)*2:(i+7)*3}%`,
                          // backgroundColor: `var(--tw-${event.color}-500)`,
                        }}
                      ></div>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-sm text-gray-500">No events in progress</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* <button
              onClick={() => setActiveSection("volunteers")}
              disabled={isLoading.addVolunteer}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-4 rounded-xl transition-all duration-200 hover:shadow-md group h-24 relative overflow-hidden"
            >
              {isLoading.addVolunteer ? (
                <Loader2
                  size={24}
                  className="text-blue-600 dark:text-blue-400 animate-spin absolute"
                />
              ) : (
                <>
                  <div className="bg-blue-100 dark:bg-blue-800/40 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <UserPlus
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <span className="font-medium text-center sm:text-left">
                    Add Volunteer
                  </span>
                </>
              )}
            </button> */}

            <button
              onClick={() => {
                if (isLoading.createEvent) return;
                setIsLoading((prev) => ({ ...prev, createEvent: true }));
                setIsCreateEventModalOpen(true);
                setIsLoading((prev) => ({ ...prev, createEvent: false }));
                toast({
                  title: "Create Event",
                  description: "Opening event creation form",
                });
              }}
              disabled={isLoading.createEvent}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl transition-all duration-200 hover:shadow-md group h-24 relative overflow-hidden"
            >
              {isLoading.createEvent ? (
                <Loader2
                  size={24}
                  className="text-green-600 dark:text-green-400 animate-spin absolute"
                />
              ) : (
                <>
                  <div className="bg-green-100 dark:bg-green-800/40 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <Calendar
                      size={20}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <span className="font-medium text-center sm:text-left">
                    Create Event
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (isLoading.generateReport) return;
                setIsLoading((prev) => ({ ...prev, generateReport: true }));
                setTimeout(() => {
                  setActiveSection("reports");
                  setIsLoading((prev) => ({ ...prev, generateReport: false }));
                  toast({
                    title: "Generate Report",
                    description: "Navigating to reports section",
                  });
                }, 300);
              }}
              disabled={isLoading.generateReport}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-4 rounded-xl transition-all duration-200 hover:shadow-md group h-24 relative overflow-hidden"
            >
              {isLoading.generateReport ? (
                <Loader2
                  size={24}
                  className="text-purple-600 dark:text-purple-400 animate-spin absolute"
                />
              ) : (
                <>
                  <div className="bg-purple-100 dark:bg-purple-800/40 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <FileText
                      size={20}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <span className="font-medium text-center sm:text-left">
                    Generate Report
                  </span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (isLoading.sendNotification) return;
                setIsLoading((prev) => ({ ...prev, sendNotification: true }));
                setTimeout(() => {
                  setActiveSection("messages");
                  setIsLoading((prev) => ({
                    ...prev,
                    sendNotification: false,
                  }));
                  toast({
                    title: "Send Notification",
                    description: "Navigating to messaging section",
                  });
                }, 300);
              }}
              disabled={isLoading.sendNotification}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-4 rounded-xl transition-all duration-200 hover:shadow-md group h-24 relative overflow-hidden"
            >
              {isLoading.sendNotification ? (
                <Loader2
                  size={24}
                  className="text-orange-600 dark:text-orange-400 animate-spin absolute"
                />
              ) : (
                <>
                  <div className="bg-orange-100 dark:bg-orange-800/40 p-3 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <MessageSquare
                      size={20}
                      className="text-orange-600 dark:text-orange-400"
                    />
                  </div>
                  <span className="font-medium text-center sm:text-left">
                    Send Notification
                  </span>
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
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div>
                <p className="font-medium">Active Volunteers</p>
                <p className="text-sm text-gray-500">Currently participating</p>
              </div>
              <p className="text-xl font-bold text-green-600">
                {volunteerOverview.activeVolunteers}
              </p>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div>
                <p className="font-medium">New Volunteers</p>
                <p className="text-sm text-gray-500">Joined this month</p>
              </div>
              <p className="text-xl font-bold text-blue-600">
                {volunteerOverview.newVolunteers}
              </p>
            </div>
            {/* <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
              <div>
                <p className="font-medium">Pending Approvals</p>
                <p className="text-sm text-gray-500">Waiting for review</p>
              </div>
              <p className="text-xl font-bold text-orange-600">
                {volunteerOverview.pendingApprovals}
              </p>
            </div> */}
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
          {localEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col sm:flex-row"
            >
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
                  <h3 className="font-medium text-sm line-clamp-1">
                    {event.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                    {(event as any).status || "Active"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{event.date}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                  {event.location}
                </p>
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
              const headers = "Name,Email,Phone,Status\n";
              const csvContent = volunteers.reduce((acc, vol) => {
                return (
                  acc +
                  `${vol.name},"${vol.email}","${vol.phone}",${vol.status}\n`
                );
              }, headers);

              const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;",
              });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", "volunteers.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              toast({
                title: "Export Complete",
                description: "Volunteers data downloaded as CSV",
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
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
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
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Loading volunteers...
              </p>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {filteredVolunteers.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Events
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredVolunteers.map((volunteer) => (
                  <tr key={volunteer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {volunteer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {volunteer.email}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center">
                        <div className="max-w-[200px] overflow-hidden">
                          {volunteer.events.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {volunteer.events.map(
                                (event: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full whitespace-nowrap"
                                  >
                                    {event}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              No events assigned
                            </span>
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
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          volunteer.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
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
                            status: volunteer.status,
                          });
                          // Set selected categories from volunteer data if available
                          setSelectedCategories(volunteer.interestedCategories || []);
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
              <p className="text-gray-500">
                No volunteers found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile view for volunteers on small screens */}
      <div className="lg:hidden mt-4 space-y-4">
        {filteredVolunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{volunteer.name}</h3>
                <p className="text-sm text-gray-600">{volunteer.email}</p>
                <div className="mt-2">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      volunteer.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
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
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
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
          <div
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto mx-auto"
            style={{ maxWidth: "90vw" }}
          >
            <div className="flex justify-between items-center p-3 border-b sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="text-lg font-semibold">
                {currentVolunteer ? "Edit Volunteer" : "Add New Volunteer"}
              </h3>
              <button
                onClick={() => {
                  setIsAddVolunteerModalOpen(false);
                  setCurrentVolunteer(null);
                  setNewVolunteer({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    interests: "",
                    status: "active",
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
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Phone
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Interests/Skills
                  </label>
                  <textarea
                    name="interests"
                    value={newVolunteer.interests}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter volunteer's interests or skills"
                    rows={2}
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Interested Categories
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700">
                    {["Education", "Healthcare", "Environment", "Sports", "Arts & Culture", "Community Service"].map((category) => (
                      <div key={category} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`category-${category}`}
                          className="mr-2 h-4 w-4"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(category)}
                        />
                        <label htmlFor={`category-${category}`} className="text-sm">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Volunteers will be notified of new events in these categories
                  </p>
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
            onClick={exportEventsData}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border rounded-lg"
          >
            <FileText size={16} />
            <span>Export</span>
          </button>
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
        {localEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
          >
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
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    (event as any).status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {(event as any).status || "Active"}
                </span>
              </div>
            </div>
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Calendar size={14} />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <MapPin size={14} />
                <span>{event.location}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                {event.description}
              </p>

              <div className="mt-auto space-y-2">
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this event?"
                      )
                    ) {
                      try {
                        // Call the backend API to delete the event
                        const response = await fetch(`http://localhost:3000/api/event/delete/${event.id}`, {
                          method: 'DELETE',
                        });
                        
                        if (!response.ok) {
                          throw new Error(`Failed to delete event: ${response.status}`);
                        }
                        
                        // Update local state to reflect the change
                        setLocalEvents((prevEvents) =>
                          prevEvents.filter((e) => e.id !== event.id)
                        );
                        
                        toast({
                          title: "Success",
                          description: "Event deleted successfully",
                        });
                      } catch (error) {
                        console.error("Error deleting event:", error);
                        toast({
                          title: "Error",
                          description: error instanceof Error ? error.message : "Failed to delete event",
                          variant: "destructive"
                        });
                      }
                    }
                  }}
                  className="w-full px-4 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
                >
                  Delete Event
                </button>
                <button
                  onClick={() => navigate(`/manage-event/${event.id}`)}
                  className="w-full px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors duration-200"
                >
                  Manage Event
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
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
      case "reports":
        return renderReports();
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

  // Event Create Modal Component
  const EventCreateModal = () => {
    if (!isCreateEventModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setIsLoading(prev => ({...prev, createEvent: true}));
                const formData = new FormData(e.currentTarget);
                
                // Prepare the data for the backend API
                const eventData = {
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  date: formData.get("date") as string,
                  time: formData.get("time") as string,
                  location: formData.get("location") as string,
                  imageUrl: formData.get("imageUrl") as string || "",
                  category: formData.get("category") as string,
                  registrationStart: formData.get("registrationStart") as string,
                  registrationEnd: formData.get("registrationEnd") as string,
                  eventStart: formData.get("eventStart") as string,
                  eventEnd: formData.get("eventEnd") as string,
                  // Add required fields for backend
                  photos: formData.get("imageUrl") ? [(formData.get("imageUrl") as string)] : [],
                  geographicalLocation: {
                    type: "Point",
                    coordinates: [0, 0], // Default coordinates, should be replaced with actual location data
                  }
                };

                console.log("Event Data to be sent:", eventData);

                // Call the backend API
                const response = await fetch('http://localhost:3000/api/event/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(eventData),
                });

                if (!response.ok) {
                  throw new Error(`Failed to create event: ${response.status} ${response.statusText}`);
                }

                const result = await response.json();

                // Handle success
                toast({
                  title: "Success",
                  description: `Event created successfully! ${result.notificationsSent > 0 ? `${result.notificationsSent} interested volunteers notified.` : ''}`,
                });

                // Close the modal
                setIsCreateEventModalOpen(false);
                
                // Refresh events list
                fetchEvents();
              } catch (error) {
                console.error("Error in event creation:", error);
                toast({
                  title: "Error",
                  description:
                    error instanceof Error
                      ? error.message
                      : "Failed to create event. Please try again.",
                  variant: "destructive",
                });
              } finally {
                setIsLoading(prev => ({...prev, createEvent: false}));
              }
            }}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter event name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                  <option value="Sports">Sports</option>
                  <option value="Arts & Culture">Arts & Culture</option>
                  <option value="Community Service">Community Service</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter event description"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Time *</label>
                <input
                  type="time"
                  name="time"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter event location"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter image URL"
                />
              </div>

              <div className="md:col-span-2">
                <h4 className="font-medium mb-3">Event Timestamps</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Registration Start *
                    </label>
                    <input
                      type="datetime-local"
                      name="registrationStart"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Registration End *
                    </label>
                    <input
                      type="datetime-local"
                      name="registrationEnd"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Event Start *
                    </label>
                    <input
                      type="datetime-local"
                      name="eventStart"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Event End *
                    </label>
                    <input
                      type="datetime-local"
                      name="eventEnd"
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsCreateEventModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen relative ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Header isAdmin={true} />

      <div className="flex flex-col min-h-screen">
        <div className="flex-1 pt-16 bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: "60px 60px",
              }}
            ></div>
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
              <Link
                to="/"
                className="flex items-center justify-center mb-6"
                aria-label="Samarthanam NGO Home"
              >
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
                          ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                          : "hover:bg-white dark:hover:bg-gray-700/60 text-gray-700 dark:text-gray-200 hover:scale-105 hover:shadow-md"
                      }`}
                      onClick={item.onClick}
                    >
                      <span
                        className={`mr-3 transition-transform duration-300 ${
                          activeSection === item.section
                            ? "scale-110"
                            : "group-hover:scale-110 group-hover:text-red-600 dark:group-hover:text-red-400"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`font-medium transition-colors duration-300 ${
                          activeSection !== item.section &&
                          "group-hover:text-red-600 dark:group-hover:text-red-400"
                        }`}
                      >
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
                  navigate("/");
                  toast({
                    title: "Logged Out",
                    description: "You have been logged out successfully",
                  });
                }}
              >
                <LogOut
                  size={20}
                  className="mr-3 transition-transform duration-300 group-hover:scale-110"
                />
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
                        <Loader2
                          size={18}
                          className="animate-spin text-red-600"
                        />
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
                              ? "bg-red-600 text-white"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                          onClick={item.onClick}
                        >
                          <span className="mr-3">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        className="w-full flex items-center px-4 py-3 rounded-lg"
                        onClick={() => {
                          navigate("/");
                          toast({
                            title: "Logged Out",
                            description:
                              "You have been logged out successfully",
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
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Dashboard Overview
              </h1>
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
                <h3 className="text-lg font-semibold">
                  Edit Events for {currentVolunteer.name}
                </h3>
                <button
                  onClick={() => setIsEditEventsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-500 mb-4">
                  Select the events this volunteer is participating in:
                </p>

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
                      <label htmlFor={`event-${index}`} className="text-sm">
                        {event}
                      </label>
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

        {/* Event Create Modal */}
        <EventCreateModal />
      </div>
    </div>
  );
};

export default AdminDashboard;
