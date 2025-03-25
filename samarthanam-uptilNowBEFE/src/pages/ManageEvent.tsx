import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, User, Plus, Loader2, Mail, Award } from 'lucide-react';
import { toast } from 'sonner';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Volunteer {
  id: string;
  name: string;
  email: string;
  skills: string[];
}

interface Task {
  name: string;
  deadline: string;
  volunteerId: string;
}

const ManageEvent = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [suggestedVolunteers, setSuggestedVolunteers] = useState<Volunteer[]>([]);
  const [registeredVolunteers, setRegisteredVolunteers] = useState<Volunteer[]>([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Task>({
    name: '',
    deadline: '',
    volunteerId: ''
  });
  const [loading, setLoading] = useState({
    event: true,
    volunteers: true,
    taskAssignment: false
  });

  useEffect(() => {
    fetchEventDetails();
    fetchVolunteers();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(prev => ({ ...prev, event: true }));
      // This will be replaced with actual API call
      const mockEvent = {
        id: eventId,
        name: "Sample Event",
        date: "2024-03-20",
        time: "10:00 AM",
        location: "Bangalore",
        description: "Sample event description"
      };
      setEvent(mockEvent);
    } catch (error) {
      toast.error('Failed to fetch event details');
    } finally {
      setLoading(prev => ({ ...prev, event: false }));
    }
  };

  const fetchVolunteers = async () => {
    try {
      setLoading(prev => ({ ...prev, volunteers: true }));
      // Call the backend API to get volunteers for this event
      const response = await fetch(`/api/getvolunteersfor/${eventId}`);
      if (!response.ok) throw new Error('Failed to fetch volunteers');
      
      const data = await response.json();
      setSuggestedVolunteers(data.suggestedVolunteers || []);
      setRegisteredVolunteers(data.registeredVolunteers || []);
    } catch (error) {
      toast.error('Failed to fetch volunteers');
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(prev => ({ ...prev, volunteers: false }));
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
      const response = await fetch('/api/updatetaskforuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vid: newTask.volunteerId,
          eid: eventId,
          task: {
            name: newTask.name,
            deadline: newTask.deadline
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to assign task');

      toast.success('Task assigned successfully');
      setNewTask({ name: '', deadline: '', volunteerId: '' });
      setIsAddingTask(false);
      // Refresh volunteer lists
      fetchVolunteers();
    } catch (error) {
      toast.error('Failed to assign task');
      console.error('Error assigning task:', error);
    } finally {
      setLoading(prev => ({ ...prev, taskAssignment: false }));
    }
  };

  const VolunteerCard = ({ volunteer }: { volunteer: Volunteer }) => (
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
            {volunteer.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
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
                    <VolunteerCard key={volunteer.id} volunteer={volunteer} />
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

        {/* Task Assignment Section */}
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-red-100 dark:border-red-900/20">
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
      </div>

      <Footer />
    </div>
  );
};

export default ManageEvent; 