import { useParams, Link, useNavigate } from 'react-router-dom';
import { Event } from '@/data/events';
import EventHero from '@/components/EventHero';
import EventSchedule from '@/components/EventSchedule';
import RegistrationForm from '@/components/RegistrationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PencilIcon, Calendar, Clock, MapPin, AlarmClock, Save, X } from 'lucide-react';
import { fetchEventById, updateEvent, registerForEvent } from '@/services/eventsApi';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // In a real app, this would come from auth context
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Event>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Fetch event data
  useEffect(() => {
    const getEventDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const eventData = await fetchEventById(id);
        setEvent(eventData);
        setEditFormData(eventData);
        setError(null);
      } catch (err) {
        setError("Failed to load event details. Please try again later.");
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };

    getEventDetails();
    
    // In a real app, check if user is admin
    // This is just a placeholder
    setIsAdmin(localStorage.getItem('userRole') === 'admin');
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save event changes
  const handleSaveChanges = async () => {
    if (!id || !event) return;
    
    try {
      setLoading(true);
      const updatedEvent = await updateEvent(id, editFormData);
      setEvent(updatedEvent);
      setIsEditing(false);
      alert("Event updated successfully!");
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Register for event
  const handleRegister = async () => {
    if (!id) return;
    
    try {
      // In a real app, you'd get the userId from auth context
      const userId = "user123"; 
      const result = await registerForEvent(id, userId);
      
      if (result.success) {
        setRegistrationSuccess(true);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist or has been removed."}</p>
        <Button asChild className="bg-red-600 hover:bg-red-800 text-white">
          <Link to="/events" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border-b border-amber-200 dark:border-amber-700">
          <div className="container mx-auto px-6 py-2 flex justify-between items-center">
            <div className="text-amber-800 dark:text-amber-300 text-sm font-medium">
              Admin Mode
            </div>
            {!isEditing ? (
              <Button 
                variant="outline" 
                size="sm"
                className="text-amber-600 border-amber-300 hover:bg-amber-100 dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-900"
                onClick={() => setIsEditing(true)}
              >
                <PencilIcon className="mr-2 h-4 w-4" /> Edit Event
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-100 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900"
                  onClick={() => {
                    setIsEditing(false);
                    setEditFormData(event);
                  }}
                >
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-green-600 border-green-300 hover:bg-green-100 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900"
                  onClick={handleSaveChanges}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back to Events Button */}
      <div className="container mx-auto px-6 pt-6">
        <Button variant="outline" asChild className="mb-4 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
          <Link to="/events" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>

      {isEditing ? (
        /* Edit Form */
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-serif font-bold text-red-950 dark:text-white">
                Edit Event Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    name="title"
                    value={editFormData.title || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle/Category</label>
                  <Input
                    name="subtitle"
                    value={editFormData.subtitle || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    name="description"
                    value={editFormData.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input
                      name="date"
                      value={editFormData.date || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <Input
                      name="time"
                      value={editFormData.time || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input
                    name="location"
                    value={editFormData.location || ''}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input
                    name="imageUrl"
                    value={editFormData.imageUrl || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <EventHero 
            title={event.title}
            subtitle={event.subtitle}
            description={event.description}
            date={event.date}
            time={event.time}
            location={event.location}
            imageUrl={event.imageUrl}
            showButtons={false}
          />

          {/* Event Schedule */}
          <EventSchedule 
            title="Event Schedule"
            subtitle="Timeline"
            scheduleItems={event.scheduleItems}
          />

          {/* Registration Form or Success Message */}
          {registrationSuccess ? (
            <div className="py-16 bg-green-50 dark:bg-green-900/20">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Registration Successful!</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Thank you for registering for {event.title}. We've sent a confirmation email with all the details.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-red-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-red-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-red-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button 
                    className="mt-6 bg-red-600 hover:bg-red-800 text-white"
                    onClick={() => navigate('/events')}
                  >
                    Browse More Events
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <RegistrationForm 
              title={`Register for ${event.title}`}
              subtitle={event.subtitle}
              onSubmit={() => handleRegister(id || '')}
            />
          )}
        </>
      )}
    </div>
  );
};

export default EventDetail;
