import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Event } from "@/types/report";
import { format } from "date-fns";

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

interface EventListProps {
  events: EventData[];
  onEventClick: (eventId: string) => void;
}

export const EventList = ({ events, onEventClick }: EventListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((event) =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative animate-fade-in">
        <Input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:max-w-sm pl-10 glass-card border-0 shadow-sm"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <Card
            key={event.eventId}
            className="overflow-hidden card-hover glass-card border-0 animate-scale-in cursor-pointer"
            style={{ animationDelay: `${0.1 * index}s` }}
            onClick={() => onEventClick(event.eventId)}
          >
            <div className="relative h-40">
              <img
                src={event.eventImage[0]}
                alt={event.eventName}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                {format(new Date(event.eventDate), "MMM d, yyyy")}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 truncate">
                {event.eventName}
              </h3>
              <div className="flex justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>{event.participantCount} Participants</span>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-4 w-4 mr-1 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>{event.volunteerCount} Volunteers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-gray-500">
            No events found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};
