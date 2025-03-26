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
        "overflow-hidden transition-all duration-300 hover:shadow-md animate-scale-in",
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl text-balance line-clamp-1">
          {eventName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex justify-between w-full">
              <span className="text-sm text-muted-foreground">Volunteers</span>
              <span className="font-medium">{volunteerCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex justify-between w-full">
              <span className="text-sm text-muted-foreground">
                Participants
              </span>
              <span className="font-medium">{participantCount}</span>
            </div>
          </div>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: `${Math.min(
                100,
                (volunteerCount / participantCount) * 100
              )}%`,
            }}
          />
        </div>
        <div className="text-xs text-muted-foreground text-right">
          {((volunteerCount / participantCount) * 100).toFixed(1)}% volunteer
          ratio
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
