import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInView } from "@/lib/animate";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, Clock, MapPin, Users, Star, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const upcomingEvents = [
  {
    id: 1,
    title: "Run for Vision 2024",
    date: "August 15, 2024",
    time: "6:00 AM - 10:00 AM",
    location: "Cubbon Park, Bengaluru",
    participants: 156,
    image: "/images/volunteers-working.jpg",
    isRegistered: false,
  },
  {
    id: 2,
    title: "Annual Charity Marathon",
    date: "September 5, 2024",
    time: "7:00 AM - 11:00 AM",
    location: "Lalbagh Botanical Garden, Bengaluru",
    participants: 203,
    image: "/images/volunteers-working.jpg",
    isRegistered: true,
  },
];

const pastEvents = [
  {
    id: 3,
    title: "Awareness Workshop",
    date: "July 25, 2024",
    time: "10:00 AM - 1:00 PM",
    location: "Samarthanam Trust Headquarters",
    participants: 45,
    image: "/images/volunteers-working.jpg",
    status: "Completed",
    hasFeedback: false,
  },
  {
    id: 4,
    title: "Charity Gala",
    date: "June 12, 2024",
    time: "6:30 PM - 9:30 PM",
    location: "Shangri-La Hotel, Bengaluru",
    participants: 120,
    image: "/images/volunteers-working.jpg",
    status: "Completed",
    hasFeedback: true,
  },
];

