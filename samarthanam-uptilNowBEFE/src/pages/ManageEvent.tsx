import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, User, Plus, Loader2, Mail, Award, CheckSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
  interestedCategories?: string[];
  assignedTasks?: Task[];
}

interface Task {
  name: string;
  deadline: string;
  status: 'pending' | 'completed';
  volunteerId?: string;
  volunteerName?: string;
}

const ManageEvent = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [suggestedVolunteers, setSuggestedVolunteers] = useState<Volunteer[]>([]);
  const [registeredVolunteers, setRegisteredVolunteers] = useState<Volunteer[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    name: '',
    deadline: '',
    status: 'pending',
    volunteerId: ''
  });
  const [loading, setLoading] = useState({
    event: true,
    volunteers: true,
    tasks: true,
    taskAssignment: false
  });

  useEffect(() => {
    fetchEventDetails();
    fetchVolunteers();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(prev => ({ ...prev, event: true }));
      
      // Call the backend API to get event details
      const response = await axios.get(`${API_BASE_URL}/event/${eventId}`);
      
      if (!response.data) {
        throw new Error('Failed to fetch event details');
      }
      
      const eventData = response.data;
      setEvent({
        id: eventData._id,
        name: eventData.name,
        date: new Date(eventData.date).toLocaleDateString(),
        time: new Date(eventData.date).toLocaleTimeString(),
        location: eventData.location,
        description: eventData.description,
        category: eventData.category
      });
      
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error('Failed to fetch event details');
      
      // Fallback to mock data for development
      setEvent({
        id: eventId,
        name: "Sample Event",
        date: "2024-03-20",
        time: "10:00 AM",
        location: "Bangalore",
        description: "Sample event description"
      });
    } finally {
      setLoading(prev => ({ ...prev, event: false }));
    }
  };

  const fetchVolunteers = async () => {
    try {
      setLoading(prev => ({ ...prev, volunteers: true, tasks: true }));
      
      // Fetch all volunteers
      const allVolunteersResponse = await axios.get(`${API_BASE_URL}/user/volunteers`);
      
      if (!allVolunteersResponse.data) {
        throw new Error('Failed to fetch volunteers');
      }
      
      // Get event category to find interested volunteers
      const eventResponse = await axios.get(`${API_BASE_URL}/event/${eventId}`);
      const eventCategory = eventResponse.data.category;
      
      // Process volunteers
      const allVolunteers = allVolunteersResponse.data;
      const registered: Volunteer[] = [];
      const suggested: Volunteer[] = [];
      const tasks: Task[] = [];
      
      allVolunteers.forEach((volunteer: any) => {
        // Check if volunteer is registered for this event
        const eventSubscription = volunteer.eventsSubscribed && 
          volunteer.eventsSubscribed.find((event: any) => 
            event.eventId && event.eventId.toString() === eventId
          );
        
        // Convert volunteer to our format
        const formattedVolunteer: Volunteer = {
          id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email,
          skills: volunteer.skills || [],
          interestedCategories: volunteer.interestedCategories || []
        };
        
        if (eventSubscription) {
          // Add assigned tasks if any
          if (eventSubscription.assignedTasks && eventSubscription.assignedTasks.length > 0) {
            formattedVolunteer.assignedTasks = eventSubscription.assignedTasks.map((task: any) => ({
              name: task.name,
              deadline: task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline',
              status: task.status
            }));
            
            // Also add to the tasks list
            eventSubscription.assignedTasks.forEach((task: any) => {
              tasks.push({
                name: task.name,
                deadline: task.deadline ? new Date(task.deadline).toLocaleString() : 'No deadline',
                status: task.status,
                volunteerId: volunteer._id,
                volunteerName: volunteer.name
              });
            });
          }
          
          registered.push(formattedVolunteer);
        } 
        // If not registered, but interested in this category, add to suggested
        else if (
          formattedVolunteer.interestedCategories && 
          formattedVolunteer.interestedCategories.includes(eventCategory)
        ) {
          suggested.push(formattedVolunteer);
        }
      });
      
      setRegisteredVolunteers(registered);
      setSuggestedVolunteers(suggested);
      setAssignedTasks(tasks);
      
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      toast.error('Failed to fetch volunteers');
      
      // Set empty arrays as fallback
      setRegisteredVolunteers([]);
      setSuggestedVolunteers([]);
      setAssignedTasks([]);
    } finally {
      setLoading(prev => ({ ...prev, volunteers: false, tasks: false }));
    }
  };

  const handleTaskAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.name || !newTask.deadline || !newTask.volunteerId) {
      toast.error('Please fill in all task details');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, taskAssignment: true }));
      
      // Format the deadline to ISO format
      const deadlineDate = new Date(newTask.deadline).toISOString();
      
      // Call the backend API to assign task
      const response = await axios.post(`${API_BASE_URL}/user/assign-task`, {
        userId: newTask.volunteerId,
        eventId: eventId,
        taskName: newTask.name,
        status: "pending",
        deadline: deadlineDate
      });

      if (!response.data) {
        throw new Error('Failed to assign task');
      }

      toast.success('Task assigned successfully');
      setNewTask({ name: '', deadline: '', status: 'pending', volunteerId: '' });
      setIsAddingTask(false);
      
      // Refresh volunteer lists
      fetchVolunteers();
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error('Failed to assign task');
    } finally {
      setLoading(prev => ({ ...prev, taskAssignment: false }));
    }
  };

  const handleRegisterVolunteer = async (volunteerId: string) => {
    try {
      setLoading(prev => ({ ...prev, volunteers: true }));
      
      const response = await axios.post(`${API_BASE_URL}/user/register-for-event`, {
        userId: volunteerId,
        eventId: eventId
      });
      
      if (!response.data) {
        throw new Error('Failed to register volunteer');
      }
      
      toast.success('Volunteer registered for event successfully');
      
      // Refresh volunteers list
      fetchVolunteers();
    } catch (error) {
      console.error("Error registering volunteer:", error);
      toast.error('Failed to register volunteer for event');
    } finally {
      setLoading(prev => ({ ...prev, volunteers: false }));
    }
  };

  const VolunteerCard = ({ volunteer, isPotential = false }: { volunteer: Volunteer, isPotential?: boolean }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {volunteer.name}
            </h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
              <Mail className="h-4 w-4 mr-2" />
              <span className="text-sm">{volunteer.email}</span>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
            <User className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center mb-2">
            <Award className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {volunteer.skills && volunteer.skills.length > 0 ? (
              volunteer.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">No skills listed</span>
            )}
          </div>
        </div>
        
        {volunteer.interestedCategories && volunteer.interestedCategories.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <Award className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Interested Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {volunteer.interestedCategories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {!isPotential && volunteer.assignedTasks && volunteer.assignedTasks.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <CheckSquare className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Tasks</span>
            </div>
            <div className="space-y-2">
              {volunteer.assignedTasks.map((task, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-lg text-sm ${
                    task.status === 'completed' 
                      ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                  }`}
                >
                  <div className="font-medium">{task.name}</div>
                  <div className="text-xs mt-1">
                    Deadline: {task.deadline}
                  </div>
                  <div className="text-xs mt-1">
                    Status: {task.status === 'completed' ? 'Completed' : 'Pending'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isPotential && (
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => handleRegisterVolunteer(volunteer.id)}
              disabled={loading.volunteers}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded-lg"
            >
              {loading.volunteers ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Notify about Event'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading.event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <div className="container mx-auto px-4 pt-32">
        {/* Event Header Card */}
        <Card className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-red-100 dark:border-red-900/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              {event?.name}
            </CardTitle>
            <div className="flex flex-wrap gap-6 mt-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span>{event?.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span>{event?.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                  <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <span>{event?.location}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Task Overview */}
        <Card className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-red-100 dark:border-red-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                <CheckSquare className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              Task Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading.tasks ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
              </div>
            ) : (
              <div>
                {assignedTasks.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {assignedTasks.map((task, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg ${
                            task.status === 'completed' 
                              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 dark:text-white">{task.name}</h3>
                            {task.status === 'completed' ? (
                              <CheckSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Assigned to: {task.volunteerName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Deadline: {task.deadline}
                          </p>
                          <div className="mt-2">
                            <span 
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                task.status === 'completed' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              }`}
                            >
                              {task.status === 'completed' ? 'Completed' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No tasks assigned yet</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Assignment Section */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-red-100 dark:border-red-900/20 mb-10">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="text-xl">Task Assignment</span>
              <Button 
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAddingTask && (
              <form onSubmit={handleTaskAssignment} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="taskName" className="text-gray-700 dark:text-gray-300">Task Name</Label>
                    <Input
                      id="taskName"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      placeholder="Enter task name"
                      disabled={loading.taskAssignment}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline" className="text-gray-700 dark:text-gray-300">Deadline</Label>
                    <Input
                      id="deadline"
                      type="datetime-local"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      disabled={loading.taskAssignment}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="volunteer" className="text-gray-700 dark:text-gray-300">Select Volunteer</Label>
                  <select
                    id="volunteer"
                    className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    value={newTask.volunteerId}
                    onChange={(e) => setNewTask({ ...newTask, volunteerId: e.target.value })}
                    disabled={loading.taskAssignment}
                  >
                    <option value="">Select a volunteer</option>
                    {registeredVolunteers.map((volunteer) => (
                      <option key={volunteer.id} value={volunteer.id}>
                        {volunteer.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsAddingTask(false)}
                    disabled={loading.taskAssignment}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    disabled={loading.taskAssignment}
                  >
                    {loading.taskAssignment ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Assigning Task...
                      </>
                    ) : (
                      'Assign Task'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Volunteers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Potential Volunteers */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-red-100 dark:border-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                  <User className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                Potential Volunteers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.volunteers ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestedVolunteers.map((volunteer) => (
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} isPotential />
                  ))}
                  {suggestedVolunteers.length === 0 && (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No potential volunteers found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registered Volunteers */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-red-100 dark:border-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                  <User className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                Registered Volunteers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.volunteers ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {registeredVolunteers.map((volunteer) => (
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
                  ))}
                  {registeredVolunteers.length === 0 && (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No registered volunteers yet</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageEvent; 