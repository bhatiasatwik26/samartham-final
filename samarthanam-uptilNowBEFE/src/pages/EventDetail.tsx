import { useParams, Link, useNavigate } from "react-router-dom";
// import { Event } from "@/data/events";
import EventHero from "@/components/EventHero";
import EventSchedule from "@/components/EventSchedule";
import RegistrationForm from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  PencilIcon,
  Calendar,
  Clock,
  MapPin,
  AlarmClock,
  Save,
  X,
} from "lucide-react";
import { fetchEventById, registerForEvent } from "@/services/eventsApi";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface GeographicalLocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

// Ratings Interface
interface Ratings {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

// Schedule Item Interface
interface ScheduleItem {
  time: string;
  heading: string;
  details: string;
  _id: string;
}

// Main Event Interface
interface Event {
  _id: string;
  name: string;
  location: string;
  date: string;
  description: string;
  photos: string[];
  category: string;
  registrationStart: string;
  registrationEnd: string;
  eventStart: string;
  eventEnd: string;
  geographicalLocation: GeographicalLocation;
  ratings: Ratings;
  reviews: string[];
  schedule: ScheduleItem[];
  volunteersAssigned: string[]; // Array of volunteer IDs or empty if none
  __v: number;
}

const formatDate = (timestamp) => {
  try {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid date";
  }
};

const formatTime = (timestamp) => {
  try {
    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Ensures AM/PM format
    });
  } catch (error) {
    console.error("Error parsing time:", error);
    return "Invalid time";
  }
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Fetch event data
  useEffect(() => {
    const getEventDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const eventData = await fetchEventById(id);
        console.log(eventData);
        if (eventData) {
          setEvent(eventData);
        }

        setError(null);
      } catch (err) {
        setError("Failed to load event details. Please try again later.");
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };

    getEventDetails();
  }, [id]);

  // Handle form input changes

  // Save event changes
  // const handleSaveChanges = async () => {
  //   if (!id || !event) return;

  //   try {
  //     setLoading(true);
  //     const updatedEvent = await updateEvent(id, editFormData);
  //     setEvent(updatedEvent);
  //     setIsEditing(false);
  //     alert("Event updated successfully!");
  //   } catch (err) {
  //     console.error("Error updating event:", err);
  //     alert("Failed to update event. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        <p className="text-gray-600 mb-6">
          {error ||
            "The event you're looking for doesn't exist or has been removed."}
        </p>
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
      {/* Back to Events Button */}
      <div className="container mx-auto px-6 pt-6">
        <Button
          variant="outline"
          asChild
          className="mb-4 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Link to="/events" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Link>
        </Button>
      </div>

      
          {/* Hero Section */}
          <EventHero
            title={event.name}
            subtitle={event.category}
            description={event.description}
            date={formatDate(event.eventStart)}
            time={formatTime(event.eventStart)}
            location={event.location}
            imageUrl={event.photos[0]}
            showButtons={false}
          />

          {/* Event Schedule */}
          <EventSchedule
            title="Event Schedule"
            subtitle="Timeline"
            scheduleItems={event.schedule}
          />

          {/* Registration Form or Success Message */}
          {registrationSuccess ? (
            <div className="py-16 bg-green-50 dark:bg-green-900/20">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">
                    Registration Successful!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Thank you for registering for {event.name}. We've sent a
                    confirmation email with all the details.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-red-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-red-500" />
                      <span>{formatTime(event.eventStart)}</span>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                      <MapPin className="mr-2 h-4 w-4 text-red-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Button
                    className="mt-6 bg-red-600 hover:bg-red-800 text-white"
                    onClick={() => navigate("/events")}
                  >
                    Browse More Events
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <RegistrationForm
              title={`Register for ${event.name}`}
              subtitle={event.category}
             
            />
          )}  
    </div>
  );
};

export default EventDetail;
