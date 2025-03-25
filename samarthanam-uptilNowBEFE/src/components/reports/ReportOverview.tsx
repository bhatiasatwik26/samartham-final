import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  LineChart,
  PieChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Users } from "lucide-react";
import EventStatsCard from "./ReportEventStats";
import EventBarChart from "./ReportBarChats";
import EventCard from "./ReportEvent";
import EventReportHeader from "./ReportHeader";
import { Reports } from "@/types/report";

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
interface ReportOverviewProps {
  reports: EventData[];
}

export const ReportOverview = ({ reports }: ReportOverviewProps) => {
  // Calculate total participants and volunteers
  const totalParticipants = reports.reduce(
    (acc, report) => acc + report.participantCount,
    0
  );
  const totalVolunteers = reports.reduce(
    (acc, report) => acc + report.volunteerCount,
    0
  );
  const averageParticipants = Math.round(totalParticipants / reports.length);
  const averageVolunteers = Math.round(totalVolunteers / reports.length);

  const mostPopularEvent = [...reports].sort(
    (a, b) => b.participantCount - a.participantCount
  )[0];

  const bestRatioEvent = [...reports].sort(
    (a, b) =>
      b.volunteerCount / b.participantCount -
      a.volunteerCount / a.participantCount
  )[0];

  // Data for pie chart
  const pieData = [
    { name: "Participants", value: totalParticipants, color: "#0088FE" },
    { name: "Volunteers", value: totalVolunteers, color: "#00C49F" },
  ];

  // Colors for bar chart
  const COLORS = ["#8884d8", "#82ca9d"];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3/4">
      <EventReportHeader totalEvents={reports.length} />

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
        <EventBarChart data={reports} className="lg:col-span-2" />
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Most Popular Event</h3>
            <EventCard
              eventName={mostPopularEvent.eventName}
              volunteerCount={mostPopularEvent.volunteerCount}
              participantCount={mostPopularEvent.participantCount}
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Best Volunteer Ratio</h3>
            <EventCard
              eventName={bestRatioEvent.eventName}
              volunteerCount={bestRatioEvent.volunteerCount}
              participantCount={bestRatioEvent.participantCount}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">All Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((event, index) => (
            <EventCard
              key={index}
              eventName={event.eventName}
              volunteerCount={event.volunteerCount}
              participantCount={event.participantCount}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  //   return (
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  //       {/* Summary Cards */}
  //       <Card
  //         className="glass-card animate-scale-in"
  //         style={{ animationDelay: "0.1s" }}
  //       >
  //         <CardHeader className="pb-2">
  //           <CardTitle className="text-sm font-medium text-gray-500">
  //             Total Events
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-3xl font-bold">{reports.length}</div>
  //           <p className="text-xs text-gray-500 mt-1">Past events analysis</p>
  //         </CardContent>
  //       </Card>

  //       <Card
  //         className="glass-card animate-scale-in"
  //         style={{ animationDelay: "0.2s" }}
  //       >
  //         <CardHeader className="pb-2">
  //           <CardTitle className="text-sm font-medium text-gray-500">
  //             Total Participants
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-3xl font-bold">{totalParticipants}</div>
  //           <p className="text-xs text-gray-500 mt-1">Across all events</p>
  //         </CardContent>
  //       </Card>

  //       <Card
  //         className="glass-card animate-scale-in"
  //         style={{ animationDelay: "0.3s" }}
  //       >
  //         <CardHeader className="pb-2">
  //           <CardTitle className="text-sm font-medium text-gray-500">
  //             Total Volunteers
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-3xl font-bold">{totalVolunteers}</div>
  //           <p className="text-xs text-gray-500 mt-1">Support team members</p>
  //         </CardContent>
  //       </Card>

  //       <Card
  //         className="glass-card animate-scale-in"
  //         style={{ animationDelay: "0.4s" }}
  //       >
  //         <CardHeader className="pb-2">
  //           <CardTitle className="text-sm font-medium text-gray-500">
  //             Avg. Participants
  //           </CardTitle>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-3xl font-bold">{averageParticipants}</div>
  //           <p className="text-xs text-gray-500 mt-1">Per event average</p>
  //         </CardContent>
  //       </Card>

  //       {/* Charts */}
  //       <Card
  //         className="col-span-1 md:col-span-2 glass-card animate-fade-in"
  //         style={{ animationDelay: "0.5s" }}
  //       >
  //         <CardHeader>
  //           <CardTitle>Participation by Event</CardTitle>
  //         </CardHeader>
  //         <CardContent className="h-80">
  //           <ResponsiveContainer width="100%" height="100%">
  //             <BarChart
  //               data={reports}
  //               margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
  //             >
  //               <CartesianGrid strokeDasharray="3 3" />
  //               <XAxis
  //                 dataKey="eventname"
  //                 angle={-45}
  //                 textAnchor="end"
  //                 height={70}
  //               />
  //               <YAxis />
  //               <Tooltip />
  //               <Legend />
  //               <Bar
  //                 dataKey="participant"
  //                 name="Participants"
  //                 fill="#8884d8"
  //                 radius={[4, 4, 0, 0]}
  //               />
  //               <Bar
  //                 dataKey="volunteer"
  //                 name="Volunteers"
  //                 fill="#82ca9d"
  //                 radius={[4, 4, 0, 0]}
  //               />
  //             </BarChart>
  //           </ResponsiveContainer>
  //         </CardContent>
  //       </Card>

  //       <Card
  //         className="col-span-1 md:col-span-2 glass-card animate-fade-in"
  //         style={{ animationDelay: "0.6s" }}
  //       >
  //         <CardHeader>
  //           <CardTitle>Participant to Volunteer Ratio</CardTitle>
  //         </CardHeader>
  //         <CardContent className="h-80">
  //           <ResponsiveContainer width="100%" height="100%">
  //             <PieChart>
  //               <Pie
  //                 data={pieData}
  //                 cx="50%"
  //                 cy="50%"
  //                 labelLine={false}
  //                 outerRadius={80}
  //                 fill="#8884d8"
  //                 dataKey="value"
  //                 label={({ name, percent }) =>
  //                   `${name} ${(percent * 100).toFixed(0)}%`
  //                 }
  //               >
  //                 {pieData.map((entry, index) => (
  //                   <Cell key={`cell-${index}`} fill={entry.color} />
  //                 ))}
  //               </Pie>
  //               <Tooltip />
  //               <Legend />
  //             </PieChart>
  //           </ResponsiveContainer>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
};