const ParticipantDashboard = () => {
  const { ref, isVisible } = useInView();
  const navigate = useNavigate();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [events, setEvents] = useState(upcomingEvents);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState("");

  // Handler for opening the feedback modal
  const handleFeedbackClick = (event) => {
    setCurrentEvent(event);
    setRating(0);
    setFeedbackText("");
    setFeedbackOpen(true);
  };

  // Handler for opening the registration modal
  const handleRegisterClick = (event) => {
    setCurrentEvent(event);
    setAcceptTerms(false);
    setSpecialRequirements("");
    setRegisterOpen(true);
  };

  // Handler for submitting feedback
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    setSubmitting(true);

    try {
      // Mock API call - replace with actual API call when backend is ready
      // This is where you would connect to your backend
      // const response = await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     eventId: currentEvent.id,
      //     rating,
      //     feedback: feedbackText,
      //     userId: 'current-user-id' // Get from auth context or similar
      //   }),
      // });

      // Mock successful response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the UI to show feedback was given
      const updatedPastEvents = pastEvents.map((event) => {
        if (event.id === currentEvent.id) {
          return { ...event, hasFeedback: true };
        }
        return event;
      });

      // In a real implementation, you'd update state
      // setPastEvents(updatedPastEvents);

      setFeedbackOpen(false);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for submitting registration
  const handleSubmitRegistration = async () => {
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    setRegistering(true);

    try {
      // Mock API call - replace with actual API call when backend is ready
      // const response = await fetch('/api/register-event', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     eventId: currentEvent.id,
      //     userId: 'current-user-id', // Get from auth context or similar
      //     specialRequirements: specialRequirements
      //   }),
      // });

      // Mock successful response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state to reflect registration
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === currentEvent.id
            ? {
                ...event,
                isRegistered: true,
                participants: event.participants + 1,
              }
            : event
        )
      );

      setRegisterOpen(false);
      toast.success("Registration successful!", {
        description: `You are now registered for ${currentEvent.title}.`,
      });
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error("Failed to register. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="pt-32 pb-16">
        <div className="container mx-auto px-6" ref={ref}>
          <div
            className={cn(
              "transition-all duration-700 transform",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Participant Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome back! Manage your event registrations and activities.
                </p>
              </div>
              <Button
                className="mt-6 md:mt-0 bg-red-600 hover:bg-red-800"
                onClick={() => navigate("/events")}
              >
                Browse All Events
              </Button>
            </div>

            <Tabs defaultValue="upcoming" className="w-full mt-6">
              <div className="flex justify-center md:justify-start mb-8">
                <TabsList className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-red-600 rounded-md px-10 py-2"
                  >
                    Upcoming Events
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-red-600 rounded-md px-10 py-2"
                  >
                    Past Events
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upcoming" className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {events.map((event) => (
                    <Card
                      key={event.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow h-full"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-5 text-white">
                          <h3 className="text-xl font-bold">{event.title}</h3>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="space-y-4">
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span className="text-sm">{event.date}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Clock className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span className="text-sm">{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Users className="w-4 h-4 mr-3 flex-shrink-0" />
                            <span className="text-sm">
                              {event.participants} participants
                            </span>
                          </div>

                          {event.isRegistered ? (
                            <Button
                              className="w-full mt-3 bg-green-600 hover:bg-green-700 cursor-default"
                              disabled
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Registered
                            </Button>
                          ) : (
                            <Button
                              className="w-full mt-3 bg-red-600 hover:bg-red-800"
                              onClick={() => handleRegisterClick(event)}
                            >
                              Register Now
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="past" className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Past Events
                </h2>
                {pastEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {pastEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow h-full"
                      >
                        <div className="aspect-video relative">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 p-5 text-white">
                            <h3 className="text-xl font-bold">{event.title}</h3>
                            <span className="inline-block px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded mt-2">
                              {event.status}
                            </span>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <div className="space-y-4">
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
                              <span className="text-sm">{event.date}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <Clock className="w-4 h-4 mr-3 flex-shrink-0" />
                              <span className="text-sm">{event.time}</span>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                              <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-3">
                              <Button
                                variant="outline"
                                className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                                onClick={() => navigate(`/event/${event.id}`)}
                              >
                                View Details
                              </Button>

                              {event.hasFeedback ? (
                                <Button
                                  variant="secondary"
                                  className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 cursor-default"
                                  disabled
                                >
                                  <Star className="h-4 w-4 mr-2 fill-green-500" />
                                  Feedback Submitted
                                </Button>
                              ) : (
                                <Button
                                  variant="secondary"
                                  className="flex-1 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100"
                                  onClick={() => handleFeedbackClick(event)}
                                >
                                  <Star className="h-4 w-4 mr-2" />
                                  Give Feedback
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300">
                      You haven't participated in any events yet.
                    </p>
                    <Button
                      className="mt-6 bg-red-600 hover:bg-red-800"
                      onClick={() => navigate("/events")}
                    >
                      Browse Events
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Feedback</DialogTitle>
            <DialogDescription>
              {currentEvent?.title
                ? `Share your experience about "${currentEvent.title}"`
                : "Share your experience about this event"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-5">
              <Label
                htmlFor="rating"
                className="block text-sm font-medium mb-2"
              >
                How would you rate this event?
              </Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full transition-all`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback" className="block text-sm font-medium">
                Your feedback (optional)
              </Label>
              <Textarea
                id="feedback"
                placeholder="Tell us what you liked or how we can improve..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-red-600 hover:bg-red-700 sm:w-auto"
              onClick={handleSubmitFeedback}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Registration Dialog */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Registration</DialogTitle>
            <DialogDescription>
              {currentEvent?.title
                ? `Register for "${currentEvent.title}"`
                : "Register for this event"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="specialRequirements"
                  className="block text-sm font-medium mb-2"
                >
                  Special Requirements (optional)
                </Label>
                <Textarea
                  id="specialRequirements"
                  placeholder="Any special needs or accommodations we should know about?"
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex items-start space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                    setAcceptTerms(checked === true)
                  }
                  className="mt-1 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions, and acknowledge that I
                  will abide by the event rules and guidelines.
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="sm:w-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-red-600 hover:bg-red-700 sm:w-auto"
              onClick={handleSubmitRegistration}
              disabled={registering}
            >
              {registering ? "Processing..." : "Confirm Registration"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticipantDashboard;
