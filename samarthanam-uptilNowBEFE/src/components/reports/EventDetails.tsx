import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Event, EventDetail } from "@/types/report";
import { format } from "date-fns";
import { RatingDistribution } from "./RatingDistribution";

export interface EventData {
  eventId: string;
  eventName: string;
  eventImage: string[];
  eventDate: string;
  volunteerCount: number;
  participantCount: number;
  rating: string;
  ratingDistribution: {
    [key: string]: number;
  };
}

interface EventDetailsProps {
  event: EventData;

  onBack: () => void;
}

export const EventDetails = ({ event, onBack }: EventDetailsProps) => {
  // Generate star rating display
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    // Half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          className="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="half-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half-gradient)"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      );
    }

    // Empty stars
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-5 h-5 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to events
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card animate-scale-in">
            <div className="relative h-60 md:h-80">
              <img
                src={event.eventImage[0]}
                alt={event.eventName}
                className="object-cover w-full h-full rounded-t-lg"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{event.eventName}</h2>
                <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                  {format(new Date(event.eventDate), "MMMM d, yyyy")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 font-medium">
                    Event ID
                  </h3>
                  <p className="font-mono text-sm">{event.eventId}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 font-medium">
                    Event Type
                  </h3>
                  <p>{event.eventName.split(" ")[0]}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 font-medium">
                    Participants
                  </h3>
                  <p className="flex items-center">
                    <span className="font-semibold text-lg mr-2">
                      {event.participantCount}
                    </span>
                    <span className="text-sm text-gray-500">
                      registered attendees
                    </span>
                  </p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm text-gray-500 font-medium">
                    Volunteers
                  </h3>
                  <p className="flex items-center">
                    <span className="font-semibold text-lg mr-2">
                      {event.volunteerCount}
                    </span>
                    <span className="text-sm text-gray-500">support staff</span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm text-gray-500 font-medium mb-3">
                  Participant-to-Volunteer Ratio
                </h3>
                <div className="relative h-7 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500"
                    style={{
                      width: `${
                        (event.volunteerCount /
                          (event.participantCount + event.volunteerCount)) *
                        100
                      }%`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    {Math.round(
                      (event.participantCount / event.volunteerCount) * 10
                    ) / 10}
                    :1 ratio
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <RatingDistribution details={event.ratingDistribution} />
        </div>

        <div>
          <Card
            className="glass-card h-full animate-scale-in"
            style={{ animationDelay: "0.1s" }}
          >
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Event Feedback</h3>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {renderStars(Number(event.rating))}
                  </div>
                  <span className="text-sm font-medium">
                    {event.rating}/5.0
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  {/* <p className="text-gray-600 italic">
                    "{details.review.review}"
                  </p> */}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-500">
                  KEY METRICS
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      Participant Ratio
                    </p>
                    <p className="font-semibold">
                      {Math.round(
                        (event.volunteerCount / event.participantCount) * 100
                      )}
                      %
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      Volunteer Ratio
                    </p>
                    <p className="font-semibold">
                      {Math.round(
                        (event.volunteerCount / event.participantCount) * 100
                      )}
                      %
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Satisfaction</p>
                    <p className="font-semibold">
                      {/* {Math.round((details.review.noOfstar / 5) * 100)}% */}
                      {event.rating}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Efficiency</p>
                    <p className="font-semibold">
                      {Math.round(
                        (event.participantCount / event.volunteerCount / 5) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
