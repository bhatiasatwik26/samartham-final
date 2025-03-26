import React from "react";
import { Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EventCardProps {
  eventName: string;
  volunteerCount: number;
  participantCount: number;
  className?: string;
}

const EventCard: React.FC<EventCardProps> = ({
  eventName,
  volunteerCount,
  participantCount,
  className,
}) => {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md bg-white text-gray-900 border border-gray-300 rounded-lg",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl font-semibold">
          {eventName}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Volunteer Section */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" aria-label="Volunteers" />
            <div className="flex justify-between w-full">
              <span className="text-sm text-gray-700">Volunteers</span>
              <span className="font-medium">{volunteerCount}</span>
            </div>
          </div>

          {/* Participant Section */}
          <div className="flex items-center gap-2">
            <Calendar
              className="h-4 w-4 text-blue-600"
              aria-label="Participants"
            />
            <div className="flex justify-between w-full">
              <span className="text-sm text-gray-700">Participants</span>
              <span className="font-medium">{participantCount}</span>
            </div>
          </div>
        </div>

        {/* Accessible Progress Bar */}
        <div className="h-2 w-full rounded-full overflow-hidden bg-gray-200">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                (volunteerCount / participantCount) * 100
              )}%`,
            }}
            aria-label="Volunteer participation ratio"
          />
        </div>

        <div className="text-xs text-gray-600 text-right">
          {((volunteerCount / participantCount) * 100).toFixed(1)}% volunteer
          ratio
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
