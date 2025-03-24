import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { events as allEvents } from "@/data/events";

// Mock events for the form
const eventOptions = [
  { 
    id: 'event-1', 
    title: 'Run for Vision 2024',
    date: 'August 15, 2024',
    location: 'Cubbon Park, Bengaluru',
    tasks: ['Registration Desk', 'Route Marshal', 'Water Station', 'Medical Support', 'Photography']
  },
  { 
    id: 'event-2', 
    title: 'Annual Charity Marathon',
    date: 'September 5, 2024',
    location: 'Lalbagh Botanical Garden, Bengaluru',
    tasks: ['Check-in Counter', 'Route Guide', 'Refreshment Distribution', 'First Aid Support', 'Media Coverage']
  },
  { 
    id: 'event-3', 
    title: 'Awareness Workshop',
    date: 'July 25, 2024',
    location: 'Samarthanam Trust Headquarters',
    tasks: ['Setup Coordination', 'Registration Management', 'Speaker Assistance', 'Technical Support', 'Cleanup']
  },
  { 
    id: 'event-4', 
    title: 'Cultural Festival',
    date: 'October 10, 2024',
    location: 'Freedom Park, Bengaluru',
    tasks: ['Stage Management', 'Artist Coordination', 'Audience Assistance', 'Stall Setup', 'Event Documentation']
  }
];

const VolunteerRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    selectedEvent: '',
    selectedTasks: [],
    preferredRole: '',
    additionalInfo: ''
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleEventSelect = (eventId) => {
    setFormData(prev => ({
      ...prev,
      selectedEvent: eventId,
      selectedTasks: [] // Reset tasks when event changes
    }));
    
    // Find the selected event to display its tasks
    const event = eventOptions.find(event => event.id === eventId);
    setSelectedEvent(event);
  };
  
  const handleTaskToggle = (task) => {
    setFormData(prev => {
      const tasks = [...prev.selectedTasks];
      
      if (tasks.includes(task)) {
        // Remove the task if already selected
        return {
          ...prev,
          selectedTasks: tasks.filter(t => t !== task)
        };
      } else {
        // Add the task if not selected
        return {
          ...prev,
          selectedTasks: [...tasks, task]
        };
      }
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form
    if (!formData.name) {
      toast.error('Please enter your name');
      setLoading(false);
      return;
    }
    
    if (!formData.selectedEvent) {
      toast.error('Please select an event');
      setLoading(false);
      return;
    }
    
    if (formData.selectedTasks.length === 0) {
      toast.error('Please select at least one task');
      setLoading(false);
      return;
    }
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast.success('Registration successful!', {
        description: 'You have been registered as a volunteer.',
      });
      
      // Navigate to volunteer dashboard
      navigate('/volunteer-dashboard');
    }, 1500);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Volunteer Registration</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Register as a volunteer to help with our events and make a difference.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Select an Event to Volunteer For</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventOptions.map((event) => (
              <div 
                key={event.id}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all",
                  formData.selectedEvent === event.id 
                    ? "border-red-500 bg-red-50 dark:bg-red-900/10" 
                    : "border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700"
                )}
                onClick={() => handleEventSelect(event.id)}
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{event.title}</h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1.5" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedEvent && (
          <div className="space-y-3">
            <Label>Select Tasks You'd Like to Help With</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              {selectedEvent.tasks.map((task) => (
                <div key={task} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`task-${task}`}
                    checked={formData.selectedTasks.includes(task)}
                    onCheckedChange={() => handleTaskToggle(task)}
                    className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <Label htmlFor={`task-${task}`} className="cursor-pointer">{task}</Label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          <Label>Preferred Volunteer Role</Label>
          <RadioGroup 
            value={formData.preferredRole}
            onValueChange={(value) => setFormData(prev => ({ ...prev, preferredRole: value }))}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="lead" 
                  id="role-lead"
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" 
                />
                <Label htmlFor="role-lead">Team Lead</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="assistant" 
                  id="role-assistant"
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" 
                />
                <Label htmlFor="role-assistant">Assistant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="coordinator" 
                  id="role-coordinator"
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" 
                />
                <Label htmlFor="role-coordinator">Coordinator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="general" 
                  id="role-general"
                  className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" 
                />
                <Label htmlFor="role-general">General Volunteer</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            placeholder="Tell us any additional information that might help (e.g., special skills, availability, etc.)"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            className="h-24"
          />
        </div>
        
        <Button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full bg-red-600 hover:bg-red-700 text-white",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? "Registering..." : "Register as Volunteer"}
        </Button>
      </form>
    </div>
  );
};

export default VolunteerRegistrationForm; 