import React from "react";
import { Calendar, Users } from "lucide-react";
import EventStatsCard from "./ReportEventStats";
import EventBarChart from "./ReportBarChats";
import EventCard from "./ReportEvent";
import EventReportHeader from "./ReportHeader";

interface EventData {
  eventname: string;
  volunteer: number;
  participant: number;
}

interface EventReportsProps {
  data: EventData[];
}

const EventReports: React.FC<EventReportsProps> = ({ data }) => {
  // Calculate total stats
  const totalVolunteers = data.reduce((acc, event) => acc + event.volunteer, 0);
  const totalParticipants = data.reduce(
    (acc, event) => acc + event.participant,
    0
  );
  const averageVolunteers = Math.round(totalVolunteers / data.length);
  const averageParticipants = Math.round(totalParticipants / data.length);

  // Find event with highest participation
  const mostPopularEvent = [...data].sort(
    (a, b) => b.participant - a.participant
  )[0];

  // Find event with highest volunteer-to-participant ratio
  const bestRatioEvent = [...data].sort(
    (a, b) => b.volunteer / b.participant - a.volunteer / a.participant
  )[0];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3/4">
      <EventReportHeader totalEvents={data.length} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <EventStatsCard
          title="Total Volunteers"
          value={totalVolunteers}
          icon={<Users className="h-4 w-4" />}
        />
        <EventStatsCard
          title="Total Participants"
          value={totalParticipants}
          icon={<Users className="h-4 w-4" />}
        />
        <EventStatsCard
          title="Avg. Volunteers per Event"
          value={averageVolunteers}
        />
        <EventStatsCard
          title="Avg. Participants per Event"
          value={averageParticipants}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <EventBarChart data={data} className="lg:col-span-2" />
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Most Popular Event</h3>
            <EventCard
              eventName={mostPopularEvent.eventname}
              volunteerCount={mostPopularEvent.volunteer}
              participantCount={mostPopularEvent.participant}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Best Volunteer Ratio</h3>
            <EventCard
              eventName={bestRatioEvent.eventname}
              volunteerCount={bestRatioEvent.volunteer}
              participantCount={bestRatioEvent.participant}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((event, index) => (
            <EventCard
              key={index}
              eventName={event.eventname}
              volunteerCount={event.volunteer}
              participantCount={event.participant}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventReports;
