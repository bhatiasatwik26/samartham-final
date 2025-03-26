import React from "react";
import { Calendar, Users } from "lucide-react";
import EventStatsCard from "./reports/ReportEventStats";
import EventBarChart from "./reports/ReportBarChats";
import EventCard from "./reports/ReportEvent";
import EventReportHeader from "./reports/ReportHeader";

export interface EventData {
  eventId: string;
  eventName: string;
  eventImage: string[];
  eventDate: string;
  volunteerCount: number;
  participantCount: number;
  rating: string;
  ratingDistribution: {
    [key: string]: number; // Rating distribution as { "5": 10, "4": 8, ... }
  };
}

interface EventReportsProps {
  reports: EventData[];
}

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  ReportOverview,
  EventList,
  EventDetails,
  LoadingSpinner,
} from "@/components/reports";
// import { useReportData } from "@/hooks/use-report-data";

const Reports = ({ reports }: EventReportsProps) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  // const { isLoading, reports, events, eventDetails } = useReportData();

  const totalVolunteers = reports.reduce(
    (acc, event) => acc + event.volunteerCount,
    0
  );
  const totalParticipants = reports.reduce(
    (acc, event) => acc + event.participantCount,
    0
  );
  const averageVolunteers = Math.round(totalVolunteers / reports.length);
  const averageParticipants = Math.round(totalParticipants / reports.length);

  const mostPopularEvent = [...reports].sort(
    (a, b) => b.participantCount - a.participantCount
  )[0];

  const bestRatioEvent = [...reports].sort(
    (a, b) =>
      b.volunteerCount / b.participantCount -
      a.volunteerCount / a.participantCount
  )[0];

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleBackToList = () => {
    setSelectedEventId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Event Reports
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Analyze and evaluate the performance of your events
          </p>
        </header>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="animate-scale-in"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 rounded-full p-1 bg-white shadow-sm">
            <TabsTrigger
              value="overview"
              className="rounded-full tab-transition data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="rounded-full tab-transition data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 animate-fade-in">
            {/* {isLoading ? (
              <LoadingSpinner />
            ) : ( */}
            <ReportOverview reports={reports} />
            {/* )} */}
          </TabsContent>

          <TabsContent value="events" className="mt-6 animate-fade-in">
            {
              // isLoading ? (
              //   <LoadingSpinner />) :
              selectedEventId ? (
                <EventDetails
                  event={reports.find((e) => e.eventId === selectedEventId)!}
                  onBack={handleBackToList}
                />
              ) : (
                <EventList events={reports} onEventClick={handleEventClick} />
              )
            }
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
// const EventReports: React.FC<EventReportsProps> = ({ data }) => {
//   // Calculate total stats
//   const totalVolunteers = data.reduce((acc, event) => acc + event.volunteer, 0);
//   const totalParticipants = data.reduce(
//     (acc, event) => acc + event.participant,
//     0
//   );
//   const averageVolunteers = Math.round(totalVolunteers / data.length);
//   const averageParticipants = Math.round(totalParticipants / data.length);

//   // Find event with highest participation
//   const mostPopularEvent = [...data].sort(
//     (a, b) => b.participant - a.participant
//   )[0];

//   // Find event with highest volunteer-to-participant ratio
//   const bestRatioEvent = [...data].sort(
//     (a, b) => b.volunteer / b.participant - a.volunteer / a.participant
//   )[0];

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-3/4">
//       <EventReportHeader totalEvents={data.length} />

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <EventStatsCard
//           title="Total Volunteers"
//           value={totalVolunteers}
//           icon={<Users className="h-4 w-4" />}
//         />
//         <EventStatsCard
//           title="Total Participants"
//           value={totalParticipants}
//           icon={<Users className="h-4 w-4" />}
//         />
//         <EventStatsCard
//           title="Avg. Volunteers per Event"
//           value={averageVolunteers}
//         />
//         <EventStatsCard
//           title="Avg. Participants per Event"
//           value={averageParticipants}
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         <EventBarChart data={data} className="lg:col-span-2" />
//         <div className="space-y-6">
//           <div className="space-y-2">
//             <h3 className="text-lg font-medium">Most Popular Event</h3>
//             <EventCard
//               eventName={mostPopularEvent.eventname}
//               volunteerCount={mostPopularEvent.volunteer}
//               participantCount={mostPopularEvent.participant}
//             />
//           </div>
//           <div className="space-y-2">
//             <h3 className="text-lg font-medium">Best Volunteer Ratio</h3>
//             <EventCard
//               eventName={bestRatioEvent.eventname}
//               volunteerCount={bestRatioEvent.volunteer}
//               participantCount={bestRatioEvent.participant}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold">All Events</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {data.map((event, index) => (
//             <EventCard
//               key={index}
//               eventName={event.eventname}
//               volunteerCount={event.volunteer}
//               participantCount={event.participant}
//               className="animate-scale-in"
//               style={{ animationDelay: `${index * 0.05}s` }}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventReports;
